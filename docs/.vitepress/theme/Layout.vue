<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleTags from './components/ArticleTags.vue'
import AgeHint from './components/AgeHint.vue'
import ArticlePager from './components/ArticlePager.vue'

/**
 * 文档头部：主题页显示年龄筛选，文章页显示标签；
 * 页脚前：文章级翻页。
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
      <ArticlePager />
    </template>
  </Layout>
</template>
