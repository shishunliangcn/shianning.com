import { defineConfig } from 'vitepress'
import { buildSidebar, wings } from './curriculum'

/**
 * 按页面路径生成独立的 SEO 描述：
 * 展馆页用展馆简介，主题页用主题简介，书架页用固定描述。
 * 文章自己写了 description 的不会被覆盖。
 */
function describePage(rel: string): string | undefined {
  if (rel === 'parenting' || rel.startsWith('parenting/')) {
    return '父母的书架｜按年龄分层的育儿实操笔记：不鸡娃，也不放任。'
  }

  const [wingKey, areaKey] = rel.split('/')
  const wing = wings.find((item) => item.key === wingKey)
  if (!wing) return undefined

  if (!areaKey) {
    return `${wing.name}（${wing.motto}）：${wing.summary}`
  }

  const area = wing.areas.find((item) => item.key === areaKey)
  if (!area) return undefined
  return `${area.name} · ${wing.name}｜${area.summary}`
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点部署在自定义域名的 /notes/ 子路径下
  base: '/notes/',
  title: '史安宁的小学堂',
  description: '跨越年龄的边界，探索知识的无限可能。',
  lang: 'zh-CN',

  head: [['meta', { name: 'theme-color', content: '#fdfaf5' }]],

  // 默认的「上一篇 / 下一篇」按侧边栏顺序取邻项，会跳到「主题简介」页；
  // 关掉它，改由 ArticlePager 组件按文章顺序翻页。
  // 同时为没有写 description 的页面按展馆 / 主题自动生成独立的 SEO 描述。
  transformPageData(pageData) {
    pageData.frontmatter.prev = false
    pageData.frontmatter.next = false

    if (!pageData.frontmatter.description) {
      // 去掉 .md 和结尾的 /index，让展馆页与主题页都能命中
      const rel = pageData.relativePath.replace(/\.md$/, '').replace(/\/index$/, '')
      const generated = describePage(rel)
      if (generated) {
        // VitePress 的 <meta name="description"> 读的是 pageData.description
        pageData.description = generated
        pageData.frontmatter.description = generated
      }
    }
  },

  themeConfig: {
    siteTitle: '史安宁的小学堂',

    // 品牌区（Logo + 站名）直接指向主站大门，解决「知识库回不到首页」的单向门问题
    logoLink: 'https://shianning.com/',

    nav: [
      { text: '🏠 大门', link: 'https://shianning.com/' },
      { text: '🗺️ 展馆总览', link: '/' },
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

    // 站内搜索：构建时生成索引，不依赖任何外部服务
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除关键字',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
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
