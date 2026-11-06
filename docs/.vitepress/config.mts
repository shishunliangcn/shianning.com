import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点部署在自定义域名的 /notes/ 子路径下
  base: '/notes/',
  title: '史顺良的学习笔记',
  description: '记录与沉淀',
  lang: 'zh-CN',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 扩展语法', link: '/markdown-examples' },
          { text: '运行时 API 示例', link: '/api-examples' }
        ]
      }
    ],

    footer: {
      message: '记录与沉淀',
      copyright: 'Copyright © 2026 史顺良'
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
