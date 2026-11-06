<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { ageGroups } from '../../curriculum'

/**
 * AgeHint —— 主题页顶部的年龄导航
 *
 * 主题本身不绑定年龄：同一个主题下，不同文章服务不同认知阶段。
 * 所以这里不给「适合 X 岁」，而是给四个年龄标签的筛选入口。
 *
 * 结构上分成两块：label（图标 + 文案）与 links（标签组），
 * 窄屏时整体改为上下堆叠，标签自动换行。
 */
const { page } = useData()

const isAreaPage = computed(() => {
  const rel = page.value.relativePath.replace(/\.md$/, '')
  if (!rel.endsWith('/index')) return false
  return rel.split('/').length === 3
})
</script>

<template>
  <aside v-if="isAreaPage" class="age-hint">
    <span class="age-hint__label">
      <span class="age-hint__icon" aria-hidden="true">🧭</span>
      <span class="age-hint__text">本主题横跨多个年龄段，按认知深度筛选：</span>
    </span>
    <span class="age-hint__links">
      <a
        v-for="group in ageGroups"
        :key="group.tag"
        class="age-hint__link"
        :href="withBase('/tags.html') + '#tag-' + group.tag"
      >
        {{ group.tag }}
      </a>
    </span>
  </aside>
</template>
