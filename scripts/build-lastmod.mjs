import { writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

/**
 * 生成「文件 → 最后一次提交时间」映射，供 sitemap 的 <lastmod> 使用。
 *
 * 为什么不用构建时间：每次部署所有页面都会被标成「今天改过」，
 * 搜索引擎会把这种信号当噪音。用 git 的提交时间才是真实的更新时间。
 *
 * 需要完整的 git 历史（CI 里 checkout 要开 fetch-depth: 0）。
 * 拿不到 git 时安静跳过，assemble 会退化成不写 lastmod。
 */
const OUT = 'docs/.vitepress/lastmod.json'

try {
  const log = execFileSync('git', ['log', '--format=%x01%cI', '--name-only'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  })

  /** @type {Record<string, string>} */
  const map = {}
  // git log 由新到旧：某个文件第一次出现，就是它最近一次被改动的时间
  for (const chunk of log.split('\x01').slice(1)) {
    const [dateLine, ...fileLines] = chunk.split('\n')
    const date = dateLine.trim()
    if (!date) continue
    for (const line of fileLines) {
      const file = line.trim()
      if (!file || map[file]) continue
      map[file] = date
    }
  }

  await writeFile(OUT, JSON.stringify(map))
  console.log(`[lastmod] 记录 ${Object.keys(map).length} 个文件`)
} catch (error) {
  console.warn(`[lastmod] 跳过（${error.message.split('\n')[0]}）`)
}
