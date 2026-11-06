<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

import { usePageContext } from '../composables/usePageContext'

/**
 * ArticleTags —— 文章标签
 *
 * 从当前页面的 frontmatter.tags 读取，渲染为可点击的标签胶囊。
 * 是否渲染由页面上下文决定（ctx.ui.tags）：只有文章页会拿到 true。
 */
const { frontmatter } = useData()
const ctx = usePageContext()

const tags = computed<string[]>(() => {
  const raw = frontmatter.value.tags
  if (Array.isArray(raw)) return raw.map((tag) => String(tag))
  if (typeof raw === 'string') {
    return raw.split(/[,，\s]+/).filter(Boolean)
  }
  return []
})
</script>

<template>
  <div v-if="ctx.ui.tags && tags.length" class="article-tags">
    <span class="article-tags__label" aria-hidden="true">🏷️</span>
    <a
      v-for="tag in tags"
      :key="tag"
      class="article-tag"
      :href="withBase('/tags.html') + '#tag-' + encodeURIComponent(tag)"
    >
      {{ tag }}
    </a>
  </div>
</template>
