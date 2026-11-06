# 史安宁的小学堂

> 跨越年龄的边界，探索知识的无限可能。

一座没有学段、没有年级的知识殿堂。基于 [VitePress](https://vitepress.dev/) 搭建，
根路径 https://shianning.com/ 是五扇大门，知识库部署在 **https://shianning.com/notes/**。

## 五大展馆

| 展馆 | 主题 |
| --- | --- |
| 🌌 格物馆（探索宇宙与自然） | 天文 · 自然观察 · 趣味实验 · 物理 · 化学 · 地球与生态 |
| 📜 知音馆（穿梭历史与人文） | 历史 · 哲学 · 社会与心理 · 青春期与性教育 · 人物 |
| 🧠 灵犀馆（语言与逻辑魔法） | 趣味英语 · 文学赏析 · 数学思维 · 编程与AI · 媒介素养 |
| 🎨 造物馆（艺术、动手与创想） | 音乐 · 视觉艺术 · 手工创客 · 设计 · 身体游戏 |
| 🛠️ 长生馆（生活、生存与实用技能） | 安全急救 · 自我保护 · 生活常识 · 财商启蒙 · 美食烹饪 |

共 5 座展馆、26 个主题。另有独立的「📚 父母的书架」（5 篇育儿实操笔记），
**不放进顶部导航，也不进侧边栏**：只在首页页脚留一个极弱的文字链接，并由低幼文章自然互链。

每个主题**不绑定年龄**——年龄是文章的属性，不是主题的属性。
文章用四个年龄标签做寻路：`#2-6岁`、`#6-12岁`、`#12-18岁`、`#18岁+`。
入口放在**知识库首页**的「按年龄找内容」板块（`AgeGuide` 组件，篇数实时统计），
主题页顶部也有同样的四个筛选入口；主站大门只负责进门，不再承担年龄导航。

选题规划（主题 × 年龄段的交叉矩阵）见 [交叉矩阵 · 动态生长指南](</docs/CONTENT_MAP.md>)。

## PWA（添加到主屏幕）

站点可安装为全屏应用：

- `manifest.webmanifest`（`start_url: /notes/`、`display: standalone`）
- 图标：`icon-192.png`、`icon-512.png`、`apple-touch-icon.png`
- `sw.js`：**network-only** 的 Service Worker，只为满足安装条件，不做任何缓存，避免内容过期
- VitePress 页面与大门都注册了 SW，并带 iOS 的 `apple-mobile-web-app-*` meta

## 架构

```
shianning.com/
├─ index.html                    # 五扇大门（根路径，纯静态）
├─ CNAME                         # 自定义域名 shianning.com
├─ docs/                         # VitePress 站点，挂载在 /notes/
│  ├─ index.md                   # 知识库全图（hero + <KnowledgeMap />）
│  ├─ tags.md                    # 标签索引（由 tags.data.ts 汇总）
│  ├─ nature/                    # 🌌 格物馆
│  │  ├─ index.md                #   展馆导言
│  │  └─ astronomy/              #   🔭 天文
│  │     ├─ index.md             #     主题简介
│  │     └─ stars.md             #     《星星为什么会发光》
│  ├─ humanities/ logic/ arts/ life/   # 其余四馆，结构相同
│  ├─ parenting/                 # 📚 父母的书架（独立模块，不进导航）
│  ├─ public/audio/              # 站点静态资源（音频）
│  └─ .vitepress/
│     ├─ config.mts              # 站点配置（base、导航）
│     ├─ curriculum.ts           # ★ 展馆树：全站唯一数据源
│     ├─ tags.data.ts            # 标签聚合（内容加载器）
│     └─ theme/
│        ├─ index.ts             # 主题入口，注册全局组件
│        ├─ Layout.vue           # 在 doc-before 插入标签栏
│        ├─ components/          # ReadWord / AudioPlayer / KnowledgeMap / ArticleTags
│        ├─ composables/         # useSpeechSynthesis（移动端朗读）
│        └─ styles/index.css     # 设计变量与组件样式
├─ .github/workflows/deploy.yml   # 推送 main 自动构建发布
└─ package.json
```

### 单一数据源：`curriculum.ts`

`docs/.vitepress/curriculum.ts` 用 TypeScript 描述整棵树（展馆 → 主题 → 文章）。
下列内容全部由它派生，**不需要分别维护**：

- 顶部导航的「展馆」下拉菜单
- 每个展馆的多级嵌套侧边栏
- 知识库全图的卡片、主题胶囊与「5 座展馆 / 20 个主题」的统计数字

### 标签系统

文章 frontmatter 里写 `tags`，三处自动生效：
```md
---
title: 星星为什么会发光
tags: [天文, 恒星, 光谱, 物理]
---
```

1. 文章页标题上方渲染标签胶囊（`ArticleTags` 组件，挂在 `Layout.vue` 的 `doc-before` 插槽）
2. 标签胶囊点击跳到 `/notes/tags.html` 对应的锚点
3. `tags.md` 通过 `tags.data.ts`（VitePress 内容加载器）自动汇总全站标签，无需手写列表

### 📚 父母的书架（独立模块）

刻意不放进五大展馆、顶部导航和侧边栏。入口只有两处：

1. 首页（大门）页脚的一行极弱文字链接
2. 合适的低幼文章末尾自然互链（如《动物宝宝怎么叫？》）

文章清单维护在 `curriculum.ts` 的 `parenting.articles` 里，
新增一篇只需建 `docs/parenting/<slug>.md`，再往数组里加一条 `{ age, title, slug }`。

## 站内搜索

`themeConfig.search.provider = 'local'`，构建时生成索引（`@localSearchIndexroot.*.js`），
不依赖任何外部服务。界面文案已中文化。

## 全局组件

在 `docs/.vitepress/theme/index.ts` 里注册，Markdown 中直接使用。

### `<ReadWord>` —— 单词朗读

```md
Apple <ReadWord word="apple" /> 是「苹果」。
<ReadWord word="banana">banana</ReadWord>
<ReadWord word="Good morning" :rate="0.6" />
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `word` | string | 必填 | 要朗读的文本 |
| `lang` | string | `en-US` | 语音语言 |
| `rate` | number | `0.9` | 语速 |
| `pitch` | number | `1` | 音高 |

朗读逻辑在 `theme/composables/useSpeechSynthesis.ts`：

- `speak()` 在点击事件中**同步**调用，满足 iOS 的用户手势要求；
- 语音列表通过 `voiceschanged` + 500ms × 8 次轮询预热，但**不阻塞**朗读；
- 朗读前 `resume()` 解除暂停、`cancel()` 清空队列，并显式设置 `utterance.lang`；
- 1.2 秒内没有开始播放则判定失败，按钮变红提示，再点一次即可重试；
- 4 秒内拿不到语音列表（华为 / 鸿蒙的 ArkWeb 常见）则判定为「能力不可用」，
  按钮不再变红，旁边直接显示一行「华为/鸿蒙浏览器暂不支持发音，请换用 Chrome」。

### `<AudioPlayer>` —— 音频播放器

```md
<AudioPlayer src="/audio/tone-440.wav" caption="440 Hz 标准音 A" />
```

以 `/` 开头的路径会自动补上 `/notes/` 前缀，音频文件放 `docs/public/audio/`。

## 常用命令

```bash
npm install            # 首次安装
npm run docs:dev       # 本地预览 → http://localhost:5173/notes/
npm run docs:build     # 构建到 docs/.vitepress/dist
npm run docs:preview   # 预览构建产物
```

## 写一篇新文章

1. 在对应主题目录下新建 `.md`，例如 `docs/nature/physics/why-sky-blue.md`。
2. frontmatter 写上 `title` 与 `tags`。
3. 在 `curriculum.ts` 里把这篇文章挂到该主题的 `articles`：

   ```ts
   {
     key: 'physics',
     name: '物理',
     icon: '⚛️',
     summary: '力、能量、电磁与时空：用最少的规律解释最多的现象。',
     articles: [{ title: '天为什么是蓝的', slug: 'why-sky-blue' }]   // ← 新增
   }
   ```

4. 侧边栏与标签索引都会自动更新，保存即热更新。

## 页面上下文与 UI 隔离

全站的「哪一页该出现哪个组件」由 [`docs/.vitepress/page-context.ts`](docs/.vitepress/page-context.ts) 统一裁决，
组件不允许自己判断路径。

```
路径 ──► resolvePageContext() ──► PageContext { kind, role, ui.* }
                                        │
                                        └─► 组件只读 ctx.ui.ageHint / themeTable / pager / tags
```

- **板块（SectionKind）**：`exhibition`（五大展馆）、`parenting`（父母的书架）、`system`（首页/标签等）
- **能力表（CAPABILITIES）**：每个板块声明自己允许挂载哪些 UI，默认全关
- **角色收窄**：即使板块允许，也只有特定角色能拿到，例如 `ageHint` 只在展馆的「主题简介」页为 true
- **构建防线**：不属于任何板块的页面会让 `npm run docs:build` **直接失败**，不会悄悄继承别人的 UI

新增板块时只需两步：在 `SectionKind` 加一个值、在 `CAPABILITIES` 登记能力。
新增页面时若不登记，CI 会拦下并提示在 `curriculum.ts` 里补登记。

推送 `main` 触发 `.github/workflows/deploy.yml`（GitHub 官方 Pages 流程）：

1. `npm ci` → `npm run docs:build`
2. 目录级校验构建产物
3. `node scripts/assemble-site.mjs` 组装 `_site/`（大门在根路径，知识库在 `/notes/`）
4. `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`

仓库 **Settings → Pages → Source** 必须是 **GitHub Actions**。

### 部署卡死的处理

Pages 的部署接口偶发「僵尸部署」：某次部署一直停在 in progress，
后续部署会报 `due to in progress deployment` 或一直轮询直到超时。

应对方式（按顺序）：

1. 取消阻塞的部署记录：`POST /repos/{owner}/{repo}/pages/deployments/{sha}/cancel`
2. 取消卡住的运行：`POST /repos/{owner}/{repo}/actions/runs/{id}/cancel`
3. 重新推送或用 `workflow_dispatch` 触发

工作流已加 `timeout-minutes: 10`，卡死的运行会快速失败而不是长期占住并发锁。

## 域名

- apex `shianning.com` 建议只保留 GitHub Pages 的 A 记录：`185.199.108.153`、`.109.153`、`.110.153`、`.111.153`
- `www` 用 CNAME 指向 `shishunliangcn.github.io`

若 apex 上还有指向其他服务器的 A 记录（如华为云 IP），会导致部分地区解析异常。
