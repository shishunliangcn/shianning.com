<script setup lang="ts">
import { withBase } from 'vitepress'
import { stages } from '../../curriculum'

/**
 * KnowledgeMap —— 知识库全图
 *
 * 直接读取 curriculum.ts，新增学段/学科后自动出现，无需改这个组件。
 */
</script>

<template>
  <section class="km">
    <div class="km__grid">
      <article
        v-for="stage in stages"
        :key="stage.key"
        class="km-card"
        :style="{ '--km-accent': stage.accent }"
      >
        <header class="km-card__head">
          <span class="km-card__icon" aria-hidden="true">{{ stage.icon }}</span>
          <div class="km-card__heading">
            <h2 class="km-card__title">
              <a :href="withBase(`/${stage.key}/`)">{{ stage.name }}</a>
            </h2>
            <p class="km-card__age">{{ stage.age }}</p>
          </div>
        </header>

        <p class="km-card__summary">{{ stage.summary }}</p>

        <ul class="km-card__subjects">
          <li v-for="subject in stage.subjects" :key="subject.key">
            <a class="km-chip" :href="withBase(`/${stage.key}/${subject.key}/`)">
              <span aria-hidden="true">{{ subject.icon }}</span>{{ subject.name }}
            </a>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
