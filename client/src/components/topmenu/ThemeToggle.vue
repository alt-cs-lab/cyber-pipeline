<script setup>
// https://dev.to/tqbit/create-your-own-dark-mode-toggle-component-with-vue-js-1284
// https://primevue.org/theming/#switchthemes

// Libraries
import { onMounted, ref } from 'vue'
import { usePrimeVue } from 'primevue/config'
const PrimeVue = usePrimeVue()
import Logger from 'js-logger'

import { usePreset } from '@primevue/themes'

// Theme reference
const themeDark = ref('aura-light-purple')

/**
 * Get theme from local storage
 */
const getTheme = () => {
  return localStorage.getItem('user-theme')
}

/**
 * Get user's media preference
 */
const getMediaPreference = () => {
  const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (hasDarkPreference) {
    return 'aura-dark-purple'
  } else {
    return 'aura-light-purple'
  }
}

/**
 * Set theme when component is mounted
 */
onMounted(() => {
  themeDark.value = getTheme() || getMediaPreference()
  updateTheme()
})

/**
 * Update theme on change
 */
const updateTheme = () => {
  Logger.info('Update theme to ' + themeDark.value)

  const themeLink = document.getElementById('theme-link')

  if(themeLink) {
    themeLink.href = themeDark.value === 'aura-dark-purple' ? '/themes/aura-dark-purple/theme.css' : '/themes/aura-light-purple/theme.css'
  }
}

/**
 * Toggle theme value and trigger update
 */
const toggleDarkMode = () => {
  if (themeDark.value == 'aura-dark-purple') {
    themeDark.value = 'aura-light-purple'
  } else {
    themeDark.value = 'aura-dark-purple'
  }
  updateTheme()
}
</script>

<template>
  <div class="p-menuitem">
    <div class="p-menuitem-content">
      <a
        class="p-menuitem-link"
        @click="toggleDarkMode()"
      >
        <span
          v-if="themeDark == 'aura-light-purple'"
          class="pi pi-moon"
          v-tooltip.bottom="'Toggle Dark Mode'"
        />
        <span
          v-else
          class="pi pi-sun"
          v-tooltip.bottom="'Toggle Light Mode'"
        />
      </a>
    </div>
  </div>
</template>

<style scoped></style>
