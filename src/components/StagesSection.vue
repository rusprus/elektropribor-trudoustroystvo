<template>
  <section class="section" id="route">
    <header class="section-head">
      <span class="section-index">01</span>
      <div>
        <h2>Маршрут трудоустройства</h2>
        <p>Пять шагов. Пока идёт согласование, с текущего места работы не увольняйтесь.</p>
      </div>
    </header>

    <ol class="route" aria-label="Этапы трудоустройства">
      <li v-for="stage in stages" :key="stage.id">
        <button
          type="button"
          :class="{ active: stage.id === activeId }"
          :aria-pressed="stage.id === activeId"
          @click="activeId = stage.id"
        >
          <span class="route-index">{{ stage.index }}</span>
          <span class="route-title">{{ stage.title }}</span>
          <span class="route-short">{{ stage.short }}</span>
        </button>
      </li>
    </ol>

    <article class="stage-panel" :aria-live="'polite'">
      <p class="stage-kicker">Шаг {{ active.index }}</p>
      <h3>{{ active.title }}</h3>
      <p>{{ active.lead }}</p>
      <ul>
        <li v-for="action in active.actions" :key="action">{{ action }}</li>
      </ul>
    </article>

    <aside class="branch">
      <p class="branch-label">Ответвление · если профессия рабочая</p>
      <h3>{{ medical.title }}</h3>
      <p>{{ medical.lead }}</p>
      <ul>
        <li v-for="point in medical.points" :key="point">{{ point }}</li>
      </ul>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { medical, stages } from '../data/guide'

const activeId = ref(stages[0].id)
const active = computed(() => stages.find((stage) => stage.id === activeId.value))
</script>
