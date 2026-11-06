<script setup lang="ts">
import { useSpeechSynthesis } from '../composables/useSpeechSynthesis'

/**
 * ReadWord —— 点一下，读出这个词。
 *
 * 用法：<ReadWord word="apple">apple</ReadWord>
 * 可选：lang（默认 en-US）、rate、pitch
 */
const props = withDefaults(
  defineProps<{
    word: string
    lang?: string
    rate?: number
    pitch?: number
  }>(),
  { lang: 'en-US', rate: 0.9, pitch: 1 }
)

const { speak } = useSpeechSynthesis()

function handleClick() {
  speak(props.word, { lang: props.lang, rate: props.rate, pitch: props.pitch })
}
</script>

<template>
  <button type="button" class="read-word" :aria-label="`朗读 ${word}`" @click="handleClick">
    <svg
      class="read-word__icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </svg>
    <span v-if="$slots.default" class="read-word__text"><slot /></span>
  </button>
</template>
