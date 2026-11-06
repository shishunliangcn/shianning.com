<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleTags from './components/ArticleTags.vue'

/**
 * 在默认主题的文档头部插入标签栏，其余结构完全沿用默认主题。
 */
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <ArticleTags />
    </template>
  </Layout>
</template>
