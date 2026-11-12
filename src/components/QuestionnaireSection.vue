<template>
  <section class="section" id="questionnaire">
    <header class="section-head">
      <span class="section-index">03</span>
      <div>
        <h2>Анкета службы безопасности</h2>
        <p>
          Откройте бланк и пример заполнения. Ниже — правила, которые в примере
          легко пропустить.
        </p>
      </div>
    </header>

    <ol class="rules">
      <li v-for="(rule, index) in formRules" :key="rule">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ rule }}
      </li>
    </ol>

    <div class="form-layout">
      <div class="point-nav" role="tablist" aria-label="Пункты анкеты">
        <button
          v-for="point in formPoints"
          :key="point.id"
          type="button"
          role="tab"
          :aria-selected="point.id === activeId"
          :class="{ active: point.id === activeId }"
          @click="activeId = point.id"
        >
          <span>{{ point.code }}</span>
          <span>
            <strong>{{ point.title }}</strong>
            <small>{{ point.summary }}</small>
          </span>
        </button>
      </div>

      <article class="point-card" role="tabpanel">
        <p class="stage-kicker">Пункт {{ active.code }}</p>
        <h3>{{ active.title }}</h3>
        <ul>
          <li v-for="line in active.points" :key="line">{{ line }}</li>
        </ul>
        <blockquote v-if="active.quote">{{ active.quote }}</blockquote>
      </article>
    </div>

    <div class="photo-row" aria-label="Фотографии к анкете">
      <article v-for="photo in photos" :key="photo.size" class="photo-card">
        <div class="photo-frame" :class="photo.size.startsWith('4') ? 'large' : 'small'">
          <span>{{ photo.size }}</span>
        </div>
        <div>
          <h3>{{ photo.title }} фотография</h3>
          <p>{{ photo.note }}</p>
        </div>
      </article>
      <article class="photo-card photo-warn">
        <h3>Не вклеивайте фотографии</h3>
        <p>Принесите их отдельно. Для службы безопасности также нужна справка об отсутствии судимости с Госуслуг.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formPoints, formRules, photos } from '../data/guide'

const activeId = ref(formPoints[0].id)
const active = computed(() => formPoints.find((point) => point.id === activeId.value))
</script>
