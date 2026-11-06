import type { DefaultTheme } from 'vitepress'

/**
 * 五大展馆 —— 全站唯一的数据源。
 *
 * 不再有学段、年级或应试科目的概念：只有展馆（wing）与主题（area）。
 * 侧边栏、导航下拉、主页「知识库全图」、主题页的年龄提示都由这里派生。
 */

export interface ArticleDef {
  /** 侧边栏与标签页显示的文字 */
  title: string
  /** 页面 slug，即 docs/<wing>/<area>/<slug>.md */
  slug: string
}

export interface AreaDef {
  key: string
  name: string
  icon: string
  /** 一句话说明这个主题聊什么 */
  summary: string
  /** 该主题下已有的文章，按顺序出现在侧边栏 */
  articles?: ArticleDef[]
}

export interface WingDef {
  key: string
  name: string
  icon: string
  /** 展馆副标题，例如「探索宇宙与自然」 */
  motto: string
  summary: string
  /** 主题色，用于大门与知识库全图 */
  accent: string
  areas: AreaDef[]
}

export const wings: WingDef[] = [
  {
    key: 'nature',
    name: '格物馆',
    icon: '🌌',
    motto: '探索宇宙与自然',
    summary: '从一颗恒星的一生，到一滴水里的一次反应。这里回答「世界为什么是这个样子」。',
    accent: '#66d9ff',
    areas: [
      {
        key: 'astronomy',
        name: '天文',
        icon: '🔭',
        summary: '抬头看：恒星、行星、星系，以及人类如何一步步量出宇宙。',
        articles: [{ title: '星星为什么会发光', slug: 'stars' }]
      },
      {
        key: 'observation',
        name: '自然观察',
        icon: '🌿',
        summary: '动物与植物的个体观察：蹲下来看蚂蚁、摸树皮、听鸟叫，先学会看见。'
      },
      {
        key: 'experiments',
        name: '趣味实验',
        icon: '⚗️',
        summary: '用厨房里的材料做实验，把「为什么」变成「我试试」。'
      },
      {
        key: 'physics',
        name: '物理',
        icon: '⚛️',
        summary: '力、能量、电磁与时空：用最少的规律解释最多的现象。'
      },
      {
        key: 'chemistry',
        name: '化学',
        icon: '🧪',
        summary: '原子如何牵手又分开，物质为什么会有这样的脾气。'
      },
      {
        key: 'earth-ecology',
        name: '地球与生态',
        icon: '🌍',
        summary: '板块、气候与生态系统：脚下这颗星球作为一个整体如何运行。'
      }
    ]
  },
  {
    key: 'humanities',
    name: '知音馆',
    icon: '📜',
    motto: '穿梭历史与人文',
    summary: '过去的人怎么想、怎么活、为什么争执。读懂他们，才能读懂我们自己。',
    accent: '#ffd479',
    areas: [
      {
        key: 'history',
        name: '历史',
        icon: '🏺',
        summary: '文明如何兴起与转折，以及史料是怎么被读出来的。'
      },
      {
        key: 'philosophy',
        name: '哲学',
        icon: '🕯️',
        summary: '关于存在、知识与善恶的追问，以及如何把话讲清楚。',
        articles: [{ title: '苏格拉底为什么甘愿赴死', slug: 'socrates' }]
      },
      {
        key: 'society-psychology',
        name: '社会与心理',
        icon: '🧩',
        summary: '从 2 岁宝宝的情绪，到人在群体里的变化：理解行为背后的心理机制。',
        articles: [{ title: '宝宝生气了，可以怎么做？', slug: 'baby-emotions' }]
      },
      {
        key: 'puberty',
        name: '青春期与性教育',
        icon: '🌼',
        summary: '身体的变化、情绪的起伏，以及什么叫「我的身体我做主」。'
      },
      {
        key: 'people',
        name: '人物',
        icon: '👤',
        summary: '科学家、思想家、艺术家，以及那些没有留下名字的人。'
      }
    ]
  },
  {
    key: 'logic',
    name: '灵犀馆',
    icon: '🧠',
    motto: '语言与逻辑魔法',
    summary: '语言是工具，逻辑是骨架。学会它们，你就拥有拆解一切问题的能力。',
    accent: '#b39cff',
    areas: [
      {
        key: 'english-fun',
        name: '趣味英语',
        icon: '🔤',
        summary: '词源、习语与发音里的冷知识，让英语变得好玩。',
        articles: [
          { title: '为什么英语里的 I 永远大写', slug: 'why-i-capital' },
          { title: '动物宝宝怎么叫？', slug: 'baby-animals' }
        ]
      },
      {
        key: 'literature',
        name: '文学赏析',
        icon: '📖',
        summary: '诗、小说与散文：读懂作者藏在字缝里的意思。'
      },
      {
        key: 'math-thinking',
        name: '数学思维',
        icon: '🔢',
        summary: '不是算得快，而是想得清：证明、概率与建模。'
      },
      {
        key: 'programming-ai',
        name: '编程与AI',
        icon: '🤖',
        summary: '让机器按你的想法工作，并理解它为什么会出错。'
      },
      {
        key: 'media-literacy',
        name: '媒介素养',
        icon: '📱',
        summary: '这条消息是真的吗？刷手机停不下来怎么办？学会和信息相处。'
      }
    ]
  },
  {
    key: 'arts',
    name: '造物馆',
    icon: '🎨',
    motto: '艺术、动手与创想',
    summary: '看、听、做。用双手把想法变成现实，也学会判断什么是好作品。',
    accent: '#ff9ad5',
    areas: [
      {
        key: 'music',
        name: '音乐',
        icon: '🎵',
        summary: '声音如何变成音乐，以及怎么听出门道。',
        articles: [
          { title: '声音是怎么变成音乐的', slug: 'what-is-sound' },
          { title: '小手拍拍：2岁宝宝手指操', slug: 'baby-finger-play' }
        ]
      },
      {
        key: 'visual-art',
        name: '视觉艺术',
        icon: '🖼️',
        summary: '绘画、摄影与看展：训练一双会看的眼睛。'
      },
      {
        key: 'maker',
        name: '手工创客',
        icon: '🔨',
        summary: '木工、电子与 3D 打印，把想法做成能拿在手里的东西。'
      },
      {
        key: 'design',
        name: '设计',
        icon: '✏️',
        summary: '版式、配色与产品思维：让信息好看又好用。'
      },
      {
        key: 'body-games',
        name: '身体游戏',
        icon: '🤸',
        summary: '跑跳、翻滚、平衡：大运动与感统训练，玩着就把身体练协调。'
      }
    ]
  },
  {
    key: 'life',
    name: '长生馆',
    icon: '🛠️',
    motto: '生活、生存与实用技能',
    summary: '最要紧的知识往往最没人教：如何自救、如何持家、如何不让钱被骗走。',
    accent: '#7dffc4',
    areas: [
      {
        key: 'safety-first-aid',
        name: '安全急救',
        icon: '🚑',
        summary: '烫伤、出血、窒息与心肺复苏：关键时刻的正确动作。',
        articles: [{ title: '烫伤后的第一件事是什么', slug: 'burns' }]
      },
      {
        key: 'self-protection',
        name: '自我保护',
        icon: '🛡️',
        summary: '防走失、防欺凌、防触电：把「遇到危险怎么办」变成条件反射。'
      },
      {
        key: 'life-skills',
        name: '生活常识',
        icon: '🧰',
        summary: '收纳、家电、合同、办事流程，以及洗手刷牙这类日常习惯。',
        articles: [{ title: '洗手七步法（宝宝版）', slug: 'baby-wash-hands' }]
      },
      {
        key: 'financial-literacy',
        name: '财商启蒙',
        icon: '💰',
        summary: '记账、储蓄、复利与防骗，建立和钱的健康关系。'
      },
      {
        key: 'cooking',
        name: '美食烹饪',
        icon: '🍳',
        summary: '刀工、火候与调味：先学会喂饱自己。'
      }
    ]
  }
]

