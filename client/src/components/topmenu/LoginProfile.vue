<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Menu Items
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

// Menu reference
const menu = ref()

/**
 * Toggle button handler
 *
 * @param {Event} event
 */
const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="p-menuitem">
    <!-- If no token present, show login button -->
    <div
      v-if="tokenStore.token == ''"
      class="p-menuitem-content"
    >
      <a
        class="p-menuitem-link"
        @click="tokenStore.getToken()"
      >
        <span class="p-menuitem-icon pi pi-sign-in" />
        <span class="p-menuitem-text">Login</span>
      </a>
    </div>

    <!-- If token present, assume user is logged in -->
    <div
      v-else
      class="p-menuitem-content"
    >
      <a
        class="p-menuitem-link"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="profile_menu"
      >
        <Avatar
          icon="pi pi-user"
          shape="circle"
        />
      </a>
      <Menu
        ref="menu"
        id="profile_menu"
        :model="items"
        :popup="true"
      />
    </div>
  </div>
</template>
