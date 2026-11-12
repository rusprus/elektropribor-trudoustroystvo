<template>
  <section class="hero" id="top">
    <div class="hero-copy">
      <p class="eyebrow">{{ organization }}</p>
      <h1>Как устроиться на работу</h1>
      <p class="lede">
        Мы рады, что вы решили стать частью организации. Приём проходит согласование:
        сначала документы и докладная записка, затем анкета службы безопасности,
        встреча и только после звонка — выход на работу.
      </p>
      <div class="hero-actions">
        <a class="button button-primary" href="#documents">Открыть список документов</a>
        <a class="button button-ghost" href="#route">Смотреть маршрут</a>
      </div>
    </div>

    <figure class="audio-card">
      <figcaption>
        <span class="audio-kicker">Лист 01 · звук</span>
        <strong>Озвучка первой страницы</strong>
      </figcaption>
      <audio ref="audio" :src="src" preload="metadata" @timeupdate="onTime" @loadedmetadata="onTime" @ended="playing = false" />
      <div class="player">
        <button class="play" type="button" :aria-label="playing ? 'Пауза' : 'Слушать озвучку'" @click="toggle">
          <svg v-if="!playing" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z" /></svg>
        </button>
        <div class="player-track">
          <input
            type="range"
            min="0"
            :max="duration || 0"
            step="0.1"
            :value="current"
            aria-label="Позиция озвучки"
            @input="seek"
          />
          <div class="player-time">
            <span>{{ format(current) }}</span>
            <span>{{ format(duration) }}</span>
          </div>
        </div>
      </div>
      <blockquote>
        «Здравствуйте. Мы рады, что Вы решили стать частью нашей организации.
        Для того, чтобы трудоустроиться к нам, Вам необходимо предоставить ряд документов.»
      </blockquote>
    </figure>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { organization } from '../data/guide'

const src = `${import.meta.env.BASE_URL}audio/elektropribor-trudoustroystvo.mp3`
const audio = ref(null)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)

function toggle() {
  if (!audio.value) return
  if (audio.value.paused) {
    audio.value.play()
    playing.value = true
  } else {
    audio.value.pause()
    playing.value = false
  }
}

function onTime() {
  if (!audio.value) return
  current.value = audio.value.currentTime || 0
  duration.value = Number.isFinite(audio.value.duration) ? audio.value.duration : 0
}

function seek(event) {
  if (!audio.value) return
  audio.value.currentTime = Number(event.target.value)
}

function format(value) {
  const total = Math.floor(value || 0)
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}
</script>
