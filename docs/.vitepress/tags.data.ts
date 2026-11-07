import { createContentLoader } from 'vitepress'

import { resolvePageContext } from './page-context'
import type { TagSection } from './tags'

/**
 * 收集带 tags 的文章，供「标签索引」页使用。
 *
 * 关键点：每篇文章都会用 resolvePageContext() 反查它属于哪个板块，
 * 并把这个身份写进数据里。标签页据此分册渲染，
 * 父母的文章永远不会出现在孩子的年龄检索里。
 *
 * 无法归属任何板块的页面（系统页、未登记页）直接跳过。
 */
export interface TaggedArticle {
  url: string
  title: string
  tags: string[]
  /** 所属板块：exhibition = 五大展馆，parenting = 父母的书架 */
  section: TagSection
}

/** 把页面 URL 归一成解析器需要的相对路径 */
function toRelativePath(url: string): string {
  const clean = url.replace(/^\/+/, '').replace(/\.html$/, '')
  if (!clean || clean.endsWith('/')) return `${clean}index`
  return clean
}

/** 统一成 GitHub Pages 上可直接访问的静态路径 */
function toStaticUrl(url: string): string {
  if (url.endsWith('/')) return url
  return url.endsWith('.html') ? url : `${url}.html`
}

export default createContentLoader('**/*.md', {
  transform(pages) {
    const collected: TaggedArticle[] = []

    for (const page of pages) {
      const tags = page.frontmatter?.tags
      if (!Array.isArray(tags) || tags.length === 0) continue

      const ctx = resolvePageContext(toRelativePath(page.url))
      // 只收「展馆」与「书架」两个业务板块；系统页与未登记页一律不收
      if (!ctx || (ctx.kind !== 'exhibition' && ctx.kind !== 'parenting')) continue

      collected.push({
        url: toStaticUrl(page.url),
        title: String(page.frontmatter?.title ?? page.url),
        tags: (tags as unknown[]).map(String),
        section: ctx.kind
      })
    }

    return collected.sort((a, b) => a.url.localeCompare(b.url))
  }
})

declare const data: TaggedArticle[]
export { data }
