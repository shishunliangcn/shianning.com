---
title: 标签索引
---

# 🏷️ 标签索引

孩子的知识在「五大展馆」，家长的笔记在「父母的书架」。
两边标签各自成册、互不交叉——点年龄检索，只会看到展馆里的文章。

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as articles } from './.vitepress/tags.data'
import { tagAnchor } from './.vitepress/tags'

/** 按板块收集标签分组；板块归属由数据层给出，这里不做任何推测 */
function groupBy(section) {
  const map = new Map()
  for (const article of articles) {
    if (article.section !== section) continue
    for (const tag of article.tags) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag).push(article)
    }
  }
  return [...map.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-Hans-CN')
  )
}

const exhibitionGroups = computed(() => groupBy('exhibition'))
const parentingGroups = computed(() => groupBy('parenting'))
</script>

## 五大展馆

<div class="tag-index">
  <p v-if="!exhibitionGroups.length" class="tag-index__empty">展馆还没有文章添加标签。</p>

  <section
    v-for="[tag, list] in exhibitionGroups"
    :key="tag"
    class="tag-index__group"
    :id="tagAnchor('exhibition', tag)"
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

## 父母的书架

<div class="tag-index">
  <p v-if="!parentingGroups.length" class="tag-index__empty">书架还没有文章添加标签。</p>

  <section
    v-for="[tag, list] in parentingGroups"
    :key="tag"
    class="tag-index__group"
    :id="tagAnchor('parenting', tag)"
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
