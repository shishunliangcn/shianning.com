/**
 * 站点元信息 —— 唯一来源。
 *
 * VitePress 配置（docs/.vitepress/config.mts）与发布脚本（scripts/assemble-site.mjs）
 * 都从这里读取，改域名 / 改路径只需要动这一个文件。
 *
 * 为什么放在仓库根、用 .mjs：CI 里运行的是 Node 20，
 * 它不能直接 import TS；而 VitePress 配置本身可以 import .mjs。
 */
export const SITE = {
  /** 站点主域名（不带结尾斜杠） */
  origin: 'https://shianning.com',
  /** VitePress 的部署子路径，必须以 / 开头并以 / 结尾 */
  base: '/notes/',
  title: '史安宁的小学堂',
  /** 主屏图标下的短名称 */
  shortTitle: '小学堂',
  description: '跨越年龄的边界，探索知识的无限可能。',
  /** 知识库每页页脚的一句话（与品牌标语区分开，避免同一句话反复出现） */
  footerMessage: '陪孩子一起，把世界问个明白。',
  lang: 'zh-CN',
  /** GitHub 仓库（owner/repo），用于「在 GitHub 上编辑此页」 */
  repo: 'shishunliangcn/shianning.com',
  branch: 'main',
  /** 社交分享与 PWA 共用的大图标 */
  icon: { path: '/icon-512.png', size: 512 }
}

/** 拼出站点的绝对地址，例如 siteUrl('/icon-512.png') */
export function siteUrl(path = '/') {
  return `${SITE.origin}${path}`
}