/**
 * 「父母的书架」—— 独立模块，不属于五大展馆。
 * 入口只有两处：首页页脚弱链接、低幼文章末尾的自然互链。
 *
 * 结构上分两层：平铺的育儿文章 + 若干子栏目（目前是「亲子英语发音小抄」）。
 */
export const parenting: {
  key: string
  name: string
  summary: string
  articles: Array<{ age: string; title: string; slug: string }>
  sections: Array<{
    key: string
    name: string
    icon: string
    summary: string
    articles: Array<{ title: string; slug: string }>
  }>
} = {
  key: 'parenting',
  name: '📚 父母的书架',
  summary: '按年龄分层的育儿实操笔记：不鸡娃，也不放任。',
  articles: [
    { age: '0–3 岁', title: '2岁宝宝总说“不”？这是自我意识的觉醒', slug: 'self-awareness-2yo' },
    { age: '3–6 岁', title: '如何应对幼儿园的分离焦虑', slug: 'separation-anxiety' },
    { age: '6–12 岁', title: '辅导作业不崩溃：培养内驱力的3个秘诀', slug: 'intrinsic-motivation' },
    { age: '青春期', title: '孩子突然关上了房门，父母该怎么办？', slug: 'closed-door' },
    { age: '父母自修', title: '育儿先育己：如何控制吼叫的冲动', slug: 'stop-yelling' }
  ],
  sections: [
    {
      key: 'phonics',
      name: '亲子英语发音小抄',
      icon: '🗣️',
      summary: '家长和孩子一起开口的发音小抄：点一下就能听标准读音，照着跟读。',
      articles: [{ title: '日常场景 · 46 条亲子英语', slug: 'parent-english-phonics' }]
    }
  ]
}

