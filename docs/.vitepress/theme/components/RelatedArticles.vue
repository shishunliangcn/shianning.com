<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

import { data as tagged } from '../../tags.data'
import { AGE_TAGS } from '../../tags'
import { usePageContext } from '../composables/usePageContext'

/**
 * RelatedArticles —— 文章末尾的「还可以看」。
 *
 * 不做手工互链，而是按「同主题 + 共同标签」自动打分挑三篇。
 * 新增文章会自动进入别人的推荐位，不需要维护任何链接表。
 */
const ctx = usePageContext()
const { frontmatter } = useData()

const myTags = computed<string[]>(() => {
  const raw = frontmatter.value.tags
  const tags = Array.isArray(raw) ? raw.map(String) : []
  // 年龄标签太泛（人人都打），不参与相似度计算
  return tags.filter((tag) => !AGE_TAGS.includes(tag))
})

/** 路径（不含 .html）→ 标签（同样剔除年龄标签） */
const tagMap = computed(() => {
  const map = new Map<string, string[]>()
  for (const article of tagged) {
    map.set(
      article.url.replace(/\.html$/, ''),
      article.tags.filter((tag) => !AGE_TAGS.includes(tag))
    )
  }
  return map
})

/** /nature/astronomy/stars → nature/astronomy */
function areaOf(path: string): string {
  return path.split('/').filter(Boolean).slice(0, 2).join('/')
}

const related = computed(() => {
  const page = ctx.value
  // 只在文章页出现（pager 能力就是文章页的标志）
  if (!page.ui.pager) return []

  const myArea = areaOf(page.path)
  const scored = []

  for (const sibling of page.siblings) {
    if (sibling.path === page.path) continue

    let score = 0
    if (areaOf(sibling.path) === myArea) score += 3

    const tags = tagMap.value.get(sibling.path) ?? []
    score += tags.filter((tag) => myTags.value.includes(tag)).length

    if (score > 0) scored.push({ ...sibling, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3)
})
</script>

<template>
  <nav v-if="related.length" class="related" aria-label="相关内容">
    <p class="related__title">还可以看</p>
    <ul class="related__list">
      <li v-for="item in related" :key="item.path">
        <a :href="withBase(`${item.path}.html`)">{{ item.title }}</a>
        <span class="related__group">{{ item.group }}</span>
      </li>
    </ul>
  </nav>
</template>
