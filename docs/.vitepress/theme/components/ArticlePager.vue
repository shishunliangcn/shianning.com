<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { parenting, wings } from '../../curriculum'

/**
 * ArticlePager —— 文章级「上一篇 / 下一篇」
 *
 * 默认主题的 pager 按侧边栏顺序取邻项，文章的下一篇往往是下一个主题的
 * 「主题简介」页，文案与语义都不对。这里改为按「文章顺序」翻页：
 * 五大展馆依次串联，最后接上父母的书架。
 */
interface ArticleEntry {
  title: string
  /** 不带 base、不带扩展名的站内路径 */
  path: string
  /** 所属展馆 · 主题 */
  group: string
}

const entries: ArticleEntry[] = []

for (const wing of wings) {
  for (const area of wing.areas) {
    for (const article of area.articles ?? []) {
      entries.push({
        title: article.title,
        path: `/${wing.key}/${area.key}/${article.slug}`,
        group: `${wing.name} · ${area.name}`
      })
    }
  }
}

for (const article of parenting.articles) {
  entries.push({
    title: article.title,
    path: `/parenting/${article.slug}`,
    group: '父母的书架'
  })
}

for (const section of parenting.sections) {
  for (const article of section.articles) {
    entries.push({
      title: article.title,
      path: `/parenting/${section.key}/${article.slug}`,
      group: `父母的书架 · ${section.name}`
    })
  }
}

const { page } = useData()

const index = computed(() => {
  const current = `/${page.value.relativePath.replace(/\.md$/, '')}`
  return entries.findIndex((entry) => entry.path === current)
})

const prev = computed(() => (index.value > 0 ? entries[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < entries.length - 1 ? entries[index.value + 1] : null
)
const visible = computed(() => index.value >= 0 && Boolean(prev.value || next.value))
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
