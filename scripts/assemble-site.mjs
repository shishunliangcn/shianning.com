import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 把「大门」和「知识库」组装成最终发布目录 _site/。
 *
 *   _site/            大门（根路径）+ 域名 + 图标 + 404 + sitemap
 *   _site/notes/      VitePress 构建产物
 *
 * 之所以用脚本而不是一串 cp：文件清单集中在一处，
 * 以后加根路径文件（如 robots.txt）只改这里。
 */
const DIST = 'docs/.vitepress/dist'
const OUT = '_site'
const ROOT_FILES = [
  'index.html',
  'CNAME',
  'favicon.ico',
  '404.html',
  // PWA：安装到主屏幕所需
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
]
const SITE_ORIGIN = 'https://shianning.com'

for (const file of ROOT_FILES) {
  if (!existsSync(file)) {
    console.error(`[assemble] 缺少根目录文件：${file}`)
    process.exit(1)
  }
}

await rm(OUT, { recursive: true, force: true })
await mkdir(join(OUT, 'notes'), { recursive: true })

for (const file of ROOT_FILES) {
  await cp(file, join(OUT, file))
}
await writeFile(join(OUT, '.nojekyll'), '')

await cp(DIST, join(OUT, 'notes'), { recursive: true })

// VitePress 生成的 sitemap 不带 base，复制到 /notes/ 下会变成一份错误清单；
// 删掉它，统一用根目录那份（已补 /notes 前缀并含主站首页）
await rm(join(OUT, 'notes', 'sitemap.xml'), { force: true })

// VitePress 的 sitemap 只覆盖 base 下的页面，但不会带 base 前缀；
// 这里统一补上 /notes，并把主站首页并进去
const sitemap = join(DIST, 'sitemap.xml')
if (existsSync(sitemap)) {
  const raw = await readFile(sitemap, 'utf8')
  const withBase = raw.replace(
    /<loc>https:\/\/shianning\.com(\/[^<]*)?<\/loc>/g,
    (_match, pagePath) => `<loc>${SITE_ORIGIN}/notes${pagePath ?? '/'}</loc>`
  )
  const home = `  <url><loc>${SITE_ORIGIN}/</loc><priority>1.0</priority></url>`
  const merged = withBase.replace('</urlset>', `${home}\n</urlset>`)
  await writeFile(join(OUT, 'sitemap.xml'), merged)
  console.log('[assemble] sitemap.xml 已补 /notes 前缀并并入主站首页')
} else {
  console.warn('[assemble] 未找到 sitemap.xml，跳过')
}

console.log(`[assemble] 完成：${OUT}/`)
