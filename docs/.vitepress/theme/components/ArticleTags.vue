<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

/**
 * ArticleTags —— 文章标签
 *
 * 从当前页面的 frontmatter.tags 读取，渲染为可点击的标签胶囊。
 * 由 Layout.vue 挂在 doc-before 插槽，所有文章页自动生效。
 */
const { frontmatter } = useData()

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
  <div v-if="tags.length" class="article-tags">
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
