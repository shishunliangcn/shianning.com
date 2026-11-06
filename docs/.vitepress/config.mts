import { defineConfig } from 'vitepress'
import { buildSidebar, wings } from './curriculum'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点部署在自定义域名的 /notes/ 子路径下
  base: '/notes/',
  title: '史安宁的小学堂',
  description: '跨越年龄的边界，探索知识的无限可能。',
  lang: 'zh-CN',

  head: [['meta', { name: 'theme-color', content: '#fdfaf5' }]],

  themeConfig: {
    siteTitle: '史安宁的小学堂',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '展馆',
        items: wings.map((wing) => ({
          text: `${wing.icon} ${wing.name}`,
          link: `/${wing.key}/`
        }))
      },
      { text: '标签', link: '/tags.html' }
    ],

    // 侧边栏由 curriculum.ts 的展馆树生成，新增主题无需手改
    sidebar: buildSidebar(),

    editLink: {
      pattern: 'https://github.com/shishunliangcn/shianning.com/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: '跨越年龄的边界，探索知识的无限可能。',
      copyright: 'Copyright © 2026 史安宁的小学堂'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '本页目录'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
