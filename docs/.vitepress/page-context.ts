import {
  articleLink,
  parenting,
  parentingArticleLink,
  parentingSectionLink,
  wings
} from './curriculum'
import type { AreaDef, WingDef } from './curriculum'

/**
 * 页面上下文（Page Context）—— 全站 UI 渲染边界的唯一裁决层。
 *
 * 设计原则
 * ────────
 * 1. 任何页面都必须属于且只属于一个「板块」（section），由路径解析得出。
 * 2. 每个板块集中声明自己允许挂载哪些 UI 能力（CAPABILITIES），默认全部关闭。
 * 3. 组件不允许自己判断路径，只能读解析结果里的 ui.* 开关。
 * 4. 无法归属的页面返回 null —— 构建时直接报错，不允许「悄悄继承」别人的 UI。
 *
 * 同时，页面的 SEO 描述也在这里生成：路径解析只有这一份实现。
 */

/* ------------------------------------------------------------------ */
/* 板块与能力                                                          */
/* ------------------------------------------------------------------ */

/** 业务板块类型。新增板块 = 在这里加一个 kind + 在 CAPABILITIES 里登记 */
export type SectionKind = 'exhibition' | 'parenting' | 'system'

/** 页面在板块内的角色 */
type PageRole = 'landing' | 'index' | 'article' | 'tags' | 'system'

/** 一个板块允许出现的 UI 能力。默认全关，按需开启。 */
export interface UiCapabilities {
  /** 顶部「本主题横跨多个年龄段」提示 —— 只对展馆主题页有意义 */
  ageHint: boolean
  /** 展馆首页的「本馆主题」表格 */
  themeTable: boolean
  /** 展馆首页的「先看这一篇」推荐位 */
  featured: boolean
  /** 书架首页的「按年龄找」表格 */
  parentingArticles: boolean
  /** 书架首页的栏目入口 */
  parentingSections: boolean
  /** 主题页 / 栏目页的「从这里开始」文章列表 */
  articleList: boolean
  /** 本板块的标签索引（每个板块一个独立页面） */
  tagIndex: boolean
  /** 文章级上一篇 / 下一篇 */
  pager: boolean
  /** 文章标签 */
  tags: boolean
}

/**
 * 板块 → 能力表。
 *
 * 这里是全站唯一声明「谁能出现什么 UI」的地方。
 * 父母的书架是成人向内容，ageHint 永远为 false——不是补丁，是定义。
 */
const CAPABILITIES: Record<SectionKind, UiCapabilities> = {
  exhibition: {
    ageHint: true,
    themeTable: true,
    featured: true,
    articleList: true,
    tagIndex: true,
    parentingArticles: false,
    parentingSections: false,
    pager: true,
    tags: true
  },
  parenting: {
    ageHint: false,
    themeTable: false,
    featured: false,
    articleList: true,
    tagIndex: true,
    parentingArticles: true,
    parentingSections: true,
    pager: true,
    tags: true
  },
  system: {
    ageHint: false,
    themeTable: false,
    featured: false,
    articleList: false,
    tagIndex: false,
    parentingArticles: false,
    parentingSections: false,
    pager: false,
    tags: false
  }
}

/* ------------------------------------------------------------------ */
/* 上下文结构                                                          */
/* ------------------------------------------------------------------ */

interface ArticleRef {
  title: string
  /** 不带 base、不带扩展名的站内路径，例如 /nature/astronomy/stars */
  path: string
  /** 翻页卡片上显示的归属，例如「格物馆 · 天文」 */
  group: string
}

export interface PageContext {
  kind: SectionKind
  role: PageRole
  /** 归一化后的页面路径（不带 .md） */
  path: string
  wing?: WingDef
  area?: AreaDef
  section?: { key: string; name: string }
  /** 同一板块内的文章顺序，供翻页使用 */
  siblings: ArticleRef[]
  /** 当前文章在 siblings 中的下标；-1 表示当前页不是文章 */
  cursor: number
  /** 组件唯一需要读的开关集合 */
  ui: UiCapabilities
  /** 由路径自动生成的 SEO 描述（页面自己写了 description 时不使用） */
  seoDescription?: string
}

