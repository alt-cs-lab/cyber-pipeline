<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Custom Components
import ThemeToggle from '@/components/topmenu/ThemeToggle.vue'
import LoginProfile from '@/components/topmenu/LoginProfile.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Menu items
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home'
  }
])

/**
 * Watch for changes in token and update menu
 */
tokenStore.$subscribe(() => {
  // If the user is an admin, display full menu
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
        label: 'Cohorts',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'cohorts' })
        }
      },
      {
        label: 'Courses',
        icon: 'pi pi-book',
        command: () => {
          router.push({ name: 'courses' })
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

    // If user is not admin, show simple menu only
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
        <img
          src="../../assets/logo.png"
          height="46px"
          alt="CyberPipeline Logo"
        />
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
