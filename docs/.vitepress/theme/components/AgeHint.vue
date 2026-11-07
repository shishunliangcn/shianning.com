<script setup lang="ts">
import { withBase } from 'vitepress'

import { ageGroups } from '../../curriculum'
import { tagHref } from '../../tags'
import { usePageContext } from '../composables/usePageContext'

/**
 * AgeHint —— 展馆主题页顶部的年龄筛选入口。
 *
 * 是否渲染完全由页面上下文决定（ctx.ui.ageHint）：
 * 只有「展馆 → 主题简介」这类页面才会拿到 true，
 * 父母的书架等成人向板块在能力表里就是 false，不存在串台的可能。
 */
const ctx = usePageContext()
</script>

<template>
  <aside v-if="ctx.ui.ageHint" class="age-hint">
    <span class="age-hint__label">
      <span class="age-hint__icon" aria-hidden="true">🧭</span>
      <span class="age-hint__text">本主题横跨多个年龄段，按认知深度筛选：</span>
    </span>
    <span class="age-hint__links">
      <a
        v-for="group in ageGroups"
        :key="group.tag"
        class="age-hint__link"
        :href="withBase(tagHref('exhibition', group.tag))"
      >
        {{ group.tag }}
      </a>
    </span>
  </aside>
</template>