/** 年龄寻路的三个入口，顺序即展示顺序 */
export const ageGroups = [
  { tag: '2-6岁', label: '👦 我是学龄前（2-6岁）' },
  { tag: '6-12岁', label: '🎒 我是小学生（6-12岁）' },
  { tag: '12-18岁', label: '🧑‍🎓 我是中学生（12-18岁）' },
  { tag: '18岁+', label: '🎓 我是大学生/成人（18岁+）' }
]

/** `nature` → `/nature/` */
export function wingLink(wing: WingDef): string {
  return `/${wing.key}/`
}

/** `nature` + `astronomy` → `/nature/astronomy/` */
export function areaLink(wing: WingDef, area: AreaDef): string {
  return `/${wing.key}/${area.key}/`
}

/** `nature` + `astronomy` + `stars` → `/nature/astronomy/stars` */
export function articleLink(wing: WingDef, area: AreaDef, article: ArticleDef): string {
  return `/${wing.key}/${area.key}/${article.slug}`
}

/** 全站主题总数，供首页文案使用 */
export const areaCount = wings.reduce((total, wing) => total + wing.areas.length, 0)

/** 全站文章总数 */
export const articleCount = wings.reduce(
  (total, wing) => total + wing.areas.reduce((sum, area) => sum + (area.articles?.length ?? 0), 0),
  0
)

/**
 * 生成多级嵌套侧边栏：展馆 → 主题 → 文章。
 *
 * 键使用不带 base 的路径，VitePress 会自动套用 `base: '/notes/'`。
 */
export function buildSidebar(): Record<string, DefaultTheme.SidebarItem[]> {
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}

  for (const wing of wings) {
    const others = wings.filter((w) => w.key !== wing.key)

    sidebar[wingLink(wing)] = [
      {
        text: `${wing.icon} ${wing.name}`,
        collapsed: false,
        items: [
          { text: '展馆导言', link: wingLink(wing) },
          ...wing.areas.map((area) => ({
            text: `${area.icon} ${area.name}`,
            collapsed: true,
            items: [
              { text: '主题简介', link: areaLink(wing, area) },
              ...(area.articles ?? []).map((article) => ({
                text: article.title,
                link: articleLink(wing, area, article)
              }))
            ]
          }))
        ]
      },
      {
        text: '其他展馆',
        collapsed: true,
        items: others.map((w) => ({ text: `${w.icon} ${w.name}`, link: wingLink(w) }))
      }
    ]
  }

  sidebar['/parenting/'] = [
    {
      text: '📚 父母的书架',
      collapsed: false,
      items: [
        { text: '书架首页', link: '/parenting/' },
        ...parenting.articles.map((article) => ({
          text: article.title,
          link: `/parenting/${article.slug}`
        })),
        ...parenting.sections.map((section) => ({
          text: `${section.icon} ${section.name}`,
          collapsed: false,
          items: [
            { text: '栏目介绍', link: `/parenting/${section.key}/` },
            ...section.articles.map((article) => ({
              text: article.title,
              link: `/parenting/${section.key}/${article.slug}`
            }))
          ]
        }))
      ]
    },
    {
      text: '回到展馆',
      collapsed: true,
      items: wings.map((wing) => ({ text: `${wing.icon} ${wing.name}`, link: wingLink(wing) }))
    }
  ]

  return sidebar
}
