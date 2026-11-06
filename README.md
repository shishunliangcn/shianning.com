# 史顺良的学习笔记

基于 [VitePress](https://vitepress.dev/) 搭建的个人知识库，部署在 **https://shianning.com/notes/**。

- 站点标题：史顺良的学习笔记
- 站点描述：记录与沉淀
- 主题：默认主题
- 语言：TypeScript（配置文件 `docs/.vitepress/config.mts`）
- 部署路径：`/notes/`（`base: '/notes/'`）

> 仓库根路径仍然是原来的个人主页 `index.html`，笔记站挂在 `/notes/` 下，两者互不影响。

## 目录结构

```
shianning.com/                 # GitHub 仓库
├─ index.html                  # 旧个人主页（根路径，保持原样）
├─ CNAME                       # 自定义域名 shianning.com
├─ docs/                       # 笔记站的 Markdown 源文件
│  ├─ index.md                 # 笔记站首页（hero + 特性卡片）
│  ├─ markdown-examples.md     # Markdown 扩展语法示例
│  ├─ api-examples.md          # 运行时 API 示例
│  └─ .vitepress/
│     ├─ config.mts            # 站点配置（base / 标题 / 导航 / 侧边栏）
│     ├─ cache/                # 开发缓存（自动生成，已忽略）
│     └─ dist/                 # 构建产物（自动生成，已忽略）
├─ .github/workflows/deploy.yml # 推送 main 自动部署到 GitHub Pages
├─ package.json
└─ README.md
```

## 常用命令

```bash
npm install            # 首次安装依赖
npm run docs:dev       # 本地预览 → http://localhost:5173/notes/
npm run docs:build     # 构建到 docs/.vitepress/dist
npm run docs:preview   # 预览构建产物
```

注意本地预览地址带 `/notes/` 前缀，这是 `base` 配置决定的。

## 写新笔记

1. 在 `docs/` 下新建 `.md`，例如 `docs/notes/vue-reactivity.md`。
2. 想让它在侧边栏出现，就在 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar` 里加一项：

   ```ts
   { text: 'Vue 响应式原理', link: '/notes/vue-reactivity' }
   ```

   链接写站内绝对路径即可，`base` 会自动加上 `/notes/` 前缀。

3. 保存后自动热更新。

## 自动部署

推送代码到 `main` 分支即触发 `.github/workflows/deploy.yml`：

1. `npm ci` 安装依赖 → `npm run docs:build` 构建
2. 组装 `_site/`：根路径放旧 `index.html` + `CNAME`，笔记站放进 `_site/notes/`
3. 通过 GitHub Pages Actions 发布到 `shianning.com`

仓库 **Settings → Pages → Source** 必须是 **GitHub Actions**（不是 Deploy from a branch），否则工作流部署会失败。

## 域名

- `shianning.com`（apex）应只保留 GitHub Pages 的 A 记录：`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
- `www.shianning.com` 用 CNAME 指向 `shishunliangcn.github.io`

如果 apex 上还留着指向其他服务器的 A 记录（例如华为云的 IP），部分地区的访问会被解析到那些服务器，表现为时好时坏，建议清理。
