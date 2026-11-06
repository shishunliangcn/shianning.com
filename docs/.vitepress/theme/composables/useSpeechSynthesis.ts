/**
 * 语音朗读 —— 只做一件事：把一段文字读出来。
 *
 * 唯一必须遵守的约束：speak() 要同步发生在点击的调用栈里，
 * 中间不能有 await / setTimeout，否则移动端会判定为非用户触发而静音。
 */

export interface SpeakOptions {
  lang?: string
  rate?: number
  pitch?: number
}

export function useSpeechSynthesis() {
  function speak(text: string, { lang = 'en-US', rate = 0.9, pitch = 1 }: SpeakOptions = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const engine = window.speechSynthesis

    // 只在真的有语音在播或排队时打断：
    // 空闲时 cancel() 会连带吞掉紧随其后的 speak（iOS 上的经典静音原因）
    if (engine.speaking || engine.pending) engine.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    engine.speak(utterance)
  }

  return { speak }
}
