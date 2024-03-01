<script setup>
import { RouterView } from 'vue-router'
import TopMenu from '@/components/topmenu/TopMenu.vue'
// Stores
import { useTokenStore } from '@/stores/Token'
import Toast from 'primevue/toast'

// Token Store
const tokenStore = useTokenStore()
tokenStore.tryToken()
</script>

<template>
  <header></header>

  <nav>
    <TopMenu />
  </nav>

  <aside></aside>

  <main>
    <div class="my-2">
      <RouterView />
    </div>
  </main>

  <footer></footer>
  <Toast position="bottom-right" />
</template>
