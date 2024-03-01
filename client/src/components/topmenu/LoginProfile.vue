<script setup>
// Stores
import { useTokenStore } from '@/stores/Token'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Token Store
const tokenStore = useTokenStore()

// Router
const router = useRouter()

const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    }
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout
  }
])

const menu = ref()

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="p-menuitem">
    <div v-if="tokenStore.token == ''" class="p-menuitem-content">
      <a class="p-menuitem-link" @click="tokenStore.getToken()">
        <span class="p-menuitem-icon pi pi-sign-in" />
        <span class="p-menuitem-text">Login</span>
      </a>
    </div>
    <div v-else class="p-menuitem-content">
      <a class="p-menuitem-link" @click="toggle" aria-haspopup="true" aria-controls="profile_menu">
        <Avatar icon="pi pi-user" shape="circle" />
      </a>
      <Menu ref="menu" id="profile_menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<style scoped></style>
