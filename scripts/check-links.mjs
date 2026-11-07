import { readdir, readFile } from 'node:fs/promises'
import { join, posix } from 'node:path'

/**
 * 站内死链检查 —— CI 门禁。
 *
 * 检查 _site 里每个 HTML 的站内 href/src 是否指向真实存在的文件。
 * 文章改名、目录调整、组件写错路径都会在这里被拦下，
 * 而不是等读者点到一个 404。
 *
 * 用法：node scripts/check-links.mjs [siteDir]
 */
const site = process.argv[2] ?? '_site'

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = await walk(site)
const exists = new Set(files.map((f) => f.split('\\').join('/')))
const htmls = files.filter((f) => f.endsWith('.html'))

const missing = []
const seen = new Set()

for (const file of htmls) {
  const rel = file.split('\\').join('/').slice(site.length + 1)
  // 去掉内联的站点数据，避免把 JSON 里的字符串当成链接
  const html = (await readFile(file, 'utf8')).replace(/<script[\s\S]*?<\/script>/g, '')

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1]
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/.test(raw)) continue

    const clean = raw.split('#')[0].split('?')[0]
    if (!clean) continue

    let target = clean.startsWith('/')
      ? `${site}${clean}`
      : posix.join(posix.dirname(`${site}/${rel}`), clean)
    target = posix.normalize(target)

    if (target.endsWith('/')) target += 'index.html'
    else if (!/\.[a-z0-9]+$/i.test(target)) target += '.html'

    const key = `${rel} -> ${target}`
    if (seen.has(key)) continue
    seen.add(key)
    if (!exists.has(target)) missing.push(`${rel} → ${raw}`)
  }
}

console.log(`[links] 页面 ${htmls.length}，链接 ${seen.size}，死链 ${missing.length}`)

if (missing.length > 0) {
  missing.slice(0, 20).forEach((item) => console.error('  ' + item))
  process.exit(1)
}
