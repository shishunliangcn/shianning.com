<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { parenting, parentingArticleLink } from '../../curriculum'
import { usePageContext } from '../composables/usePageContext'

/**
 * ParentingArticles —— 书架首页的「按年龄找」索引。
 *
 * 它是一份索引，不是统计表：
 *   · 年龄是分组标签，不承担跳转（同一个年龄段会有多篇文章）
 *   · 文章的入口是标题本身，符合阅读习惯
 *
 * 数据来自 curriculum.ts 的 parenting.articles：
 * 新增一篇育儿文章，这里自动多一行。
 */
const ctx = usePageContext()

/** 按年龄把连续的同组文章合并，避免同一个年龄段重复出现十几次 */
const groups = computed(() => {
  const out: Array<{ age: string; items: typeof parenting.articles }> = []
  for (const article of parenting.articles) {
    const last = out[out.length - 1]
    if (last && last.age === article.age) last.items.push(article)
    else out.push({ age: article.age, items: [article] })
  }
  return out
})
</script>

<template>
  <table v-if="ctx.ui.parentingArticles" class="parenting-index">
    <thead>
      <tr>
        <th>阶段</th>
        <th>这篇讲什么</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="group in groups" :key="group.age">
        <tr v-for="(article, index) in group.items" :key="article.slug">
          <td v-if="index === 0" :rowspan="group.items.length" class="parenting-index__age">
            {{ group.age }}
          </td>
          <td>
            <a :href="withBase(parentingArticleLink(article.slug))">{{ article.title }}</a>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
