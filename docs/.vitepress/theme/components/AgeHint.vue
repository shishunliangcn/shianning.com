<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { wings } from '../../curriculum'

/**
 * AgeHint —— 主题页顶部的适读年龄提示
 *
 * 只在「主题简介」页显示（路径形如 /nature/astronomy/），
 * 数据来自 curriculum.ts 里每个主题的 age 字段。
 */
const { page } = useData()

const area = computed(() => {
  const rel = page.value.relativePath.replace(/\.md$/, '').replace(/\/index$/, '')
  const [wingKey, areaKey] = rel.split('/')
  if (!wingKey || !areaKey) return null
  const wing = wings.find((item) => item.key === wingKey)
  return wing?.areas.find((item) => item.key === areaKey) ?? null
})
</script>

<template>
  <aside v-if="area" class="age-hint">
    <span class="age-hint__icon" aria-hidden="true">🧭</span>
    <span class="age-hint__text">
      本主题内容主要适合 <strong>{{ area.age }}</strong> 的孩子
    </span>
  </aside>
</template>
