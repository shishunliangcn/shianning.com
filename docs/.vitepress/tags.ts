/**
 * 标签的板块归属与锚点规则 —— 唯一实现。
 *
 * 五大展馆（给孩子）与父母的书架（给家长）是两套完全独立的索引：
 *   · /tags.html            → 只有展馆文章
 *   · /parenting/tags.html  → 只有书架文章
 *
 * 两个页面各自独立命名空间，互不引用、互不交叉。
 */
export type TagSection = 'exhibition' | 'parenting'

/** 某个板块的标签索引页 */
export function tagPage(section: TagSection): string {
  return section === 'parenting' ? '/parenting/tags.html' : '/tags.html'
}

/** 页内锚点（每个板块的页面各自独立，因此不需要板块前缀） */
export function tagAnchor(tag: string): string {
  return `tag-${tag}`
}

/** 指向某个板块标签索引里某个标签的完整站内路径 */
export function tagHref(section: TagSection, tag: string): string {
  return `${tagPage(section)}#${encodeURIComponent(tagAnchor(tag))}`
}
