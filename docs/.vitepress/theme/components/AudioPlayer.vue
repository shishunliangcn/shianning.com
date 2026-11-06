<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

/**
 * AudioPlayer —— 标准音频播放器
 *
 * 用法：<AudioPlayer src="/audio/tone-440.wav" caption="示例音频" />
 * 以 / 开头的路径会自动套用站点 base（本项目为 /notes/）。
 */
interface Props {
  src: string
  title?: string
  caption?: string
  preload?: 'none' | 'metadata' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  preload: 'metadata'
})

const resolvedSrc = computed(() => (props.src.startsWith('/') ? withBase(props.src) : props.src))
const label = computed(() => props.caption ?? props.title ?? '')
</script>

<template>
  <figure class="audio-player">
    <figcaption v-if="label" class="audio-player__caption">{{ label }}</figcaption>
    <audio class="audio-player__el" :src="resolvedSrc" :preload="preload" controls>
      你的浏览器不支持音频播放，请<a :href="resolvedSrc">下载音频</a>。
    </audio>
  </figure>
</template>
