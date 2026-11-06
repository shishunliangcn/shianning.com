import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

/**
 * 移动端可用的语音朗读封装。
 *
 * 关键约束（iOS Safari / Android Chrome）：
 * 1. `speechSynthesis.speak()` 必须同步发生在用户手势的调用栈里，
 *    中间只要有 await / setTimeout / Promise.then，就会被判定为「非用户触发」而静音。
 * 2. `getVoices()` 首次调用经常返回空数组（异步加载），
 *    但「等它加载完再 speak」会破坏第 1 条，所以只做缓存预热，绝不用它阻塞朗读。
 */

export interface SpeakOptions {
  lang?: string
  rate?: number
  pitch?: number
}

/** 轮询间隔与次数：500ms × 8，覆盖大多数机型的语音列表加载耗时 */
const POLL_INTERVAL_MS = 500
const POLL_MAX_TRIES = 8

/** 兜底看门狗：这段时间内既没 onstart 也没在播放，就认为被拦截或缺少语音包 */
const WATCHDOG_MS = 1200

/** 模块级共享：同一页面上的多个朗读按钮只预热一次语音列表 */
const supported = ref(false)
/** 语音能力不可用（API 缺失，或 4 秒内拿不到任何语音列表）——此时不应再显示「失败」红态 */
const degraded = ref(false)
const cachedVoices = shallowRef<SpeechSynthesisVoice[]>([])
let warmedUp = false

/** 当前正在朗读的组件实例，避免多个按钮互相 cancel */
let activeOwner: symbol | null = null

/** 兜底播放器：给没有语音引擎的设备（华为 / 鸿蒙等）用外部音频 */
let fallbackAudio: HTMLAudioElement | null = null

function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  )
}

/** 同步读取语音列表，非空时更新缓存；返回当前数量 */
function refreshVoices(): number {
  if (!isBrowser()) return 0
  const list = window.speechSynthesis.getVoices()
  if (list.length > 0) cachedVoices.value = list
  return list.length
}

/**
 * 语音列表预热：立即读一次 → 监听 voiceschanged → 500ms 轮询最多 8 次。
 * 只填充缓存，不阻塞任何朗读调用。
 */
function warmUpVoices(): void {
  if (warmedUp || !isBrowser()) return
  warmedUp = true

  const synth = window.speechSynthesis
  refreshVoices()

  const onVoicesChanged = () => {
    refreshVoices()
  }
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', onVoicesChanged)
  } else {
    synth.onvoiceschanged = onVoicesChanged
  }

  let tries = 0
  const timer = window.setInterval(() => {
    tries += 1
    const count = refreshVoices()
    if (count > 0) {
      degraded.value = false
      window.clearInterval(timer)
    } else if (tries >= POLL_MAX_TRIES) {
      // 4 秒内始终拿不到语音列表：基本可以判定该浏览器不支持朗读
      // （华为 / 鸿蒙的 ArkWeb 是典型情况）
      degraded.value = true
      window.clearInterval(timer)
    }
  }, POLL_INTERVAL_MS)
}

/** 挑选最合适的语音：同区域 > 同语言 > 任意同语种；挑不到就交给浏览器默认 */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const target = lang.toLowerCase().replace('_', '-')
  const base = target.split('-')[0]
  const list = cachedVoices.value.length ? cachedVoices.value : isBrowser() ? window.speechSynthesis.getVoices() : []
  if (!list.length) return null

  return (
    list.find((v) => v.lang?.toLowerCase().replace('_', '-') === target && v.default) ??
    list.find((v) => v.lang?.toLowerCase().replace('_', '-') === target) ??
    list.find((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(base)) ??
    null
  )
}

export function useSpeechSynthesis() {
  const speaking = ref(false)
  const failed = ref(false)
  const owner = Symbol('read-word')
  let watchdog: number | undefined

  onMounted(() => {
    supported.value = isBrowser()
    if (supported.value) warmUpVoices()
  })

  onBeforeUnmount(() => {
    if (watchdog !== undefined && typeof window !== 'undefined') window.clearTimeout(watchdog)
    if (isBrowser() && activeOwner === owner) {
      window.speechSynthesis.cancel()
      activeOwner = null
    }
  })

  /**
   * 朗读文本。返回 false 表示当前环境不支持。
   * 注意：从进入函数到 synth.speak() 之间没有任何异步操作。
   */
  function speak(text: string, options: SpeakOptions = {}): boolean {
    if (!isBrowser()) {
      supported.value = false
      degraded.value = true
      return false
    }

    const synth = window.speechSynthesis
    const lang = options.lang ?? 'en-US'

    /* ---------- 以下必须保持同步，不可插入 await / setTimeout ---------- */

    // iOS 上队列可能停在 paused 状态，先恢复
    if (synth.paused) synth.resume()

    // 只在队列里真的有任务时才 cancel。
    // 无条件 cancel() 紧跟 speak() 是 iOS 上最经典的「点了没声音」原因——
    // 新的 utterance 会被一起清掉。空闲时无需清理，队列本来就是空的。
    if (synth.speaking || synth.pending) synth.cancel()

    // 同步读一次语音列表：已经有缓存就用缓存，没有也不等待
    refreshVoices()
    const voice = pickVoice(lang)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = options.rate ?? 0.9
    utterance.pitch = options.pitch ?? 1
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      speaking.value = true
      failed.value = false
      // 能正常发声就说明之前「不支持」的判断是误报，撤回降级提示
      degraded.value = false
    }
    utterance.onend = () => {
      speaking.value = false
    }
    utterance.onerror = () => {
      speaking.value = false
      failed.value = true
    }

    // 关键：同步调用，保持在用户手势的调用栈内
    synth.speak(utterance)
    activeOwner = owner

    /* ---------- 到这里手势要求已经满足，后面的逻辑不影响播放 ---------- */

    if (watchdog !== undefined) window.clearTimeout(watchdog)
    watchdog = window.setTimeout(() => {
      // 既没有在播，也没有排队 → 被浏览器拦截，或者这台设备根本没有语音引擎
      if (!synth.speaking && !synth.pending) {
        speaking.value = false
        if (!cachedVoices.value.length) {
          // 没有语音列表：判定为「能力不可用」，走提示而不是红脸
          degraded.value = true
        } else {
          failed.value = true
        }
      }
    }, WATCHDOG_MS)

    return true
  }

  /**
   * 设备没有语音引擎时的兜底：改用外部音频朗读。
   *
   * 华为 / 鸿蒙等浏览器拿不到 SpeechSynthesis 的语音列表，
   * 这时候至少让用户「能听见」，而不是只看到一句提示。
   * 说明：依赖外部服务，属于可用性兜底，不保证永久可靠。
   */
  function playFallback(text: string): boolean {
    if (!isBrowser() || !text.trim()) return false
    try {
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`
      if (!fallbackAudio) {
        fallbackAudio = new Audio()
        fallbackAudio.preload = 'auto'
      }
      fallbackAudio.pause()
      fallbackAudio.src = url
      const played = fallbackAudio.play()
      if (played && typeof played.catch === 'function') {
        played.catch(() => {
          failed.value = true
        })
      }
      return true
    } catch {
      return false
    }
  }

  return { supported, speaking, failed, degraded, speak, playFallback, voices: cachedVoices }
}