/** 未识别页面时给的保守上下文：所有 UI 关闭 */
export const EMPTY_CONTEXT: PageContext = {
  kind: 'system',
  role: 'system',
  path: '',
  siblings: [],
  cursor: -1,
  ui: {
    ageHint: false,
    themeTable: false,
    featured: false,
    articleList: false,
    tagIndex: false,
    parentingArticles: false,
    parentingSections: false,
    pager: false,
    tags: false
  }
}

/* ------------------------------------------------------------------ */
/* 文章序列                                                            */
/* ------------------------------------------------------------------ */

/** 某展馆下的全部文章，按主题顺序串联 */
function wingArticles(wing: WingDef): ArticleRef[] {
  const list: ArticleRef[] = []
  for (const area of wing.areas) {
    for (const article of area.articles ?? []) {
      list.push({
        title: article.title,
        path: articleLink(wing, area, article),
        group: `${wing.name} · ${area.name}`
      })
    }
  }
  return list
}

/** 父母的书架下的全部文章：平铺文章 + 各子栏目文章 */
function parentingArticles(): ArticleRef[] {
  const list: ArticleRef[] = []
  for (const article of parenting.articles) {
    list.push({
      title: article.title,
      path: parentingArticleLink(article.slug),
      group: '父母的书架'
    })
  }
  for (const section of parenting.sections) {
    for (const article of section.articles) {
      list.push({
        title: article.title,
        path: parentingSectionLink(section.key, article.slug),
        group: `父母的书架 · ${section.name}`
      })
    }
  }
  return list
}

/* ------------------------------------------------------------------ */
/* 解析器                                                              */
/* ------------------------------------------------------------------ */

/** 不属于任何业务板块的独立页面 */
const SYSTEM_PAGES = new Set(['index', 'CONTENT_MAP'])

/** 书架的固定描述（增删文章不需要改动） */
const PARENTING_DESCRIPTION = '父母的书架｜按年龄分层的育儿实操笔记：不鸡娃，也不放任。'

function baseContext(kind: SectionKind, role: PageRole, path: string): PageContext {
  return {
    kind,
    role,
    path,
    siblings: [],
    cursor: -1,
    ui: { ...CAPABILITIES[kind] }
  }
}

/** 按能力表收窄到「这个角色真正该有的 UI」 */
function narrow(ctx: PageContext): PageContext {
  const caps = CAPABILITIES[ctx.kind]
  const isExhibition = ctx.kind === 'exhibition'
  const isParenting = ctx.kind === 'parenting'
  ctx.ui = {
    ageHint: caps.ageHint && ctx.role === 'index' && isExhibition,
    themeTable: caps.themeTable && ctx.role === 'landing' && isExhibition,
    featured: caps.featured && ctx.role === 'landing' && isExhibition,
    articleList: caps.articleList && ctx.role === 'index',
    tagIndex: caps.tagIndex && ctx.role === 'tags',
    parentingArticles: caps.parentingArticles && ctx.role === 'landing' && isParenting,
    parentingSections: caps.parentingSections && ctx.role === 'landing' && isParenting,
    pager: caps.pager && ctx.role === 'article',
    tags: caps.tags && ctx.role === 'article'
  }
  return ctx
}

