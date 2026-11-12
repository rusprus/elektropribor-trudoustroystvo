<template>
  <section class="section" id="meeting">
    <header class="section-head">
      <span class="section-index">04</span>
      <div>
        <h2>Встреча и выход на работу</h2>
        <p>
          Когда документы и анкета готовы, позвоните и договоритесь о времени.
          У отдела не всегда есть возможность принять человека без записи.
        </p>
      </div>
    </header>

    <div class="meeting-grid">
      <article class="kit">
        <h3>Что взять с собой</h3>
        <ul>
          <li v-for="(item, index) in meetingKit" :key="item">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            {{ item }}
          </li>
        </ul>
      </article>

      <ol class="after">
        <li>
          <span>До</span>
          <h3>Не увольняйтесь заранее</h3>
          <p>Если вы сейчас работаете, продолжайте работать. Заявление текущему работодателю пишите только после звонка о завершении согласования.</p>
        </li>
        <li>
          <span>День</span>
          <h3>Понедельник или четверг</h3>
          <p>Приём обычно в эти дни. Если неудобно — сообщите, договоритесь о другом дне и скажите, какого числа вас ждать.</p>
        </li>
        <li>
          <span>Связь</span>
          <h3>Телефон и мессенджеры</h3>
          <p>Вопросы можно задать представителю отдела управления персоналом в рабочие часы. Телефон указан в самом низу списка документов.</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { meetingKit } from '../data/guide'
</script>
