<template>
  <section class="section" id="documents">
    <header class="section-head">
      <span class="section-index">02</span>
      <div>
        <h2>Документы для докладной</h2>
        <p>
          Это первый блок. По нему пишут докладную записку на приём.
          Приём каждого нового сотрудника согласуют.
        </p>
      </div>
    </header>

    <div class="doc-board">
      <article v-for="group in documentGroups" :key="group.id" class="doc-group">
        <h3>{{ group.title }}</h3>
        <ul>
          <li v-for="item in group.items" :key="item.title">
            <span class="doc-mark" aria-hidden="true"></span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { documentGroups } from '../data/guide'
</script>
