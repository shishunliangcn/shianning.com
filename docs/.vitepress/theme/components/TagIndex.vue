<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { data as articles } from '../../tags.data'
import { tagAnchor } from '../../tags'
import { usePageContext } from '../composables/usePageContext'

/**
 * TagIndex —— 某个板块的标签索引。
 *
 * 渲染哪些文章完全由页面上下文决定：
 *   · 展馆的标签页 → 只列 exhibition 的文章
 *   · 书架的标签页 → 只列 parenting 的文章
 *
 * 两个页面是物理分离的，不存在同一页面里两册并列的情况。
 */
const ctx = usePageContext()

const groups = computed(() => {
  const map = new Map<string, typeof articles>()
  for (const article of articles) {
    if (article.section !== ctx.value.kind) continue
    for (const tag of article.tags) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag)!.push(article)
    }
  }
  return [...map.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-Hans-CN')
  )
})
</script>

<template>
  <div v-if="ctx.ui.tagIndex" class="tag-index">
    <p v-if="!groups.length" class="tag-index__empty">这个板块还没有文章添加标签。</p>

    <section
      v-for="[tag, list] in groups"
      :key="tag"
      class="tag-index__group"
      :id="tagAnchor(tag)"
    >
      <h2 class="tag-index__name">
        {{ tag }} <span class="tag-index__count">{{ list.length }} 篇</span>
      </h2>
      <ul class="tag-index__list">
        <li v-for="article in list" :key="article.url">
          <a :href="withBase(article.url)">{{ article.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>
