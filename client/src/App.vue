<script setup>
// Libraries
import { RouterView } from 'vue-router'

// PrimeVue Components
import Toast from 'primevue/toast'

// Custom Components
import TopMenu from '@/components/topmenu/TopMenu.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Setup Stores
tokenStore.tryToken()
</script>

<template>
  <header></header>

  <nav>
    <!-- Navigation Menu-->
    <TopMenu />
  </nav>

  <aside></aside>

  <main>
    <div class="my-2">
      <!-- Main Application View-->
      <RouterView />
    </div>
  </main>

  <footer></footer>

  <!-- Toast Library -->
  <Toast position="bottom-right" />
</template>
