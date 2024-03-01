import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import FocusTrap from 'primevue/focustrap'
import ConfirmationService from 'primevue/confirmationservice'
import Logger from 'js-logger'
import setupInterceptors from './services/interceptors'

// Log messages will be written to the window's console.
Logger.useDefaults()
Logger.setLevel(import.meta.env.DEV ? Logger.DEBUG : Logger.WARN)
console.log('Log Level: ' + Logger.getLevel().name)

// CSS
import 'primeicons/primeicons.css'

// Themes are controlled in App.vue
// import 'primevue/resources/themes/aura-light-purple/theme.css'
// import 'primevue/resources/themes/aura-dark-purple/theme.css'
import 'primeflex/primeflex.css'

import App from './App.vue'
import router from './router'

setupInterceptors()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled'
})
app.directive('tooltip', Tooltip)
app.directive('focustrap', FocusTrap)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
