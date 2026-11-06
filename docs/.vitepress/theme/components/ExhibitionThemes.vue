<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { wings } from '../../curriculum'

/**
 * ExhibitionThemes —— 展馆页的「本馆主题」表格
 *
 * 直接从 curriculum.ts 读取当前展馆的主题列表，
 * 新增主题时表格会自动更新，不会再出现「侧边栏有、正文没有」的脱节。
 */
const { page } = useData()

const wing = computed(() => {
  const key = page.value.relativePath.split('/')[0]
  return wings.find((item) => item.key === key) ?? null
})
</script>

<template>
  <div v-if="wing" class="exhibition-themes">
    <p class="exhibition-themes__count">
      本馆共 <strong>{{ wing.areas.length }}</strong> 个主题
    </p>
    <table>
      <thead>
        <tr>
          <th>主题</th>
          <th>聊什么</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in wing.areas" :key="area.key">
          <td>
            <a :href="withBase(`/${wing.key}/${area.key}/`)">
              {{ area.icon }} {{ area.name }}
            </a>
          </td>
          <td>{{ area.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
