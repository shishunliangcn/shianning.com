# 史安宁的小学堂

从启蒙到大学，经得起时间考验的线上学园。基于 [VitePress](https://vitepress.dev/) 搭建，
部署在 **https://shianning.com/notes/**，根路径 https://shianning.com/ 是学校大门。

- 学段：启蒙乐园 / 小学课堂 / 中学冲刺 / 大学殿堂
- 学科：共 29 门，按学段分为 5 / 8 / 10 / 6 科（全人教育蓝图）
- 主题：默认主题 + 自定义主题层（`docs/.vitepress/theme`）

## 架构

```
shianning.com/
├─ index.html                    # 学校大门（根路径，纯静态）
├─ CNAME                         # 自定义域名 shianning.com
├─ docs/                         # VitePress 站点，挂载在 /notes/
│  ├─ index.md                   # 知识库全图（hero + <KnowledgeMap />）
│  ├─ preschool/                 # 启蒙乐园（5 科）
│  │  ├─ index.md                #   学段概况
│  │  └─ {health-life,language,nature,art,society}/index.md
│  ├─ primary/                   # 小学课堂（8 科）
│  │  └─ {chinese,math,english,science,humanities,pe-health,art,it}/
│  ├─ middle/                    # 中学冲刺（10 科）
│  │  └─ {chinese,math,english,physics,chemistry,biology,history,geography,politics,pe-health}/
│  ├─ university/                # 大学殿堂（6 科）
│  │  └─ {general-education,advanced-math,computer-basics,econ-management,psychology,career-planning}/
│  ├─ public/audio/              # 站点静态资源（音频等）
│  └─ .vitepress/
│     ├─ config.mts              # 站点配置（base、导航、主页文案）
│     ├─ curriculum.ts           # ★ 课程树：全站唯一数据源
│     └─ theme/
│        ├─ index.ts             # 主题入口，全局注册组件
│        ├─ components/          # ReadWord / AudioPlayer / KnowledgeMap
│        └─ styles/index.css     # 设计变量与组件样式
├─ .github/workflows/deploy.yml   # 推送 main 自动构建发布
└─ package.json
```

### 单一数据源：`curriculum.ts`

`docs/.vitepress/curriculum.ts` 用 TypeScript 描述整棵课程树（学段 → 学科 → 文章）。
下面这些地方全部由它派生，**不需要分别维护**：

- 顶部导航的「学段」下拉菜单
- 每个学段的四级嵌套侧边栏
- 主页「知识库全图」的卡片与学科链接

新增一个学科，只需要在 `curriculum.ts` 里加一项，再建好对应目录和 `index.md`。

## 全局组件

在 `docs/.vitepress/theme/index.ts` 里注册，Markdown 中直接使用，无需 import。

### `<ReadWord>` —— 单词朗读

```md
Apple <ReadWord word="apple" /> 是「苹果」。

<ReadWord word="banana">banana</ReadWord>

<ReadWord word="Good morning" :rate="0.6" />
<ReadWord word="你好" lang="zh-CN" />
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `word` | string | 必填 | 要朗读的文本 |
| `lang` | string | `en-US` | 语音语言 |
| `rate` | number | `0.9` | 语速 |
| `pitch` | number | `1` | 音高 |
| `label` | string | `朗读 <word>` | 无障碍标签 |

基于浏览器 Web Speech API，不支持时按钮点击无响应（不会报错）。

### `<AudioPlayer>` —— 音频播放器

```md
<AudioPlayer src="/audio/tone-440.wav" caption="示例音频" />
```

以 `/` 开头的路径会自动补上 `/notes/` 前缀，音频文件放 `docs/public/audio/`。

完整演示见 [朗读组件演示](/notes/primary/english/demo)。

## 常用命令

```bash
npm install            # 首次安装
npm run docs:dev       # 本地预览 → http://localhost:5173/notes/
npm run docs:build     # 构建到 docs/.vitepress/dist
npm run docs:preview   # 预览构建产物
```

## 写一篇新文章

1. 在对应学科目录下新建 `.md`，例如 `docs/primary/english/greetings.md`。
2. 在 `curriculum.ts` 里把文章挂到该学科的 `pages`：

   ```ts
   {
     key: 'english',
     ...subjectMeta.english,
     summary: '自然拼读加高频词，从听懂到敢开口。',
     pages: [
       { text: '朗读组件演示', slug: 'demo' },
       { text: '日常问候', slug: 'greetings' }   // ← 新增
     ]
   }
   ```

3. 侧边栏会自动出现这一条，保存即热更新。

## 自动部署

推送 `main` 触发 `.github/workflows/deploy.yml`：

1. `npm ci` → `npm run docs:build`（Vue 组件由 Vite 编译）
2. 检查构建产物（首页、学段页、演示页是否存在）
3. 组装 `_site/`：根路径放 `index.html` + `CNAME`，笔记站放进 `_site/notes/`
4. GitHub Pages Actions 发布

仓库 **Settings → Pages → Source** 必须是 **GitHub Actions**。

## 域名

- apex `shianning.com` 建议只保留 GitHub Pages 的 A 记录：`185.199.108.153`、`.109.153`、`.110.153`、`.111.153`
- `www` 用 CNAME 指向 `shishunliangcn.github.io`

若 apex 上还有指向其他服务器的 A 记录（如华为云 IP），会导致部分地区解析异常。