function resolveExhibition(wing: WingDef, rest: string[], path: string): PageContext | null {
  // <wing>/index → 展馆首页
  if (rest.length === 1 && rest[0] === 'index') {
    const ctx = baseContext('exhibition', 'landing', path)
    ctx.wing = wing
    ctx.seoDescription = `${wing.name}（${wing.motto}）：${wing.summary}`
    return narrow(ctx)
  }

  // <wing>/<area>/index → 主题简介
  if (rest.length === 2 && rest[1] === 'index') {
    const area = wing.areas.find((item) => item.key === rest[0])
    if (!area) return null
    const ctx = baseContext('exhibition', 'index', path)
    ctx.wing = wing
    ctx.area = area
    ctx.seoDescription = `${area.name} · ${wing.name}｜${area.summary}`
    return narrow(ctx)
  }

  // <wing>/<area>/<slug> → 文章（必须在 curriculum 里登记过）
  if (rest.length === 2) {
    const area = wing.areas.find((item) => item.key === rest[0])
    if (!area) return null
    const article = (area.articles ?? []).find((item) => item.slug === rest[1])
    if (!article) return null

    const ctx = baseContext('exhibition', 'article', path)
    ctx.wing = wing
    ctx.area = area
    ctx.seoDescription = `${article.title} · ${area.name}｜${area.summary}`
    ctx.siblings = wingArticles(wing)
    ctx.cursor = ctx.siblings.findIndex((item) => item.path === path)
    return narrow(ctx)
  }

  return null
}

function resolveParenting(rest: string[], path: string): PageContext | null {
  // parenting/index → 书架首页
  if (rest.length === 1 && rest[0] === 'index') {
    const ctx = baseContext('parenting', 'landing', path)
    ctx.seoDescription = PARENTING_DESCRIPTION
    return narrow(ctx)
  }

  // parenting/<slug> → 平铺的育儿文章
  if (rest.length === 1) {
    const found = parenting.articles.some((item) => item.slug === rest[0])
    if (!found) return null
    const ctx = baseContext('parenting', 'article', path)
    ctx.seoDescription = PARENTING_DESCRIPTION
    ctx.siblings = parentingArticles()
    ctx.cursor = ctx.siblings.findIndex((item) => item.path === path)
    return narrow(ctx)
  }

  // parenting/<section>/index → 栏目介绍
  if (rest.length === 2 && rest[1] === 'index') {
    const section = parenting.sections.find((item) => item.key === rest[0])
    if (!section) return null
    const ctx = baseContext('parenting', 'index', path)
    ctx.section = { key: section.key, name: section.name }
    ctx.seoDescription = `${section.name} · 父母的书架｜${section.summary}`
    return narrow(ctx)
  }

  // parenting/<section>/<slug> → 栏目文章
  if (rest.length === 2) {
    const section = parenting.sections.find((item) => item.key === rest[0])
    if (!section) return null
    const found = section.articles.some((item) => item.slug === rest[1])
    if (!found) return null
    const ctx = baseContext('parenting', 'article', path)
    ctx.section = { key: section.key, name: section.name }
    ctx.seoDescription = `${section.name} · 父母的书架｜${section.summary}`
    ctx.siblings = parentingArticles()
    ctx.cursor = ctx.siblings.findIndex((item) => item.path === path)
    return narrow(ctx)
  }

  return null
}

/**
 * 把页面路径解析成上下文。
 * 返回 null 表示「不属于任何已登记的板块」——调用方应当视为构建错误。
 */
export function resolvePageContext(relativePath: string): PageContext | null {
  const rel = relativePath.replace(/\\/g, '/').replace(/\.md$/, '').replace(/^\/+/, '')
  const path = `/${rel}`

  // 两个标签索引页：各自归属一个板块，互不相通
  if (rel === 'tags') {
    const ctx = baseContext('exhibition', 'tags', path)
    ctx.seoDescription = '五大展馆的标签索引：按主题与年龄找孩子的文章。'
    return narrow(ctx)
  }
  if (rel === 'parenting/tags') {
    const ctx = baseContext('parenting', 'tags', path)
    ctx.seoDescription = '父母的书架的标签索引：按主题与孩子年龄找育儿笔记。'
    return narrow(ctx)
  }

  if (SYSTEM_PAGES.has(rel)) {
    return narrow(baseContext('system', 'system', path))
  }

  const [head, ...rest] = rel.split('/')

  const wing = wings.find((item) => item.key === head)
  if (wing) return resolveExhibition(wing, rest, path)

  if (head === parenting.key) return resolveParenting(rest, path)

  return null
}
