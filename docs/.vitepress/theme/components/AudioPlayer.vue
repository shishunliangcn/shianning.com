<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

/**
 * AudioPlayer —— 标准音频播放器
 *
 * 用法：<AudioPlayer src="/audio/tone-440.mp3" caption="示例音频" />
 * 以 / 开头的路径会自动套用站点 base（本项目为 /notes/）。
 */
const props = defineProps<{
  src: string
  caption?: string
}>()

const resolvedSrc = computed(() => (props.src.startsWith('/') ? withBase(props.src) : props.src))
</script>

<template>
  <figure class="audio-player">
    <figcaption v-if="caption" class="audio-player__caption">{{ caption }}</figcaption>
    <audio class="audio-player__el" :src="resolvedSrc" preload="metadata" controls>
      你的浏览器不支持音频播放，请<a :href="resolvedSrc">下载音频</a>。
    </audio>
  </figure>
</template>
