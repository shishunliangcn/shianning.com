<script setup lang="ts">
import { withBase } from 'vitepress'
import { ageGroups } from '../../curriculum'
import { tagHref } from '../../tags'
import { data as articles } from '../../tags.data'

/**
 * AgeGuide —— 知识库首页的「按年龄找内容」板块
 *
 * 知识不分年龄，深度分层次：这里给的是四个年龄标签的入口，
 * 篇数由标签页的数据实时统计，写完新文章会自动变。
 */
const countOf = (tag: string) => articles.filter((article) => article.tags.includes(tag)).length
</script>

<template>
  <nav class="age-guide" aria-label="按年龄找内容">
    <a
      v-for="group in ageGroups"
      :key="group.tag"
      class="age-guide__item"
      :href="withBase(tagHref('exhibition', group.tag))"
    >
      <span class="age-guide__label">{{ group.label }}</span>
      <span class="age-guide__meta">#{{ group.tag }} · {{ countOf(group.tag) }} 篇</span>
    </a>
  </nav>
</template>
