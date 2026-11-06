<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * ReadWord —— 英语单词朗读按钮
 *
 * 用法：<ReadWord word="apple" />
 * 可选：lang（默认 en-US）、rate（默认 0.9）、pitch、label（无障碍标签）
 * 需要显示文字时把内容放在插槽里：<ReadWord word="apple">apple</ReadWord>
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

const speaking = ref(false)
// 只在浏览器侧判断，不参与渲染，避免 SSR 与 hydration 不一致
let supported = false

onMounted(() => {
  supported = typeof window !== 'undefined' && 'speechSynthesis' in window
})

onBeforeUnmount(() => {
  if (supported) window.speechSynthesis.cancel()
})

const title = computed(() => props.label ?? `朗读 ${props.word}`)

/** 优先挑一个与该语言匹配的语音，没有就交给浏览器默认 */
function pickVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const target = props.lang.toLowerCase()
  const prefix = target.slice(0, 2)
  const voices = synth.getVoices()
  return (
    voices.find((v) => v.lang?.toLowerCase() === target) ??
    voices.find((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(prefix)) ??
    null
  )
}

function speak() {
  if (!supported) return
  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(props.word)
  utterance.lang = props.lang
  utterance.rate = props.rate
  utterance.pitch = props.pitch

  const voice = pickVoice(synth)
  if (voice) utterance.voice = voice

  utterance.onstart = () => {
    speaking.value = true
  }
  utterance.onend = () => {
    speaking.value = false
  }
  utterance.onerror = () => {
    speaking.value = false
  }

  synth.speak(utterance)
}
</script>

<template>
  <button
    type="button"
    class="read-word"
    :class="{ 'is-speaking': speaking }"
    :title="title"
    :aria-label="title"
    @click.stop.prevent="speak"
  >
    <span class="read-word__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path class="read-word__wave read-word__wave--near" d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path class="read-word__wave read-word__wave--far" d="M18.5 6a9 9 0 0 1 0 12" />
      </svg>
    </span>
    <span v-if="$slots.default" class="read-word__text"><slot /></span>
  </button>
</template>
