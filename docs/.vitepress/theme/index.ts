import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import ReadWord from './components/ReadWord.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import KnowledgeMap from './components/KnowledgeMap.vue'

import './styles/index.css'

/**
 * 全站主题入口。
 *
 * 在默认主题基础上注册全局组件：
 * - ReadWord / AudioPlayer 供 Markdown 直接使用
 * - KnowledgeMap 供主页「知识库全图」使用
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadWord', ReadWord)
    app.component('AudioPlayer', AudioPlayer)
    app.component('KnowledgeMap', KnowledgeMap)
  }
} satisfies Theme
