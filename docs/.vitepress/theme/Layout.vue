<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleTags from './components/ArticleTags.vue'
import ArticlePager from './components/ArticlePager.vue'
import RelatedArticles from './components/RelatedArticles.vue'

/**
 * 在默认主题的文档头部插入标签栏，
 * 在页脚前依次插入「延伸阅读」与文章级翻页。
 */
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <ArticleTags />
    </template>
    <template #doc-footer-before>
      <RelatedArticles />
      <ArticlePager />
    </template>
  </Layout>
</template>
