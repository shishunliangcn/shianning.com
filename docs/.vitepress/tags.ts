/**
 * 标签的板块归属与锚点规则 —— 唯一实现。
 *
 * 五大展馆（给孩子）与父母的书架（给家长）在数据聚合层必须隔离：
 * 标签数据由 tags.data.ts 按页面上下文标注 section，
 * 标签页按 section 分册渲染，所有指向标签的链接也必须带上 section。
 *
 * 这样即使一篇文章打了「2-6岁」标签，它也只出现在自己板块的
 * 年龄分组里，绝不会串到另一边的检索结果。
 */
export type TagSection = 'exhibition' | 'parenting'

/** 标签分组的 DOM id（页面上唯一） */
export function tagAnchor(section: TagSection, tag: string): string {
  return `tag-${section}-${tag}`
}

/** 指向某个板块下某个标签的完整站内路径 */
export function tagHref(section: TagSection, tag: string): string {
  return `/tags.html#${encodeURIComponent(tagAnchor(section, tag))}`
}
