<template>
  <header class="topbar">
    <a class="brand" href="#top">
      <span class="brand-mark"><MarkIcon /></span>
      <span>
        <span class="brand-kicker">Инструкция по приёму</span>
        <span class="brand-name">ЦНИИ «Электроприбор»</span>
      </span>
    </a>
    <nav class="nav" aria-label="Разделы инструкции">
      <template v-for="item in nav" :key="item.id">
        <button v-if="item.id === 'questions'" type="button" @click="$emit('open-consultant')">
          {{ item.label }}
        </button>
        <a v-else :href="`#${item.id}`">{{ item.label }}</a>
      </template>
    </nav>
    <button class="nav-ask" type="button" @click="$emit('open-consultant')">
      Спросить
    </button>
  </header>
</template>

<script setup>
import { nav } from '../data/guide'
import MarkIcon from './MarkIcon.vue'

defineEmits(['open-consultant'])
</script>
