<script setup lang="ts">
import { withBase } from 'vitepress'
import { areaCount, areaLink, wingLink, wings } from '../../curriculum'

/**
 * KnowledgeMap —— 知识库全图
 *
 * 直接读取 curriculum.ts：展馆与主题数量都是实时统计，
 * 新增展馆或主题后自动出现，数量也是实时统计的。
 */
</script>

<template>
  <section class="km">
    <p class="km__meta">
      共 <strong>{{ wings.length }}</strong> 座展馆 ·
      <strong>{{ areaCount }}</strong> 个主题 · 没有年级，也没有边界
    </p>

    <div class="km__grid">
      <article
        v-for="wing in wings"
        :key="wing.key"
        class="km-card"
        :style="{ '--km-accent': wing.accent }"
      >
        <header class="km-card__head">
          <span class="km-card__icon" aria-hidden="true">{{ wing.icon }}</span>
          <div class="km-card__heading">
            <h2 class="km-card__title">
              <a :href="withBase(wingLink(wing))">{{ wing.name }}</a>
            </h2>
            <p class="km-card__age">{{ wing.motto }} · {{ wing.areas.length }} 个主题</p>
          </div>
        </header>

        <p class="km-card__summary">{{ wing.summary }}</p>

        <ul class="km-card__subjects">
          <li v-for="area in wing.areas" :key="area.key">
            <a class="km-chip" :href="withBase(areaLink(wing, area))">
              <span aria-hidden="true">{{ area.icon }}</span>{{ area.name }}
            </a>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
