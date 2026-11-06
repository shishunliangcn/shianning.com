import { createContentLoader } from 'vitepress'

/**
 * 收集全站带 tags 的文章，供「标签索引」页使用。
 *
 * 只认 frontmatter 里的 `tags: [a, b]`，标题缺省时退回 URL。
 */
export interface TaggedArticle {
  url: string
  title: string
  tags: string[]
}

/** 统一成 GitHub Pages 上可直接访问的静态路径 */
function toStaticUrl(url: string): string {
  if (url.endsWith('/')) return url
  return url.endsWith('.html') ? url : `${url}.html`
}

export default createContentLoader('**/*.md', {
  transform(pages) {
    return pages
      .filter((page) => {
        const tags = page.frontmatter?.tags
        return Array.isArray(tags) && tags.length > 0
      })
      .map((page) => ({
        url: toStaticUrl(page.url),
        title: String(page.frontmatter?.title ?? page.url),
        tags: (page.frontmatter.tags as unknown[]).map(String)
      }))
      .sort((a, b) => a.url.localeCompare(b.url))
  }
})

declare const data: TaggedArticle[]
export { data }
