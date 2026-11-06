---
title: 标签索引
---

# 🏷️ 标签索引

每篇文章的头部都有一行 `tags`，它们会自动汇总到这里。
标签不分年级、不分学科——同一篇《星星为什么会发光》可以同时属于「天文」和「物理」。

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as articles } from './.vitepress/tags.data'

const groups = computed(() => {
  const map = new Map()
  for (const article of articles) {
    for (const tag of article.tags) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag).push(article)
    }
  }
  return [...map.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-Hans-CN')
  )
})
</script>

<div class="tag-index">
  <p v-if="!groups.length" class="tag-index__empty">还没有任何文章添加标签。</p>

  <section
    v-for="[tag, list] in groups"
    :key="tag"
    class="tag-index__group"
    :id="'tag-' + tag"
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
