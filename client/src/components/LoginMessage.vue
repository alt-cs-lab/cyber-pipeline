<script setup>
// Components
import TopBanner from '@/components/TopBanner.vue'

// Stores
import { useTokenStore } from '@/stores/Token'

// Token Store
const tokenStore = useTokenStore()
</script>

<template>
  <main>
    <TopBanner />
    <br />
    <div v-if="tokenStore.token">
      <RouterLink to="/teachers" class="btn btn-success"
        >Teachers</RouterLink
      >
      <RouterLink to="/districts" class="btn btn-success"
        >Districts</RouterLink
      >
    </div>
    <div v-else>
      <a class="btn btn-success" @click="tokenStore.getToken()"
        ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
      >
    </div>
  </main>
</template>
