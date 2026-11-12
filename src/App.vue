<template>
  <div class="page">
    <SiteHeader @open-consultant="askTick += 1" />
    <main>
      <HeroSection />
      <StagesSection />
      <DocumentsSection />
      <QuestionnaireSection />
      <MeetingSection />
    </main>
    <footer class="footer">
      <p>{{ organization }}</p>
      <p>Отдел управления персоналом отвечает по телефону и в мессенджерах в рабочие часы.</p>
    </footer>
    <ConsultantDock :open-signal="askTick" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { organization } from './data/guide'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import StagesSection from './components/StagesSection.vue'
import DocumentsSection from './components/DocumentsSection.vue'
import QuestionnaireSection from './components/QuestionnaireSection.vue'
import MeetingSection from './components/MeetingSection.vue'
import ConsultantDock from './components/ConsultantDock.vue'

const askTick = ref(0)
</script>
