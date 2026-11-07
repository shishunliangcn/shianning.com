import { defineConfig } from 'vitepress'
import cjkFriendlyPlugin from 'markdown-it-cjk-friendly'
import { buildSidebar, wings } from './curriculum'
import { resolvePageContext } from './page-context'
import { SITE, siteUrl } from '../../site.config.mjs'

/**
 * 字体裁剪。
 *
 * VitePress 默认的 fonts.css 会打进 14 个子集（拉丁 / 拉丁扩展 / 希腊 / 西里尔 /
 * 越南语 × 常规 / 斜体，共 627 KB）。全站主体是中文，其余子集与斜体都用不到。
 *
 * 这里直接替换该文件的加载结果，只保留「拉丁常规体」+ 中文标点，
 * 产物字体从 14 个降到 1 个。
 */
const TRIMMED_FONTS_CSS = `
@font-face {
  font-family: Inter;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/inter-roman-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
    U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Punctuation SC';
  font-weight: 400;
  src: local('PingFang SC Regular'), local('Noto Sans CJK SC'), local('Microsoft YaHei');
  unicode-range: U+201C, U+201D, U+2018, U+2019, U+2E3A, U+2014, U+2013, U+2026,
    U+00B7, U+007E, U+002F;
}

@font-face {
  font-family: 'Punctuation SC';
  font-weight: 500;
  src: local('PingFang SC Medium'), local('Noto Sans CJK SC'), local('Microsoft YaHei');
  unicode-range: U+201C, U+201D, U+2018, U+2019, U+2E3A, U+2014, U+2013, U+2026,
    U+00B7, U+007E, U+002F;
}

@font-face {
  font-family: 'Punctuation SC';
  font-weight: 600;
  src: local('PingFang SC Semibold'), local('Noto Sans CJK SC Bold'), local('Microsoft YaHei Bold');
  unicode-range: U+201C, U+201D, U+2018, U+2019, U+2E3A, U+2014, U+2013, U+2026,
    U+00B7, U+007E, U+002F;
}

@font-face {
  font-family: 'Punctuation SC';
  font-weight: 700;
  src: local('PingFang SC Semibold'), local('Noto Sans CJK SC Bold'), local('Microsoft YaHei Bold');
  unicode-range: U+201C, U+201D, U+2018, U+2019, U+2E3A, U+2014, U+2013, U+2026,
    U+00B7, U+007E, U+002F;
}
`

/** 用裁剪版内容替换 VitePress 默认字体样式表 */
const trimDefaultFonts = {
  name: 'trim-default-fonts',
  enforce: 'pre' as const,
  load(id: string) {
    const clean = id.split('?')[0].replace(/\\/g, '/')
    if (!clean.endsWith('/theme-default/styles/fonts.css')) return
    return TRIMMED_FONTS_CSS
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点部署在自定义域名的 /notes/ 子路径下
  base: SITE.base,
  title: SITE.title,
  description: SITE.description,
  lang: SITE.lang,

  head: [
    ['meta', { name: 'theme-color', content: '#fdfaf5' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: SITE.shortTitle }],
    [
      'script',
      {},
      "if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}) }) }"
    ]
  ],

  // CommonMark 的强调规则遇到「中文 + ** + 中文标点」会失效
  // （例如 而是**「我说了算」的感觉**。 会原样输出星号），
  // 用 CJK 友好插件修正，让中文紧贴 ** 时也能正确加粗。
  markdown: {
    config(md) {
      md.use(cjkFriendlyPlugin)
    }
  },

  // 生成 sitemap；VitePress 只取 origin、不会带 base，
  // 由 scripts/assemble-site.mjs 统一补 /notes 前缀并并入主站首页
  sitemap: {
    hostname: SITE.origin
  },

  // 默认的「上一篇 / 下一篇」按侧边栏顺序取邻项，会跳到「主题简介」页；
  // 关掉它，改由 ArticlePager 组件按文章顺序翻页。
  // 同时为没有写 description 的页面按展馆 / 主题自动生成独立的 SEO 描述。
  transformPageData(pageData) {
    // 上下文隔离防线：无法归属任何板块的页面直接让构建失败。
    // 这样新增文件夹 / 漏登记的文章不可能「悄悄继承」别的板块的 UI，
    // 而是在 CI 阶段就被拦住。
    const ctx = resolvePageContext(pageData.relativePath)
    if (!ctx) {
      throw new Error(
        `[上下文隔离] 页面未登记：${pageData.relativePath}\n` +
          `  处理方式二选一：\n` +
          `    1. 在 curriculum.ts 中登记为展馆主题 / 文章；\n` +
          `    2. 若确认是独立系统页，加入 page-context.ts 的 SYSTEM_PAGES。`
      )
    }

    pageData.frontmatter.prev = false
    pageData.frontmatter.next = false

    // SEO 描述由解析器生成（页面自己写了 description 时以页面为准）
    if (!pageData.frontmatter.description && ctx.seoDescription) {
      pageData.description = ctx.seoDescription
      pageData.frontmatter.description = ctx.seoDescription
    }

    // 说明：首页 hero 的数字不做运行时注入。
    // VitePress 的首页 hero 直接读原始 frontmatter，transformPageData 改不动；
    // 所以 tagline 保持定性文案，实时数量由首页的 <KnowledgeMap /> 展示。
  },

  // 每页生成社交分享用的标签（标题 / 摘要 / 图标）
  transformHead({ pageData }) {
    const title = pageData.title || SITE.title
    const description = pageData.description || SITE.description
    return [
      ['meta', { property: 'og:site_name', content: SITE.title }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: siteUrl(SITE.icon.path) }],
      ['meta', { property: 'og:image:width', content: String(SITE.icon.size) }],
      ['meta', { property: 'og:image:height', content: String(SITE.icon.size) }],
      ['meta', { property: 'og:image:alt', content: `${SITE.title} 图标` }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:image', content: siteUrl(SITE.icon.path) }]
    ]
  },

  // 字体裁剪：用精简版替换 VitePress 默认字体表（详见文件顶部说明）
  vite: {
    plugins: [trimDefaultFonts]
  },

  themeConfig: {
    siteTitle: SITE.title,

    // 品牌区（Logo + 站名）直接指向主站大门，解决「知识库回不到首页」的单向门问题
    logoLink: SITE.origin + '/',

    nav: [
      { text: '🏠 大门', link: SITE.origin + '/' },
      { text: '🗺️ 展馆总览', link: '/' },
      {
        text: '展馆',
        items: wings.map((wing) => ({
          text: `${wing.icon} ${wing.name}`,
          link: `/${wing.key}/`
        }))
      },
      {
        text: '标签',
        items: [
          { text: '🏷️ 五大展馆', link: '/tags.html' },
          { text: '🏷️ 父母的书架', link: '/parenting/tags.html' }
        ]
      }
    ],

    // 侧边栏由 curriculum.ts 的展馆树生成，新增主题无需手改
    sidebar: buildSidebar(),

    editLink: {
      pattern: 'https://github.com/' + SITE.repo + '/edit/' + SITE.branch + '/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: SITE.footerMessage,
      copyright: 'Copyright © ' + new Date().getFullYear() + ' ' + SITE.title
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
