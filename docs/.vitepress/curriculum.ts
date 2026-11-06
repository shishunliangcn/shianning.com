import type { DefaultTheme } from 'vitepress'

/**
 * 课程树 —— 全站唯一的数据源。
 *
 * 侧边栏、导航下拉、主页「知识库全图」、学段页都由这里派生，
 * 新增学段或学科时只需要改这一个文件 + 建对应目录。
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

export const stages: StageDef[] = [
  {
    key: 'preschool',
    name: '启蒙乐园',
    icon: '👶',
    age: '3–6 岁',
    tagline: '玩中学，把好奇心留在身边',
    summary: '不按学科分科，而是按孩子真实的生活场景组织：照顾自己、说出想法、认识世界、动手创造、学会相处。',
    accent: '#f59e0b',
    subjects: [
      {
        key: 'health-life',
        name: '健康与生活',
        icon: '🌱',
        summary: '吃饭、睡觉、穿衣、洗手，把照顾自己变成习惯。'
      },
      {
        key: 'language',
        name: '语言与表达',
        icon: '🗣️',
        summary: '听故事、说完整的话，在绘本里认识文字。'
      },
      {
        key: 'nature',
        name: '自然与科学',
        icon: '🔍',
        summary: '观察动植物与天气，在生活里数数、比较、提问。'
      },
      {
        key: 'art',
        name: '艺术与创想',
        icon: '🎨',
        summary: '涂鸦、手工、唱游，用身体和颜色表达情绪。'
      },
      {
        key: 'society',
        name: '社会与品格',
        icon: '🤝',
        summary: '认识情绪、学习分享与等待，理解简单的规则。'
      }
    ]
  },
  {
    key: 'primary',
    name: '小学课堂',
    icon: '🎒',
    age: '6–12 岁',
    tagline: '打好底子，让基础扎实可依赖',
    summary: '八门学科覆盖语言、数理、人文、体艺与信息素养，重点是习惯与基本功：读得懂、算得对、说得出口、动得起来。',
    accent: '#0d9488',
    subjects: [
      {
        key: 'chinese',
        name: '语文',
        icon: '📖',
        summary: '识字写字、朗读背诵、阅读理解、写作起步。'
      },
      {
        key: 'math',
        name: '数学',
        icon: '🔢',
        summary: '计算与数量关系打底，养成审题和检验的习惯。'
      },
      {
        key: 'english',
        name: '英语',
        icon: '🔤',
        summary: '自然拼读加高频词，从听懂到敢开口。',
        pages: [{ text: '朗读组件演示', slug: 'demo' }]
      },
      {
        key: 'science',
        name: '科学探索',
        icon: '🔬',
        summary: '从观察和实验出发，学会提问、记录与解释。'
      },
      {
        key: 'humanities',
        name: '人文素养',
        icon: '🏛️',
        summary: '历史故事、地理常识与传统文化，建立时间感与空间感。'
      },
      {
        key: 'pe-health',
        name: '体育与健康',
        icon: '⚽',
        summary: '体能、运动技能与安全常识，把身体练成底气。'
      },
      {
        key: 'art',
        name: '艺术审美',
        icon: '🎨',
        summary: '美术与音乐同步启蒙，敢画、敢唱、看得出好坏。'
      },
      {
        key: 'it',
        name: '信息技术',
        icon: '💻',
        summary: '打字、文件管理与图形化编程，安全地使用电脑。'
      }
    ]
  },
  {
    key: 'middle',
    name: '中学冲刺',
    icon: '📚',
    age: '12–18 岁',
    tagline: '系统梳理，把难点一个个拆开',
    summary: '十门学科对应中高考的完整盘面，强调知识体系、专题突破和错题归因，追求稳定而不是运气。',
    accent: '#2563eb',
    subjects: [
      {
        key: 'chinese',
        name: '语文',
        icon: '📖',
        summary: '文言实词虚词、现代文阅读、名著、记叙与议论文。'
      },
      {
        key: 'math',
        name: '数学',
        icon: '🔢',
        summary: '方程与函数、几何证明、统计概率、压轴题策略。'
      },
      {
        key: 'english',
        name: '英语',
        icon: '🔤',
        summary: '语法体系、完形与阅读、写作模板、听力。'
      },
      {
        key: 'physics',
        name: '物理',
        icon: '⚛️',
        summary: '力学、电学、光学，用模型解释现象。'
      },
      {
        key: 'chemistry',
        name: '化学',
        icon: '🧪',
        summary: '物质构成、反应规律与实验探究。'
      },
      {
        key: 'biology',
        name: '生物',
        icon: '🧬',
        summary: '细胞、遗传、生态，理解生命系统的层次。'
      },
      {
        key: 'history',
        name: '历史',
        icon: '📜',
        summary: '中外通史主线与史料阅读，学会在时间轴上思考。'
      },
      {
        key: 'geography',
        name: '地理',
        icon: '🌏',
        summary: '自然地理原理与区域分析，读懂地图与数据。'
      },
      {
        key: 'politics',
        name: '政治',
        icon: '⚖️',
        summary: '道德与法治、经济与哲学常识，学会规范表达。'
      },
      {
        key: 'pe-health',
        name: '体育与健康',
        icon: '🏃',
        summary: '中考体测项目与日常锻炼，兼顾作息与心理。'
      }
    ]
  },
  {
    key: 'university',
    name: '大学殿堂',
    icon: '🎓',
    age: '18 岁以上',
    tagline: '建立框架，学会自己找答案',
    summary: '不再有标准答案，六门学科提供的是「看世界的方式」：通识的视野、数学的严谨、计算的工具、经济的判断、心理的理解、职业的规划。',
    accent: '#7c3aed',
    subjects: [
      {
        key: 'general-education',
        name: '通识教育',
        icon: '🧭',
        summary: '人文、社科与自然科学的大图景，建立跨学科视野。'
      },
      {
        key: 'advanced-math',
        name: '高等数学',
        icon: '📐',
        summary: '微积分与线性代数，强调概念直观与证明意识。'
      },
      {
        key: 'computer-basics',
        name: '计算机基础',
        icon: '💻',
        summary: '编程入门、数据结构与工具链，把计算机当杠杆。'
      },
      {
        key: 'econ-management',
        name: '经济与管理',
        icon: '📈',
        summary: '供求、成本、组织与决策，用经济学眼光看日常。'
      },
      {
        key: 'psychology',
        name: '心理学',
        icon: '🧠',
        summary: '认知、情绪与发展规律，先理解自己再理解他人。'
      },
      {
        key: 'career-planning',
        name: '职业与规划',
        icon: '🎯',
        summary: '认识行业与岗位，把兴趣翻译成可执行的路径。'
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

/** `primary` + `english` + `demo` → `/primary/english/demo` */
export function pageLink(stage: StageDef, subject: SubjectDef, page: PageDef): string {
  return `/${stage.key}/${subject.key}/${page.slug}`
}

/** 全站学科总数，供首页文案使用 */
export const subjectCount = stages.reduce((total, stage) => total + stage.subjects.length, 0)

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
