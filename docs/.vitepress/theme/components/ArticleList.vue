<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { articleLink, parenting, parentingSectionLink } from '../../curriculum'
import { usePageContext } from '../composables/usePageContext'

/**
 * ArticleList —— 主题页 / 栏目页的「从这里开始」列表。
 *
 * 列出当前容器（展馆主题或书架栏目）下的全部文章，
 * 链接与推荐语都来自 curriculum.ts，markdown 里不再手写。
 */
const ctx = usePageContext()

const items = computed(() => {
  const c = ctx.value

  if (c.kind === 'exhibition' && c.wing && c.area) {
    return (c.area.articles ?? []).map((article) => ({
      title: article.title,
      note: article.note,
      href: articleLink(c.wing!, c.area!, article)
    }))
  }

  if (c.kind === 'parenting' && c.section) {
    const section = parenting.sections.find((item) => item.key === c.section!.key)
    return (section?.articles ?? []).map((article) => ({
      title: article.title,
      note: article.note,
      href: parentingSectionLink(section!.key, article.slug)
    }))
  }

  return []
})
</script>

<template>
  <ul v-if="items.length" class="article-list">
    <li v-for="item in items" :key="item.href">
      <a :href="withBase(item.href)">{{ item.title }}</a>
      <template v-if="item.note"> —— {{ item.note }}</template>
    </li>
  </ul>
</template>
