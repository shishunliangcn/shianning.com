<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { articleLink } from '../../curriculum'
import { usePageContext } from '../composables/usePageContext'

/**
 * FeaturedArticle —— 展馆首页的「先看这一篇」。
 *
 * 推荐哪一篇写在 curriculum.ts 的 `featured` 字段里，
 * markdown 不再手写链接与推荐语，文章改名/换推荐都不会失联。
 */
const ctx = usePageContext()

const featured = computed(() => {
  const wing = ctx.value.wing
  const pick = wing?.featured
  if (!wing || !pick) return null

  const area = wing.areas.find((item) => item.key === pick.area)
  const article = area?.articles?.find((item) => item.slug === pick.slug)
  if (!area || !article) return null

  return { title: article.title, href: articleLink(wing, area, article), note: pick.note }
})
</script>

<template>
  <ul v-if="ctx.ui.featured && featured" class="featured">
    <li>
      <a :href="withBase(featured.href)">{{ featured.title }}</a> —— {{ featured.note }}
    </li>
  </ul>
</template>
