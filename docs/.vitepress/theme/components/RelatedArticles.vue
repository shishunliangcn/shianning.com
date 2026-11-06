<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as articles } from '../../articles.data'
import { wings } from '../../curriculum'

/**
 * RelatedArticles —— 延伸阅读
 *
 * 打分：每共享一个标签 +10，同主题 +3，同展馆 +1（文章）；
 * 主题简介页只按同展馆记 0.5 分，作为文章不足时的兜底，
 * 保证不会把无关展馆的文章硬凑进来。
 */
const { page, frontmatter } = useData()

const strip = (path: string) => path.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '')

const currentPath = computed(() => strip(`/${page.value.relativePath.replace(/\.md$/, '')}`))
const currentTags = computed<string[]>(() =>
  Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags.map(String) : []
)

const parts = computed(() => currentPath.value.split('/'))
const currentWing = computed(() => parts.value[0] ?? '')
const currentArea = computed(() => parts.value[1] ?? '')

function wingLabel(wingKey: string, areaKey: string, isArea: boolean): string {
  if (wingKey === 'parenting') return '📚 父母的书架'
  const wing = wings.find((item) => item.key === wingKey)
  if (!wing) return ''
  if (isArea) return `${wing.name} · 主题简介`
  const area = wing.areas.find((item) => item.key === areaKey)
  return area ? `${wing.name} · ${area.name}` : wing.name
}

const related = computed(() => {
  const isKnown = articles.some((entry) => strip(entry.url) === currentPath.value)
  if (!isKnown) return []

  const tags = new Set(currentTags.value)

  return articles
    .filter((entry) => strip(entry.url) !== currentPath.value)
    // 不推荐当前主题的简介，也不推荐展馆导言页，避免「自己推荐自己」
    .filter((entry) => {
      if (!entry.isArea) return true
      const target = strip(entry.url).split('/')
      return target.length > 1 && target[1] !== currentArea.value
    })
    .map((entry) => {
      const target = strip(entry.url).split('/')
      const sameWing = target[0] === currentWing.value
      const sameArea = target[1] === currentArea.value

      if (entry.isArea) {
        return { entry, score: sameWing ? 0.5 : 0, wing: target[0] ?? '', area: target[1] ?? '' }
      }

      const shared = entry.tags.filter((tag) => tags.has(tag)).length
      return {
        entry,
        score: shared * 10 + (sameArea ? 3 : 0) + (sameWing ? 1 : 0),
        wing: target[0] ?? '',
        area: target[1] ?? ''
      }
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'zh-Hans-CN')
    )
    .slice(0, 2)
})
</script>

<template>
  <section v-if="related.length" class="related">
    <h2 class="related__title">💡 延伸阅读</h2>
    <div class="related__list">
      <a
        v-for="item in related"
        :key="item.entry.url"
        class="related__item"
        :href="withBase(item.entry.url)"
      >
        <span class="related__name">{{ item.entry.title }}</span>
        <span class="related__meta">{{ wingLabel(item.wing, item.area, item.entry.isArea) }}</span>
      </a>
    </div>
  </section>
</template>
