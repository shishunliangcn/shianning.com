<script setup lang="ts">
import { withBase } from 'vitepress'

import { parenting, parentingArticleLink } from '../../curriculum'
import { usePageContext } from '../composables/usePageContext'

/**
 * ParentingArticles —— 书架首页的「按年龄找」表格。
 *
 * 数据来自 curriculum.ts 的 parenting.articles：
 * 新增一篇育儿文章，表格自动多一行。
 */
const ctx = usePageContext()
</script>

<template>
  <table v-if="ctx.ui.parentingArticles">
    <thead>
      <tr>
        <th>阶段</th>
        <th>这篇讲什么</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="article in parenting.articles" :key="article.slug">
        <td>
          <a :href="withBase(parentingArticleLink(article.slug))">{{ article.age }}</a>
        </td>
        <td>{{ article.title }}</td>
      </tr>
    </tbody>
  </table>
</template>
