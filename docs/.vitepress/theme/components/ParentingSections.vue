<script setup lang="ts">
import { withBase } from 'vitepress'

import { parenting, parentingSectionLink } from '../../curriculum'
import { usePageContext } from '../composables/usePageContext'

/**
 * ParentingSections —— 书架首页的栏目入口。
 *
 * 栏目（目前是「亲子英语发音小抄」）写在 curriculum.ts 的 parenting.sections 里，
 * 新增栏目时这里自动出现，不需要改 markdown。
 */
const ctx = usePageContext()
</script>

<template>
  <div v-if="ctx.ui.parentingSections" class="parenting-sections">
    <a
      v-for="section in parenting.sections"
      :key="section.key"
      class="parenting-section"
      :href="withBase(parentingSectionLink(section.key))"
    >
      <span class="parenting-section__name">{{ section.icon }} {{ section.name }}</span>
      <span class="parenting-section__summary">{{ section.summary }}</span>
    </a>
  </div>
</template>
