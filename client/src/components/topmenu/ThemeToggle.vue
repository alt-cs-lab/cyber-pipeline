<script setup>
// https://dev.to/tqbit/create-your-own-dark-mode-toggle-component-with-vue-js-1284
// https://primevue.org/theming/#switchthemes

// Libraries
import { onMounted, ref } from 'vue'
import { usePrimeVue } from 'primevue/config'
const PrimeVue = usePrimeVue()
import Logger from 'js-logger'

// Theme reference
const themeDark = ref('light-theme')

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
    return 'dark-theme'
  } else {
    return 'light-theme'
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
  if (themeDark.value == 'light-theme') {
    PrimeVue.changeTheme('aura-dark-purple', 'aura-light-purple', 'theme-link', () => {
      localStorage.setItem('user-theme', themeDark.value)
    })
  } else {
    PrimeVue.changeTheme('aura-light-purple', 'aura-dark-purple', 'theme-link', () => {
      localStorage.setItem('user-theme', themeDark.value)
    })
  }
}

/**
 * Toggle theme value and trigger update
 */
const toggleDarkMode = () => {
  if (themeDark.value == 'dark-theme') {
    themeDark.value = 'light-theme'
  } else {
    themeDark.value = 'dark-theme'
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
          v-if="themeDark == 'light-theme'"
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
