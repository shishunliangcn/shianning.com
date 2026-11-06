import { createContentLoader } from 'vitepress'

/**
 * 全站页面清单，供「延伸阅读」做相似度匹配。
 *
 * - 文章（url 以 .html 结尾）：按标签 / 主题 / 展馆打分
 * - 主题简介（url 以 / 结尾）：没有标签，只按同展馆做兜底推荐，
 *   避免文章数量少时硬凑出跨馆的无关内容
 */
export interface ArticleSummary {
  /** 可直接访问的静态路径 */
  url: string
  title: string
  tags: string[]
  /** 是否是主题简介页（不是文章） */
  isArea: boolean
}

/** 统一成 GitHub Pages 上可直接访问的静态路径 */
function toStaticUrl(url: string): string {
  if (url.endsWith('/')) return url
  return url.endsWith('.html') ? url : `${url}.html`
}

export default createContentLoader('**/*.md', {
  transform(pages) {
    return pages.map((page) => ({
      url: toStaticUrl(page.url),
      title: String(page.frontmatter?.title ?? page.title ?? page.url),
      tags: Array.isArray(page.frontmatter?.tags) ? page.frontmatter.tags.map(String) : [],
      isArea: page.url.endsWith('/')
    }))
  }
})

declare const data: ArticleSummary[]
export { data }
