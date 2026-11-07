<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

import { tagHref } from '../../tags'
import { usePageContext } from '../composables/usePageContext'

/**
 * ArticleTags —— 文章标签
 *
 * 从当前页面的 frontmatter.tags 读取，渲染为可点击的标签胶囊。
 * 是否渲染由页面上下文决定（ctx.ui.tags）：只有文章页会拿到 true。
 *
 * 标签链接会带上当前文章所属板块（展馆 / 书架），
 * 保证跳到标签页时落在自己那一边，不会串到另一个板块的检索结果。
 */
const { frontmatter } = useData()
const ctx = usePageContext()

const section = computed(() => (ctx.value.kind === 'parenting' ? 'parenting' : 'exhibition'))

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
      :href="withBase(tagHref(section, tag))"
    >
      {{ tag }}
    </a>
  </div>
</template>
