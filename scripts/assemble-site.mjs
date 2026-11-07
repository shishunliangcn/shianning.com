import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { SITE } from '../site.config.mjs'

/**
 * 把「大门」和「知识库」组装成最终发布目录 _site/。
 *
 *   _site/            大门（根路径）+ 域名 + 图标 + 404 + sitemap
 *   _site/notes/      VitePress 构建产物（路径由 SITE.base 推导）
 *
 * 域名、子路径都来自 site.config.mjs，脚本里不写死。
 */
const DIST = 'docs/.vitepress/dist'
const OUT = '_site'
const ORIGIN = SITE.origin
/** '/notes/' → '/notes' */
const BASE = SITE.base.replace(/\/$/, '')
/** '/notes' → 'notes' */
const SUBDIR = BASE.replace(/^\//, '')

const ROOT_FILES = [
  'index.html',
  'CNAME',
  'favicon.ico',
  '404.html',
  'robots.txt',
  // PWA：安装到主屏幕所需
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
]

for (const file of ROOT_FILES) {
  if (!existsSync(file)) {
    console.error(`[assemble] 缺少根目录文件：${file}`)
    process.exit(1)
  }
}

await rm(OUT, { recursive: true, force: true })
await mkdir(join(OUT, SUBDIR), { recursive: true })

for (const file of ROOT_FILES) {
  await cp(file, join(OUT, file))
}
await writeFile(join(OUT, '.nojekyll'), '')

// 门页的五个「门」由 curriculum 生成，避免手抄一份会过期的主题列表。
// 数据来自 VitePress 构建时导出的 gate-data.json（见 config.mts 的 buildEnd）。
const gateData = 'docs/.vitepress/gate-data.json'
if (existsSync(gateData)) {
  const doors = JSON.parse(await readFile(gateData, 'utf8'))
  const cards = doors.map((door) => {
    const lines = []
    for (let i = 0; i < door.areas.length; i += 3) {
      lines.push(door.areas.slice(i, i + 3).join(' · '))
    }
    return [
      `      <a class="door" href="${BASE}/${door.key}/" style="--accent:${door.accent}">`,
      `        <span class="door__arch" aria-hidden="true"><span class="door__icon">${door.icon}</span></span>`,
      `        <span class="door__name">${door.name}</span>`,
      `        <span class="door__motto">${door.motto}</span>`,
      `        <span class="door__areas">${lines.join('<br />')}</span>`,
      '      </a>'
    ].join('\n')
  })

  const gateFile = join(OUT, 'index.html')
  const html = await readFile(gateFile, 'utf8')
  const rendered = html.replace(
    /<section class="doors"[\s\S]*?<\/section>/,
    `    <section class="doors" aria-label="选择展馆">\n${cards.join('\n\n')}\n    </section>`
  )

  if (rendered !== html) {
    await writeFile(gateFile, rendered)
    console.log(`[assemble] 门页已按课程数据生成 ${doors.length} 个展馆`)
  } else {
    console.warn('[assemble] 门页未找到 doors 区块，保持原样')
  }
} else {
  console.warn('[assemble] 缺少 gate-data.json，门页保持手写内容')
}

await cp(DIST, join(OUT, SUBDIR), { recursive: true })

// VitePress 生成的 sitemap 不带 base，复制到子路径下会变成一份错误清单；
// 删掉它，统一用根目录那份（已补 base 前缀并含主站首页）
await rm(join(OUT, SUBDIR, 'sitemap.xml'), { force: true })

// VitePress 的 sitemap 只覆盖 base 下的页面，但不会带 base 前缀；
// 这里统一补上，并把主站首页并进去
const sitemap = join(DIST, 'sitemap.xml')
if (existsSync(sitemap)) {
  const raw = await readFile(sitemap, 'utf8')
  const escapedOrigin = ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const locPattern = new RegExp(`<loc>${escapedOrigin}(\\/[^<]*)?<\\/loc>`, 'g')

  const withBase = raw.replace(
    locPattern,
    (_match, pagePath) => `<loc>${ORIGIN}${BASE}${pagePath ?? '/'}</loc>`
  )
  const home = `  <url><loc>${ORIGIN}/</loc><priority>1.0</priority></url>`
  const merged = withBase.replace('</urlset>', `${home}\n</urlset>`)

  // 图片 sitemap 的 lastmod：来自 git 提交时间（scripts/build-lastmod.mjs 产出）。
  // 没有这份映射时（例如没开 fetch-depth 的浅克隆）就跳过，不影响发布。
  const lastmodFile = join(DIST, '..', 'lastmod.json')
  let lastmod = {}
  if (existsSync(lastmodFile)) {
    try {
      lastmod = JSON.parse(await readFile(lastmodFile, 'utf8'))
    } catch {
      lastmod = {}
    }
  }

  /** 站点 URL → 仓库里的源文件路径 */
  function sourceFor(url) {
    const path = decodeURIComponent(url.replace(ORIGIN, ''))
    if (path === '' || path === '/') return 'index.html'
    const withoutBase = path.startsWith(BASE) ? path.slice(BASE.length) : path
    if (withoutBase === '' || withoutBase === '/') return 'docs/index.md'
    // 目录型 URL（/nature/）对应 docs/nature/index.md；文章型对应同名 .md
    const rel = withoutBase.replace(/^\//, '')
    const file = rel.endsWith('/') ? `${rel}index` : rel.replace(/\.html$/, '')
    return `docs/${file}.md`
  }

  let stamped = 0
  const withLastmod = merged.replace(/<loc>([^<]+)<\/loc>/g, (match, url) => {
    const date = lastmod[sourceFor(url)]
    if (!date) return match
    stamped++
    return `${match}<lastmod>${date}</lastmod>`
  })

  await writeFile(join(OUT, 'sitemap.xml'), withLastmod)
  console.log(`[assemble] sitemap.xml 已补 ${BASE} 前缀并并入主站首页，${stamped} 条带 lastmod`)
} else {
  console.warn('[assemble] 未找到 sitemap.xml，跳过')
}

console.log(`[assemble] 完成：${OUT}/`)
