<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

import { data as articles } from '../../tags.data'
import { AGE_TAGS, EXTRA_TAGS, THEME_GROUPS, tagAnchor } from '../../tags'
import { usePageContext } from '../composables/usePageContext'

/**
 * TagIndex —— 某个板块的标签索引。
 *
 * 结构是「目录 + 详情」：
 *   1. 顶部筛选框，输入即筛（纯前端，不需要分页）
 *   2. 目录区：按年龄 / 按主题（按展馆分组）/ 其他，点胶囊跳到详情
 *   3. 详情区：每个标签下的文章列表
 *
 * 渲染哪些文章完全由页面上下文决定：展馆页只列 exhibition，书架页只列 parenting。
 * 标签本身是受控词表（见 tags.ts），数量有界，永远不需要翻页。
 */
const ctx = usePageContext()
const keyword = ref('')

const scoped = computed(() => articles.filter((article) => article.section === ctx.value.kind))

/** 标签 → 文章列表 */
const byTag = computed(() => {
  const map = new Map<string, typeof articles>()
  for (const article of scoped.value) {
    for (const tag of article.tags) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag)!.push(article)
    }
  }
  return map
})

const countOf = (tag: string) => byTag.value.get(tag)?.length ?? 0

function matched(tag: string): boolean {
  const kw = keyword.value.trim()
  return !kw || tag.includes(kw)
}

function chips(tags: readonly string[]) {
  return tags.filter(matched).map((tag) => ({ tag, count: countOf(tag) }))
}

const ageChips = computed(() => chips(AGE_TAGS))
const extraChips = computed(() => chips(EXTRA_TAGS))
const themeGroups = computed(() =>
  THEME_GROUPS.map((group) => ({ ...group, chips: chips(group.tags) })).filter(
    (group) => group.chips.length > 0
  )
)
const hasThemes = computed(() => themeGroups.value.some((group) => group.chips.some((c) => c.count > 0)))

const groups = computed(() =>
  [...byTag.value.entries()]
    .filter(([tag]) => matched(tag))
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-Hans-CN'))
)
</script>

<template>
  <div v-if="ctx.ui.tagIndex" class="tag-index">
    <div class="tag-index__toolbar">
      <input
        v-model="keyword"
        class="tag-index__search"
        type="search"
        placeholder="筛选标签，例如「天文」"
        aria-label="筛选标签"
      />
      <span class="tag-index__summary">
        {{ scoped.length }} 篇文章 · {{ byTag.size }} 个标签
      </span>
    </div>

    <template v-if="ageChips.length">
      <h2 class="tag-dir__title">按年龄</h2>
      <div class="tag-dir__chips">
        <template v-for="chip in ageChips" :key="chip.tag">
          <a v-if="chip.count" class="tag-chip" :href="'#' + tagAnchor(chip.tag)">
            {{ chip.tag }}<span class="tag-chip__n">{{ chip.count }}</span>
          </a>
          <span v-else class="tag-chip is-empty">{{ chip.tag }}</span>
        </template>
      </div>
    </template>

    <template v-if="hasThemes">
      <h2 class="tag-dir__title">按主题</h2>
      <div class="tag-dir">
        <div v-for="group in themeGroups" :key="group.name" class="tag-dir__row">
          <span class="tag-dir__wing">{{ group.icon }} {{ group.name }}</span>
          <div class="tag-dir__chips">
            <template v-for="chip in group.chips" :key="chip.tag">
              <a v-if="chip.count" class="tag-chip" :href="'#' + tagAnchor(chip.tag)">
                {{ chip.tag }}<span class="tag-chip__n">{{ chip.count }}</span>
              </a>
              <span v-else class="tag-chip is-empty">{{ chip.tag }}</span>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-if="extraChips.some((chip) => chip.count)">
      <h2 class="tag-dir__title">其他</h2>
      <div class="tag-dir__chips">
        <template v-for="chip in extraChips" :key="chip.tag">
          <a v-if="chip.count" class="tag-chip" :href="'#' + tagAnchor(chip.tag)">
            {{ chip.tag }}<span class="tag-chip__n">{{ chip.count }}</span>
          </a>
          <span v-else class="tag-chip is-empty">{{ chip.tag }}</span>
        </template>
      </div>
    </template>

    <h2 class="tag-dir__title">全部标签</h2>

    <p v-if="!groups.length" class="tag-index__empty">没有匹配的标签。</p>

    <section
      v-for="[tag, list] in groups"
      :key="tag"
      class="tag-index__group"
      :id="tagAnchor(tag)"
    >
      <h3 class="tag-index__name">
        {{ tag }} <span class="tag-index__count">{{ list.length }} 篇</span>
      </h3>
      <ul class="tag-index__list">
        <li v-for="article in list" :key="article.url">
          <a :href="withBase(article.url)">{{ article.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>
