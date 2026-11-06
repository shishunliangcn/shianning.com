<script setup lang="ts">
import { withBase } from 'vitepress'

import { usePageContext } from '../composables/usePageContext'

/**
 * ExhibitionThemes —— 展馆页的「本馆主题」表格。
 *
 * 数据来自 curriculum.ts，是否渲染来自页面上下文（ctx.ui.themeTable）。
 * 只有展馆首页会拿到 true；新增主题时表格自动更新，不会再出现
 * 「侧边栏有、正文没有」的脱节。
 */
const ctx = usePageContext()
</script>

<template>
  <div v-if="ctx.ui.themeTable && ctx.wing" class="exhibition-themes">
    <p class="exhibition-themes__count">
      本馆共 <strong>{{ ctx.wing.areas.length }}</strong> 个主题
    </p>
    <table>
      <thead>
        <tr>
          <th>主题</th>
          <th>聊什么</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in ctx.wing.areas" :key="area.key">
          <td>
            <a :href="withBase(`/${ctx.wing.key}/${area.key}/`)">
              {{ area.icon }} {{ area.name }}
            </a>
          </td>
          <td>{{ area.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
