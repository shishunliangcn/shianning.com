<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSpeechSynthesis } from '../composables/useSpeechSynthesis'

/**
 * ReadWord —— 英语单词朗读按钮
 *
 * 用法：<ReadWord word="apple" />
 * 可选：lang（默认 en-US）、rate（默认 0.9）、pitch、label（无障碍标签）
 * 需要显示文字时把内容放在插槽里：<ReadWord word="apple">apple</ReadWord>
 *
 * 朗读逻辑在 useSpeechSynthesis 里：
 * - speak() 在点击事件中同步调用，满足移动端的手势要求
 * - 浏览器没有语音引擎（华为 / 鸿蒙常见）时，不再把按钮点成红色，
 *   而是在按钮旁显示一行说明文字
 */
interface Props {
  word: string
  lang?: string
  rate?: number
  pitch?: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'en-US',
  rate: 0.9,
  pitch: 1
})

const { supported, speaking, failed, degraded, speak } = useSpeechSynthesis()

/** 鸿蒙 / 华为浏览器对 Web Speech 的支持最差，单独给一句更准确的提示 */
const isHarmony = ref(false)
onMounted(() => {
  isHarmony.value =
    typeof navigator !== 'undefined' &&
    /HarmonyOS|HuaweiBrowser|HonorBrowser|HUAWEI/i.test(navigator.userAgent)
})

const hint = computed(() =>
  isHarmony.value
    ? '华为/鸿蒙浏览器暂不支持发音，请换用 Chrome'
    : '当前浏览器暂不支持发音，请换用 Chrome'
)

const title = computed(() => {
  if (degraded.value) return hint.value
  if (!supported.value) return '当前浏览器不支持语音朗读'
  if (failed.value) {
    return `没能播放「${props.word}」：请再点一次；仍无声请检查手机侧边静音键、媒体音量或系统语音包`
  }
  return props.label ?? `朗读 ${props.word}`
})

const statusText = computed(() => {
  if (degraded.value) return hint.value
  if (speaking.value) return '正在朗读'
  if (failed.value) return '朗读失败，请重试'
  return ''
})

function handleClick() {
  // 直接同步调用：中间不能有任何 await / setTimeout，
  // 否则移动端会认为这次朗读不是用户触发的，从而静音。
  speak(props.word, {
    lang: props.lang,
    rate: props.rate,
    pitch: props.pitch
  })
}
</script>

<template>
  <button
    type="button"
    class="read-word"
    :class="{
      'is-speaking': speaking,
      'is-failed': failed && !degraded,
      'is-unsupported': degraded || !supported
    }"
    :title="title"
    :aria-label="title"
    :aria-pressed="speaking"
    @click="handleClick"
  >
    <span class="read-word__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path class="read-word__wave read-word__wave--near" d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path class="read-word__wave read-word__wave--far" d="M18.5 6a9 9 0 0 1 0 12" />
      </svg>
    </span>
    <span v-if="$slots.default" class="read-word__text"><slot /></span>
    <span class="visually-hidden" aria-live="polite">{{ statusText }}</span>
  </button>
  <span v-if="degraded" class="read-word__note">{{ hint }}</span>
</template>
