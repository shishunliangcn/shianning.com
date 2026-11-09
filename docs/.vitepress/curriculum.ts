import type { DefaultTheme } from 'vitepress'

/**
 * 五大展馆 —— 全站唯一的数据源。
 *
 * 不再有学段、年级或应试科目的概念：只有展馆（wing）与主题（area）。
 * 侧边栏、导航下拉、主页「知识库全图」、主题页的年龄提示都由这里派生。
 */

interface ArticleDef {
  /** 侧边栏与标签页显示的文字 */
  title: string
  /** 页面 slug，即 docs/<wing>/<area>/<slug>.md */
  slug: string
  /** 一句推荐语，出现在主题页 / 栏目页的「从这里开始」列表 */
  note?: string
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

/** 展馆首页「先看这一篇」的推荐位，避免在 markdown 里手写链接 */
export interface FeaturedDef {
  /** 所属主题 key */
  area: string
  /** 文章 slug */
  slug: string
  /** 一句话推荐语 */
  note: string
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
  /** 本馆推荐阅读（展馆首页自动渲染） */
  featured?: FeaturedDef
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
    featured: { area: 'astronomy', slug: 'stars', note: '从核聚变到光谱，一次讲清' },
    areas: [
      {
        key: 'astronomy',
        name: '天文',
        icon: '🔭',
        summary: '抬头看：恒星、行星、星系，以及人类如何一步步量出宇宙。',
        articles: [{ title: '太阳走了，月亮来了', slug: 'sun-and-moon', note: '给 2 岁宝宝的天文第一课' }, { title: '星星为什么会发光', slug: 'stars', note: '从核聚变到光谱' }, { title: '星座是怎么来的', slug: 'constellations', note: '人往上画的图' }, { title: '月亮为什么会有圆缺', slug: 'moon-phases', note: '受光面在变' }, { title: '我们怎么知道星星有多远', slug: 'how-far-are-stars', note: '视差与造父变星' }]
      },
      {
        key: 'observation',
        name: '自然观察',
        icon: '🌿',
        summary: '动物与植物的个体观察：蹲下来看蚂蚁、摸树皮、听鸟叫，先学会看见。',
        articles: [{ title: '蚂蚁在忙什么？', slug: 'ant-walk', note: '蹲下来，看 10 分钟' }, { title: '一片叶子的一生', slug: 'leaf-life', note: '秋天的颜色是「卸妆」' }, { title: '云为什么会飘在天上', slug: 'why-clouds-float', note: '它落得极慢' }, { title: '鸟叫在说什么', slug: 'bird-song', note: '宣示、联络、警报' }, { title: '天要下雨，怎么看出来', slug: 'weather-signs', note: '云、风、闷' }]
      },
      {
        key: 'experiments',
        name: '趣味实验',
        icon: '⚗️',
        summary: '用厨房里的材料做实验，把「为什么」变成「我试试」。',
        articles: [{ title: '冰块去哪儿了？', slug: 'ice-melts', note: '两块冰赛跑' }, { title: '一张纸能承多重', slug: 'paper-bridge', note: '折一下，强度差几十倍' }, { title: '会跳舞的葡萄干', slug: 'dancing-raisins', note: '气泡在搬东西' }, { title: '分层饮料：一个杯子里的三层', slug: 'density-tower', note: '密度不同，谁也不服谁' }, { title: '气球火箭', slug: 'balloon-rocket', note: '反作用力' }, { title: '头发能把纸吸起来', slug: 'static-electricity', note: '摩擦起电' }, { title: '蜡烛把水吸进了杯子', slug: 'candle-vacuum', note: '气压在干活' }, { title: '彩虹牛奶', slug: 'rainbow-milk', note: '表面张力被破坏' }, { title: '柠檬也能发电', slug: 'lemon-battery', note: '电池最原始的样子' }, { title: '会开花的纸', slug: 'blooming-paper', note: '毛细现象' }]
      },
      {
        key: 'physics',
        name: '物理',
        icon: '⚛️',
        summary: '力、能量、电磁与时空：用最少的规律解释最多的现象。',
        articles: [{ title: '天为什么是蓝的', slug: 'sky-is-blue', note: '蓝光被撒开了' }, { title: '为什么冰是滑的', slug: 'why-ice-is-slippery', note: '压力化出一层水膜' }, { title: '声音是怎么跑到你耳朵里的', slug: 'sound-travels', note: '声音是一种波' }, { title: '电梯启动时，为什么觉得变轻了', slug: 'elevator-weightless', note: '失重不是没有重力' }, { title: '为什么船能浮起来', slug: 'why-ships-float', note: '排开的水比船还重' }]
      },
      {
        key: 'chemistry',
        name: '化学',
        icon: '🧪',
        summary: '原子如何牵手又分开，物质为什么会有这样的脾气。',
        articles: [{ title: '盐和糖，为什么长得像却不一样', slug: 'salt-and-sugar', note: '离子 vs 分子' }, { title: '切开的苹果为什么会变黑', slug: 'apple-turns-brown', note: '酶促褐变' }, { title: '铁为什么会生锈', slug: 'why-iron-rusts', note: '一场缓慢的燃烧' }, { title: '酸和碱，就在你家的厨房里', slug: 'acid-and-base', note: '中和与 pH' }, { title: '肥皂为什么能洗掉油', slug: 'how-soap-works', note: '一头亲水，一头亲油' }]
      },
      {
        key: 'earth-ecology',
        name: '地球与生态',
        icon: '🌍',
        summary: '板块、气候与生态系统：脚下这颗星球作为一个整体如何运行。',
        articles: [{ title: '一块石头的一生', slug: 'life-of-a-rock', note: '岩浆、沉积、变质' }, { title: '海水一天涨两次，是谁在拉它', slug: 'tides', note: '月亮拉扯海水' }, { title: '为什么会有四季', slug: 'why-seasons', note: '地轴是斜的' }, { title: '水去哪儿了', slug: 'water-cycle', note: '同一批水一直在转圈' }, { title: '沙漠是怎么形成的', slug: 'why-deserts-form', note: '水到不了，也留不住' }]
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
    featured: { area: 'philosophy', slug: 'socrates', note: '一场关于「什么是好生活」的审判' },
    areas: [
      {
        key: 'history',
        name: '历史',
        icon: '🏺',
        summary: '文明如何兴起与转折，以及史料是怎么被读出来的。',
        articles: [{ title: '历史不是年份表', slug: 'not-a-timeline', note: '历史回答的是「人会怎么选」' }, { title: '一条河，怎么养出一个文明', slug: 'river-and-civilization', note: '洪水逼出了最早的协作' }, { title: '文字是怎么被发明出来的', slug: 'invention-of-writing', note: '先有账，后有诗' }, { title: '一场瘟疫，怎么改变了欧洲', slug: 'black-death', note: '灾难推动制度' }, { title: '五千年前的学校，在教什么', slug: 'tablet-schools', note: '学写字，就是学权力' }, { title: '郑和为什么没有继续航行', slug: 'zheng-he', note: '展示国威 vs 做生意' }, { title: '一本书，怎么变得便宜', slug: 'printing-press', note: '信息便宜了，权威就松动' }, { title: '工业革命为什么先从英国开始', slug: 'industrial-revolution', note: '技术+制度+市场' }]
      },
      {
        key: 'philosophy',
        name: '哲学',
        icon: '🕯️',
        summary: '关于存在、知识与善恶的追问，以及如何把话讲清楚。',
        articles: [{ title: '苏格拉底为什么甘愿赴死', slug: 'socrates' }, { title: '洞穴里的人', slug: 'the-cave', note: '你以为的真实，可能只是影子' }, { title: '我怎么知道我不是在做梦', slug: 'descartes-doubt', note: '我思故我在' }, { title: '一辆失控的电车，和你的选择', slug: 'trolley-problem', note: '两套原则在打架' }, { title: '你选的是你想要的吗', slug: 'free-will', note: '自由意志的争论' }]
      },
      {
        key: 'society-psychology',
        name: '社会与心理',
        icon: '🧩',
        summary: '从 2 岁宝宝的情绪，到人在群体里的变化：理解行为背后的心理机制。',
        articles: [{ title: '「谢谢」是什么意思？', slug: 'thank-you', note: '看见别人的付出' }, { title: '宝宝生气了，可以怎么做？', slug: 'baby-emotions', note: '2 岁情绪急救' }, { title: '第一印象为什么不可靠', slug: 'first-impression', note: '晕轮效应' }, { title: '为什么大家都这么说，你就信了', slug: 'conformity', note: '阿希实验' }, { title: '有人倒下，为什么没人帮忙', slug: 'bystander', note: '旁观者效应' }, { title: '你的记忆，每次回忆都在重写', slug: 'memory-reconstruct', note: '记忆是重建的' }]
      },
      {
        key: 'puberty',
        name: '青春期与性教育',
        icon: '🌼',
        summary: '身体的变化、情绪的起伏，以及什么叫「我的身体我做主」。',
        articles: [{ title: '身体开始变化时，你需要知道的事', slug: 'body-changes', note: '不是变坏了，是换系统' }],
      },
      {
        key: 'people',
        name: '人物',
        icon: '👤',
        summary: '科学家、思想家、艺术家，以及那些没有留下名字的人。',
        articles: [{ title: '张骞：一个人走了十三年', slug: 'zhang-qian', note: '一百多人出发，两个人回来' }, { title: '居里夫人：两次诺奖，和一本不能碰的笔记本', slug: 'marie-curie', note: '她是在做科学' }, { title: '李时珍：走出来的《本草纲目》', slug: 'li-shizhen', note: '尽信书，不如无书' }, { title: '图灵：一个人和一台机器', slug: 'turing', note: '图灵机与他的结局' }, { title: '达尔文：一趟航行，二十年沉默', slug: 'darwin', note: '勇气不只是敢说，也是敢等' }]
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
    featured: { area: 'english-fun', slug: 'why-i-capital', note: '一个标点级的小问题，牵出印刷史' },
    areas: [
      {
        key: 'english-fun',
        name: '趣味英语',
        icon: '🔤',
        summary: '词源、习语与发音里的冷知识，让英语变得好玩。',
        articles: [
          { title: '为什么英语里的 I 永远大写', slug: 'why-i-capital' },
          { title: '动物宝宝怎么叫？', slug: 'baby-animals' },
          { title: '为什么英语单词拼写这么怪', slug: 'why-english-spelling-is-weird', note: '长出来的，不是设计出来的' },
          { title: '英语里没有「您」', slug: 'no-formal-you', note: '英语的简单是历史砍出来的' },
          { title: '「下雨下猫下狗」是什么鬼', slug: 'idioms', note: '习语是冻结的场景' }
        ]
      },
      {
        key: 'literature',
        name: '文学赏析',
        icon: '📖',
        summary: '诗、小说与散文：读懂作者藏在字缝里的意思。',
        articles: [{ title: '诗读不懂也没关系', slug: 'how-to-read-poetry', note: '诗不是谜语' }, { title: '比喻为什么有用', slug: 'metaphor', note: '给抽象的东西一个形状' }, { title: '故事为什么要有冲突', slug: 'conflict', note: '没有「但是」，就没有故事' }, { title: '谁在讲故事', slug: 'point-of-view', note: '视角决定你信谁' }, { title: '伏笔：为什么回头才看懂', slug: 'foreshadowing', note: '不骗你，只是不提醒' }]
      },
      {
        key: 'math-thinking',
        name: '数学思维',
        icon: '🔢',
        summary: '不是算得快，而是想得清：证明、概率与建模。',
        articles: [{ title: '大和小，多和少', slug: 'big-and-small', note: '数学最早的样子是比较' }, { title: '为什么 0 很重要', slug: 'why-zero-matters', note: '一个改变一切的符号' }, { title: '抛十次硬币都是正面，正常吗', slug: 'probability-coin', note: '硬币没有记忆' }, { title: '负数乘负数，为什么得正', slug: 'negative-times-negative', note: '为了规则不打架' }, { title: '平均数为什么会骗人', slug: 'average-lies', note: '中位数更抗极端值' }]
      },
      {
        key: 'programming-ai',
        name: '编程与AI',
        icon: '🤖',
        summary: '让机器按你的想法工作，并理解它为什么会出错。',
        articles: [{ title: '电脑听不懂人话', slug: 'computers-dont-understand', note: '它只会四件事' }, { title: '什么是变量', slug: 'what-is-a-variable', note: '一个贴了名字的盒子' }, { title: '循环：让电脑做重复的事', slug: 'what-is-a-loop', note: '差一错误' }, { title: '为什么程序会有 bug', slug: 'why-programs-have-bugs', note: '它只会照做' }, { title: '训练 AI 是怎么回事', slug: 'how-ai-is-trained', note: '没有理解，只有调参' }]
      },
      {
        key: 'media-literacy',
        name: '媒介素养',
        icon: '📱',
        summary: '这条消息是真的吗？刷手机停不下来怎么办？学会和信息相处。',
        articles: [{ title: '为什么你停不下来', slug: 'why-you-cant-stop', note: '不是你没自制力' }, { title: '广告是怎么说服你的', slug: 'how-ads-persuade', note: '先制造缺口' }, { title: '算法怎么决定你看到什么', slug: 'how-algorithms-feed-you', note: '它只看你会不会停留' }, { title: '标题为什么总在骗你', slug: 'headlines', note: '情绪比事实更吸引点击' }, { title: '这条消息是真的吗', slug: 'fake-news', note: '四个动作筛掉假消息' }]
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
    featured: { area: 'music', slug: 'what-is-sound', note: '从空气振动到一首曲子' },
    areas: [
      {
        key: 'music',
        name: '音乐',
        icon: '🎵',
        summary: '声音如何变成音乐，以及怎么听出门道。',
        articles: [
          { title: '声音是怎么变成音乐的', slug: 'what-is-sound', note: '从空气振动到一首曲子' },
          { title: '小手拍拍：2岁宝宝手指操', slug: 'baby-finger-play' },
          { title: '为什么有的和弦好听', slug: 'why-chords-sound-good', note: '频率成简单比例' },
          { title: '为什么一首歌会卡在脑子里', slug: 'earworm', note: '耳虫：没唱完的旋律' },
          { title: '大调和小调', slug: 'major-and-minor', note: '差一个半音，情绪翻面' }
        ]
      },
      {
        key: 'visual-art',
        name: '视觉艺术',
        icon: '🖼️',
        summary: '绘画、摄影与看展：训练一双会看的眼睛。',
        articles: [{ title: '乱涂也是画画', slug: 'first-scribble', note: '别问「画的是什么」' }, { title: '透视：为什么远处的树变小', slug: 'perspective', note: '近大远小' }, { title: '为什么有的画让人觉得「安静」', slug: 'quiet-paintings', note: '颜色、留白与线条' }, { title: '为什么主体不放在正中间', slug: 'composition', note: '三分法' }, { title: '冷色和暖色', slug: 'warm-and-cool', note: '温度是假的，感受是真的' }]
      },
      {
        key: 'maker',
        name: '手工创客',
        icon: '🔨',
        summary: '木工、电子与 3D 打印，把想法做成能拿在手里的东西。',
        articles: [{ title: '一把剪刀能做什么', slug: 'one-scissors', note: '十分钟能做完三样' }, { title: '纸飞机为什么能飞', slug: 'paper-airplane', note: '升力与重心' }, { title: '用纸板做一个齿轮', slug: 'cardboard-gear', note: '把转动传下去' }, { title: '橡皮筋动力车', slug: 'rubber-band-car', note: '存进去，再放出来' }, { title: '纸杯电话', slug: 'cup-phone', note: '声音沿着线抖过去' }]
      },
      {
        key: 'design',
        name: '设计',
        icon: '✏️',
        summary: '版式、配色与产品思维：让信息好看又好用。',
        articles: [{ title: '为什么有些按钮你一眼就知道能点', slug: 'affordance', note: '形状就是说明书' }, { title: '为什么红色代表危险', slug: 'why-red-means-danger', note: '一部分本能，一部分习惯' }, { title: '字体在说话', slug: 'typography', note: '字本身有性格' }, { title: '留白不是浪费', slug: 'whitespace', note: '空白决定你看哪儿' }, { title: '为看不见的人设计', slug: 'accessibility', note: '无障碍对所有人都更好用' }]
      },
      {
        key: 'body-games',
        name: '身体游戏',
        icon: '🤸',
        summary: '跑跳、翻滚、平衡：大运动与感统训练，玩着就把身体练协调。',
        articles: [{ title: '跳一跳，蹲一蹲', slug: 'jump-and-squat', note: '跳，是在练平衡' }, { title: '为什么转圈会晕', slug: 'why-spinning-makes-you-dizzy', note: '耳朵里的水平仪' }, { title: '跳绳：最便宜的全身运动', slug: 'jump-rope', note: '手腕摇，不用手臂' }, { title: '平衡是怎么练出来的', slug: 'balance', note: '稳不是静止，是快速修正' }, { title: '抛接：手和眼睛的对话', slug: 'throw-and-catch', note: '看球，不要看手' }]
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
    featured: { area: 'safety-first-aid', slug: 'burns', note: '大多数人第一反应就是错的' },
    areas: [
      {
        key: 'safety-first-aid',
        name: '安全急救',
        icon: '🚑',
        summary: '烫伤、出血、窒息与心肺复苏：关键时刻的正确动作。',
        articles: [{ title: '烫伤后的第一件事是什么', slug: 'burns', note: '大多数人第一反应就是错的' }, { title: '噎住了：那三分钟能救命', slug: 'choking', note: '怎么判断、怎么救' }, { title: '触电、溺水、中暑：三个救命动作', slug: 'three-emergencies', note: '先保自己再救人' }, { title: '流鼻血，别仰头', slug: 'nosebleed', note: '低头、捏鼻、前倾' }, { title: '扭伤了，先冷敷还是热敷', slug: 'sprain', note: '前 48 小时冷敷' }]
      },
      {
        key: 'self-protection',
        name: '自我保护',
        icon: '🛡️',
        summary: '防走失、防欺凌、防触电：把「遇到危险怎么办」变成条件反射。',
        articles: [{ title: '三样东西不能碰', slug: 'three-things', note: '只教一个「停」字' }, { title: '走丢了怎么办', slug: 'getting-lost', note: '站住、找谁、说什么' }, { title: '陌生人说「你妈妈让我来接你」', slug: 'stranger-pickup', note: '一条铁律挡住大多数情况' }, { title: '家里的危险地图', slug: 'home-hazard-map', note: '与其说不要，不如改环境' }, { title: '独自在家，有人敲门', slug: 'home-alone', note: '任何人来都不开门' }, { title: '背心裤衩盖住的地方', slug: 'body-boundaries', note: '边界是双向的' }, { title: '网上认识的人，也是陌生人', slug: 'online-strangers', note: '不见面、不给信息、不转账' }]
      },
      {
        key: 'life-skills',
        name: '生活常识',
        icon: '🧰',
        summary: '收纳、家电、合同、办事流程，以及洗手刷牙这类日常习惯。',
        articles: [{ title: '洗手七步法（宝宝版）', slug: 'baby-wash-hands', note: '用七个表情记住七步' }, { title: '你的精力，一天只有这么多', slug: 'energy-budget' }, { title: '药不能乱吃', slug: 'medicine-safety', note: '四条规矩' }, { title: '保质期到底在说什么', slug: 'expiration-dates', note: '两个词，差别很大' }, { title: '着火了，烟比火更危险', slug: 'fire-escape', note: '低姿、关门、不坐电梯' }, { title: '冬天取暖，小心这个看不见的杀手', slug: 'heating-safety', note: '一氧化碳' }]
      },
      {
        key: 'financial-literacy',
        name: '财商启蒙',
        icon: '💰',
        summary: '记账、储蓄、复利与防骗，建立和钱的健康关系。',
        articles: [{ title: '钱是什么', slug: 'what-is-money', note: '一张大家都愿意相信的欠条' }, { title: '零花钱的三种花法', slug: 'pocket-money', note: '分三份，允许花错' }, { title: '存钱为什么会有利息', slug: 'interest', note: '钱的使用费' }, { title: '需要的和想要的', slug: 'needs-vs-wants', note: '想要撑不过三天' }, { title: '为什么同样的东西，价格会变', slug: 'why-prices-change', note: '供需较劲' }]
      },
      {
        key: 'cooking',
        name: '美食烹饪',
        icon: '🍳',
        summary: '刀工、火候与调味：先学会喂饱自己。',
        articles: [{ title: '煎东西时那股香味，是怎么来的', slug: 'why-frying-smells-good', note: '美拉德反应' }, { title: '切菜的手', slug: 'how-to-hold-a-knife', note: '先学放手，再学落刀' }, { title: '面团为什么会发起来', slug: 'why-dough-rises', note: '酵母在吃糖吐气' }, { title: '为什么汤要最后放盐', slug: 'why-salt-last', note: '盐可以加，不能减' }, { title: '为什么煮东西会溢出来', slug: 'why-pots-boil-over', note: '气泡撑着不肯破' }]
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
  summary: string,
  articles: Array<{ age: string; title: string; slug: string }>
  sections: Array<{
    key: string
    name: string
    icon: string
    summary: string,
    articles: Array<{ title: string; slug: string; note?: string }>
  }>
} = {
  key: 'parenting',
  name: '📚 父母的书架',
  summary: '按年龄分层的育儿实操笔记：不鸡娃，也不放任。',
  articles: [
    { age: '0–3 岁', title: '2岁宝宝总说“不”？这是自我意识的觉醒', slug: 'self-awareness-2yo' },
    { age: '0–3 岁', title: '「再吃一口」：吃饭为什么变成拉锯战', slug: 'mealtime-battles' },
    { age: '0–3 岁', title: '两岁还夜醒，正常吗？', slug: 'toddler-sleep' },
    { age: '0–3 岁', title: '打人、咬人、扔东西：他不是坏', slug: 'hitting-biting' },
    { age: '0–3 岁', title: '只会说几个词，要不要紧？', slug: 'language-burst' },
    { age: '0–3 岁', title: '屏幕：不是能不能看，是看完之后', slug: 'screen-time' },
    { age: '3–6 岁', title: '如何应对幼儿园的分离焦虑', slug: 'separation-anxiety' },
    { age: '3–6 岁', title: '孩子撒谎了？先别急着教育', slug: 'lies-and-imagination' },
    { age: '6–12 岁', title: '辅导作业不崩溃：培养内驱力的3个秘诀', slug: 'intrinsic-motivation' },
    { age: '青春期', title: '孩子突然关上了房门，父母该怎么办？', slug: 'closed-door' },
    { age: '父母自修', title: '育儿先育己：如何控制吼叫的冲动', slug: 'stop-yelling' },
    { age: '父母自修', title: '吼完之后，怎么收场', slug: 'repair-after-yelling' }
  ],
  sections: [
    {
      key: 'direction',
      name: '养育的方向',
      icon: '🧭',
      summary: '不解决具体问题，只谈长期方向：想养出什么样的人、什么比成绩重要、父母该站在哪儿。',
      articles: [
        { title: '你想养出一个什么样的人？', slug: 'what-kind-of-person' },
        { title: '比成绩更重要的五件事', slug: 'five-things-before-grades' },
        { title: '孩子是照着你的样子活的', slug: 'live-as-you-do' },
        { title: '不要替他挡掉所有困难', slug: 'let-them-struggle' },
        { title: '一年只定一个目标', slug: 'one-goal-a-year' }
      ,
        { title: '尊重孩子，是把他当成一个人', slug: 'respect-your-child' }
      ]
    },
    {
      key: 'phonics',
      name: '亲子英语发音小抄',
      icon: '🗣️',
      summary: '家长和孩子一起开口的发音小抄：点一下就能听标准读音，照着跟读。',
      articles: [{ title: '亲子英语词表 · 从识物开始', slug: 'parent-english-phonics' }]
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

/** `stars` → `/parenting/stars` */
export function parentingArticleLink(slug: string): string {
  return `/parenting/${slug}`
}

/** `phonics` + `xyz` → `/parenting/phonics/xyz`；不传 slug 时返回栏目首页 */
export function parentingSectionLink(sectionKey: string, slug?: string): string {
  return slug ? `/parenting/${sectionKey}/${slug}` : `/parenting/${sectionKey}/`
}

/** 全站主题总数，供首页文案使用 */
export const areaCount = wings.reduce((total, wing) => total + wing.areas.length, 0)

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
          link: parentingArticleLink(article.slug)
        })),
        ...parenting.sections.map((section) => ({
          text: `${section.icon} ${section.name}`,
          collapsed: false,
          items: [
            { text: '栏目介绍', link: parentingSectionLink(section.key) },
            ...section.articles.map((article) => ({
              text: article.title,
              link: parentingSectionLink(section.key, article.slug)
            }))
          ]
        })),
        { text: '🏷️ 标签索引', link: '/parenting/tags' }
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
