<script setup>
import { ref } from 'vue'
import ThemeToggle from '@/components/topmenu/ThemeToggle.vue'
import LoginProfile from '@/components/topmenu/LoginProfile.vue'
import { useRouter } from 'vue-router'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Router
const router = useRouter()

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home'
  }
])

tokenStore.$subscribe(() => {
  if (tokenStore.is_admin) {
    items.value = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          router.push({ name: 'home' })
        }
      },
      {
        label: 'Teachers',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'teachers' })
        }
      },
      {
        label: 'Districts',
        icon: 'pi pi-building',
        command: () => {
          router.push({ name: 'districts' })
        }
      },
      {
        label: 'Users',
        icon: 'pi pi-user-edit',
        command: () => {
          router.push({ name: 'users' })
        }
      }
    ]
  } else {
    items.value = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      }
    ]
  }
})
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <RouterLink :to="{ name: 'home' }">
        <img src="../../assets/logo.png" height="46px" alt="CyberPipeline Logo" />
      </RouterLink>
    </template>
    <template #end>
      <div class="flex align-items-center gap-2">
        <ThemeToggle />
        <LoginProfile />
      </div>
    </template>
  </Menubar>
</template>

<style scoped></style>
