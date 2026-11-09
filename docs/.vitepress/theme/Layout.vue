<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleTags from './components/ArticleTags.vue'
import AgeHint from './components/AgeHint.vue'
import RelatedArticles from './components/RelatedArticles.vue'
import ArticlePager from './components/ArticlePager.vue'

/**
 * 文档头部：主题页显示年龄筛选，文章页显示标签；
 * 页脚前：相关内容 + 文章级翻页。
 */
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <AgeHint />
      <ArticleTags />
    </template>
    <template #doc-footer-before>
      <RelatedArticles />
      <ArticlePager />
    </template>
  </Layout>
</template>
