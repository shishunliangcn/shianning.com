import { ageGroups, wings } from './curriculum'

/**
 * 标签的板块归属、词表与锚点规则 —— 唯一实现。
 *
 * 五大展馆（给孩子）与父母的书架（给家长）是两套完全独立的索引：
 *   · /tags.html            → 只有展馆文章
 *   · /parenting/tags.html  → 只有书架文章
 *
 * 标签是「受控词表」，不是自由填写的：
 *   · 主题标签 = curriculum 里的 26 个主题名
 *   · 年龄标签 = 4 个固定年龄
 *   · 额外标签 = 少量白名单
 * 构建时会逐篇校验，出现词表外的标签直接失败，
 * 保证标签总量有界，索引永远是一屏能看完的目录。
 */
export type TagSection = 'exhibition' | 'parenting'

/** 年龄标签（固定 4 个） */
export const AGE_TAGS: readonly string[] = ageGroups.map((group) => group.tag)

/** 少量白名单：低幼共读、家长向 */
export const EXTRA_TAGS: readonly string[] = ['2岁启蒙', '亲子互动', '父母必读', '养育方向']

/** 主题标签 = 26 个主题名 */
export const THEME_TAGS: readonly string[] = wings.flatMap((wing) => wing.areas.map((area) => area.name))

/** 主题标签按展馆分组，供索引页做目录 */
export const THEME_GROUPS: ReadonlyArray<{ name: string; icon: string; tags: string[] }> = wings.map(
  (wing) => ({
    name: wing.name,
    icon: wing.icon,
    tags: wing.areas.map((area) => area.name)
  })
)

/** 合法标签全集：词表校验用它判定 */
export const VOCABULARY: ReadonlySet<string> = new Set([...AGE_TAGS, ...EXTRA_TAGS, ...THEME_TAGS])

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
