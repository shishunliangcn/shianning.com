import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Layout from './Layout.vue'
import ReadWord from './components/ReadWord.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import KnowledgeMap from './components/KnowledgeMap.vue'
import AgeGuide from './components/AgeGuide.vue'
import ExhibitionThemes from './components/ExhibitionThemes.vue'
import FeaturedArticle from './components/FeaturedArticle.vue'
import ParentingArticles from './components/ParentingArticles.vue'
import ParentingSections from './components/ParentingSections.vue'
import ArticleList from './components/ArticleList.vue'

import './styles/index.css'

/**
 * 全站主题入口。
 *
 * - Layout：在默认主题基础上插入文章标签栏
 * - 全局组件：ReadWord / AudioPlayer / KnowledgeMap，Markdown 中直接使用
 */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ReadWord', ReadWord)
    app.component('AudioPlayer', AudioPlayer)
    app.component('KnowledgeMap', KnowledgeMap)
    app.component('AgeGuide', AgeGuide)
    app.component('ExhibitionThemes', ExhibitionThemes)
    app.component('FeaturedArticle', FeaturedArticle)
    app.component('ParentingArticles', ParentingArticles)
    app.component('ParentingSections', ParentingSections)
    app.component('ArticleList', ArticleList)
  }
} satisfies Theme
