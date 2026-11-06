import { defineConfig } from 'vitepress'
import { buildSidebar, stages } from './curriculum'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点部署在自定义域名的 /notes/ 子路径下
  base: '/notes/',
  title: '史安宁的小学堂',
  description: '从启蒙到大学，经得起时间考验的线上学园',
  lang: 'zh-CN',

  head: [['meta', { name: 'theme-color', content: '#fdfaf5' }]],

  themeConfig: {
    siteTitle: '史安宁的小学堂',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '学段',
        items: stages.map((stage) => ({
          text: `${stage.icon} ${stage.name}`,
          link: `/${stage.key}/`
        }))
      },
      { text: '朗读演示', link: '/primary/english/demo' }
    ],

    // 侧边栏由 curriculum.ts 的课程树生成，新增学科无需手改
    sidebar: buildSidebar(),

    editLink: {
      pattern: 'https://github.com/shishunliangcn/shianning.com/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: '从启蒙到大学，经得起时间考验的线上学园',
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
