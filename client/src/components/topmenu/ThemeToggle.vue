<script setup>
// https://dev.to/tqbit/create-your-own-dark-mode-toggle-component-with-vue-js-1284
// https://primevue.org/theming/#switchthemes
import {onMounted, ref} from 'vue';
import { usePrimeVue } from 'primevue/config';
import Logger from 'js-logger'

const PrimeVue = usePrimeVue();

const themeDark = ref("light-theme")

const getTheme = () => {
  return localStorage.getItem("user-theme");
}

const getMediaPreference = () =>  {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (hasDarkPreference) {
    return "dark-theme";
  } else {
    return "light-theme";
  }
}

onMounted(() => {
  themeDark.value = getTheme() || getMediaPreference();
  updateTheme();
})

const updateTheme = () => {
  Logger.info("Update theme to " + themeDark.value)
  if(themeDark.value == "light-theme"){
    PrimeVue.changeTheme('aura-dark-purple', 'aura-light-purple', 'theme-link', () => {  localStorage.setItem("user-theme", themeDark.value) });
  }else{
    PrimeVue.changeTheme('aura-light-purple', 'aura-dark-purple', 'theme-link', () => {  localStorage.setItem("user-theme", themeDark.value) });
  }
}

const toggleDarkMode = () => {
  if (themeDark.value == "dark-theme"){
    themeDark.value = "light-theme"
  } else {
    themeDark.value = "dark-theme"
  }
  updateTheme();
}
</script>

<template>
  <div class="p-menuitem">
    <div class="p-menuitem-content">
      <a class="p-menuitem-link" @click="toggleDarkMode()">
        <span v-if="themeDark == 'light-theme'" class="pi pi-moon" v-tooltip.bottom="'Toggle Dark Mode'"/>
        <span v-else class="pi pi-sun" v-tooltip.bottom="'Toggle Light Mode'"/>
      </a>
    </div>
  </div>
</template>

<style scoped>
</style>