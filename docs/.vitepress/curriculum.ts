import type { DefaultTheme } from 'vitepress'

/**
 * 课程树 —— 全站唯一的数据源。
 *
 * 侧边栏、主页「知识库全图」、学段页都从这里派生，
 * 新增学段或学科时只需要改这一个文件。
 */

export interface PageDef {
  /** 侧边栏里显示的文字 */
  text: string
  /** 页面 slug，即 docs/<stage>/<subject>/<slug>.md */
  slug: string
}

export interface SubjectDef {
  key: string
  name: string
  icon: string
  /** 一句话说明该学段下这门学科的重点 */
  summary: string
  /** 该学科下已有的文章，按顺序出现在侧边栏 */
  pages?: PageDef[]
}

export interface StageDef {
  key: string
  name: string
  icon: string
  /** 适读年龄 */
  age: string
  tagline: string
  summary: string
  /** 主题色，用于知识库全图的卡片点缀 */
  accent: string
  subjects: SubjectDef[]
}

const subjectMeta = {
  chinese: { name: '语文', icon: '📖' },
  math: { name: '数学', icon: '🔢' },
  english: { name: '英语', icon: '🔤' },
  music: { name: '音乐', icon: '🎵' }
} as const

export const stages: StageDef[] = [
  {
    key: 'preschool',
    name: '启蒙乐园',
    icon: '👶',
    age: '3–6 岁',
    tagline: '玩中学，把好奇心留在身边',
    summary: '以游戏、绘本和儿歌为主，先建立对文字、数字与声音的亲近感，不急着赶进度。',
    accent: '#f59e0b',
    subjects: [
      {
        key: 'chinese',
        ...subjectMeta.chinese,
        summary: '从认读身边的常见字，到能完整讲述一件小事。'
      },
      {
        key: 'math',
        ...subjectMeta.math,
        summary: '数数、比大小、认图形，把数学藏进游戏里。'
      },
      {
        key: 'english',
        ...subjectMeta.english,
        summary: '磨耳朵、开口说，用儿歌建立最初的语感。'
      },
      {
        key: 'music',
        ...subjectMeta.music,
        summary: '感受节拍与旋律，用身体和声音表达情绪。'
      }
    ]
  },
  {
    key: 'primary',
    name: '小学课堂',
    icon: '🎒',
    age: '6–12 岁',
    tagline: '打好底子，让基础扎实可依赖',
    summary: '语文、数学、英语三线并进，重点是习惯与基本功：读得懂、算得对、说得出口。',
    accent: '#0d9488',
    subjects: [
      {
        key: 'chinese',
        ...subjectMeta.chinese,
        summary: '识字、朗读、复述与写作起步，把话说清楚。'
      },
      {
        key: 'math',
        ...subjectMeta.math,
        summary: '计算与数量关系打底，养成审题和检验的习惯。'
      },
      {
        key: 'english',
        ...subjectMeta.english,
        summary: '自然拼读加高频词，从听懂到敢开口。',
        pages: [{ text: '朗读组件演示', slug: 'demo' }]
      },
      {
        key: 'music',
        ...subjectMeta.music,
        summary: '识谱入门、整齐歌唱，尝试简单器乐。'
      }
    ]
  },
  {
    key: 'middle',
    name: '中学冲刺',
    icon: '📚',
    age: '12–18 岁',
    tagline: '系统梳理，把难点一个个拆开',
    summary: '面向中考与高考，强调知识体系、专题突破和错题归因，追求稳定而不是运气。',
    accent: '#2563eb',
    subjects: [
      {
        key: 'chinese',
        ...subjectMeta.chinese,
        summary: '文言启蒙、现代文阅读与议论文写作。'
      },
      {
        key: 'math',
        ...subjectMeta.math,
        summary: '代数与几何双线推进，重难点专题拆解。'
      },
      {
        key: 'english',
        ...subjectMeta.english,
        summary: '语法体系化、阅读提速与写作模板。'
      },
      {
        key: 'music',
        ...subjectMeta.music,
        summary: '基础乐理与作品赏析，理解音乐背后的时代。'
      }
    ]
  },
  {
    key: 'university',
    name: '大学殿堂',
    icon: '🎓',
    age: '18 岁以上',
    tagline: '建立框架，学会自己找答案',
    summary: '从应试走向自学：学术阅读与写作、高等数学、学术英语，以及更自觉的审美训练。',
    accent: '#7c3aed',
    subjects: [
      {
        key: 'chinese',
        ...subjectMeta.chinese,
        summary: '大学语文与学术写作，训练论证与引证。'
      },
      {
        key: 'math',
        ...subjectMeta.math,
        summary: '高等数学与线性代数，强调概念直观。'
      },
      {
        key: 'english',
        ...subjectMeta.english,
        summary: '学术英语读写、四六级与文献阅读。'
      },
      {
        key: 'music',
        ...subjectMeta.music,
        summary: '音乐史与作品分析，从听赏走向评论。'
      }
    ]
  }
]

/** `preschool` → `/preschool/` */
export function stageLink(stage: StageDef): string {
  return `/${stage.key}/`
}

/** `preschool` + `chinese` → `/preschool/chinese/` */
export function subjectLink(stage: StageDef, subject: SubjectDef): string {
  return `/${stage.key}/${subject.key}/`
}

/** `preschool` + `chinese` + `demo` → `/preschool/chinese/demo` */
export function pageLink(stage: StageDef, subject: SubjectDef, page: PageDef): string {
  return `/${stage.key}/${subject.key}/${page.slug}`
}

/**
 * 生成多级嵌套侧边栏：学段 → 学科 → 文章。
 *
 * 键使用不带 base 的路径，VitePress 会自动套用 `base: '/notes/'`。
 */
export function buildSidebar(): Record<string, DefaultTheme.SidebarItem[]> {
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}

  for (const stage of stages) {
    const others = stages.filter((s) => s.key !== stage.key)

    sidebar[stageLink(stage)] = [
      {
        text: `${stage.icon} ${stage.name}`,
        collapsed: false,
        items: [
          { text: '学段概况', link: stageLink(stage) },
          ...stage.subjects.map((subject) => ({
            text: `${subject.icon} ${subject.name}`,
            collapsed: true,
            items: [
              { text: '学科概况', link: subjectLink(stage, subject) },
              ...(subject.pages ?? []).map((page) => ({
                text: page.text,
                link: pageLink(stage, subject, page)
              }))
            ]
          }))
        ]
      },
      {
        text: '切换学段',
        collapsed: true,
        items: others.map((s) => ({ text: `${s.icon} ${s.name}`, link: stageLink(s) }))
      }
    ]
  }

  return sidebar
}
