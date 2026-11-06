<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { usePageContext } from '../composables/usePageContext'

/**
 * ArticlePager —— 文章级「上一篇 / 下一篇」。
 *
 * 文章序列由页面上下文给出（ctx.siblings / ctx.cursor），
 * 且只在本板块内串联：
 *   · 展馆文章 → 本展馆的文章序列
 *   · 父母的书架文章 → 书架的文章序列
 * 跨板块不会互相跳转，避免「育儿文章下一篇是天文课」这类串台。
 */
const ctx = usePageContext()

const prev = computed(() =>
  ctx.value.cursor > 0 ? ctx.value.siblings[ctx.value.cursor - 1] : null
)
const next = computed(() => {
  const i = ctx.value.cursor
  return i >= 0 && i < ctx.value.siblings.length - 1 ? ctx.value.siblings[i + 1] : null
})
const visible = computed(() => ctx.value.ui.pager && Boolean(prev.value || next.value))
</script>

<template>
  <nav v-if="visible" class="article-pager" aria-label="文章翻页">
    <a v-if="prev" class="article-pager__item" :href="withBase(`${prev.path}.html`)">
      <span class="article-pager__dir">← 上一篇</span>
      <span class="article-pager__title">{{ prev.title }}</span>
      <span class="article-pager__group">{{ prev.group }}</span>
    </a>
    <a
      v-if="next"
      class="article-pager__item article-pager__item--next"
      :href="withBase(`${next.path}.html`)"
    >
      <span class="article-pager__dir">下一篇 →</span>
      <span class="article-pager__title">{{ next.title }}</span>
      <span class="article-pager__group">{{ next.group }}</span>
    </a>
  </nav>
</template>
