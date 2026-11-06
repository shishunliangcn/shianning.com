<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleTags from './components/ArticleTags.vue'
import ArticlePager from './components/ArticlePager.vue'

/**
 * 在默认主题的文档头部插入标签栏，在页脚前插入文章级翻页。
 * 其余结构完全沿用默认主题。
 */
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <ArticleTags />
    </template>
    <template #doc-footer-before>
      <ArticlePager />
    </template>
  </Layout>
</template>
