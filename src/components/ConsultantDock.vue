<template>
  <section class="dock" :class="{ open }">
    <button v-if="!open" class="dock-launcher" type="button" :aria-label="`Консультант, ${modeLabel}`" @click="open = true">
      <span class="launcher-mark" aria-hidden="true"><MarkIcon /></span>
    </button>

    <div v-else class="dock-panel" role="dialog" aria-label="Консультант по трудоустройству">
      <header class="dock-head">
        <div>
          <p class="dock-kicker">Заготовка агента</p>
          <h2>Консультант</h2>
        </div>
        <button class="icon-button" type="button" aria-label="Закрыть консультанта" @click="open = false">
          ×
        </button>
      </header>

      <p class="dock-status" :data-mode="mode">{{ statusText }}</p>

      <div ref="log" class="dock-log" aria-live="polite">
        <article v-for="(message, index) in messages" :key="index" :class="message.role">
          <p>{{ message.content }}</p>
        </article>
        <p v-if="pending" class="pending">Подбираю ответ по инструкции…</p>
      </div>

      <div class="suggestions">
        <button
          v-for="item in suggestions"
          :key="item"
          type="button"
          :disabled="pending"
          @click="send(item)"
        >
          {{ item }}
        </button>
      </div>

      <form class="dock-form" @submit.prevent="send(draft)">
        <label class="sr-only" for="consultant-input">Ваш вопрос</label>
        <textarea
          id="consultant-input"
          v-model="draft"
          rows="2"
          placeholder="Напишите вопрос по инструкции"
          @keydown.enter.exact.prevent="send(draft)"
        />
        <button class="button button-primary" type="submit" :disabled="pending || !draft.trim()">
          Отправить
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { suggestions } from '../data/guide'
import { agentConfigured, askConsultant } from '../agent/client'
import MarkIcon from './MarkIcon.vue'

const props = defineProps({
  openSignal: { type: Number, default: 0 },
})

const open = ref(false)
const draft = ref('')
const pending = ref(false)
const mode = ref(agentConfigured() ? 'agent' : 'local')
const log = ref(null)
const messages = ref([
  {
    role: 'assistant',
    content:
      'Здравствуйте. Я помогу пройти инструкцию: документы, анкета, встреча и срок выхода. Спросите своими словами или выберите вопрос ниже.',
  },
])

const modeLabel = computed(() => (mode.value === 'agent' ? 'агент подключён' : 'ответы по инструкции'))
const statusText = computed(() =>
  mode.value === 'agent'
    ? 'Вопросы уходят подключённому консультанту.'
    : 'Консультант ещё не подключён. Пока ответы берутся из текста этой инструкции.',
)

watch(
  () => props.openSignal,
  (value) => {
    if (value > 0) open.value = true
  },
)

watch(messages, async () => {
  await nextTick()
  if (log.value) log.value.scrollTop = log.value.scrollHeight
}, { deep: true })

async function send(text) {
  const content = text.trim()
  if (!content || pending.value) return
  messages.value.push({ role: 'user', content })
  draft.value = ''
  pending.value = true
  try {
    const history = messages.value.slice(0, -1)
    const result = await askConsultant(content, history)
    mode.value = result.mode
    messages.value.push({ role: 'assistant', content: result.reply })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: `Не удалось получить ответ агента. ${error.message}. Проверьте адрес и повторите вопрос.`,
    })
  } finally {
    pending.value = false
  }
}
</script>
