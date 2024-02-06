import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import setupInterceptors from './services/interceptors'
import Logger from 'js-logger'

// Log messages will be written to the window's console.
Logger.useDefaults()
Logger.setLevel(import.meta.env.DEV ? Logger.DEBUG : Logger.WARN)

// Add Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Add Font Awesome
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Set up Font Awesome
import {
  faArrowRightToBracket,
  faArrowRightFromBracket,
  faChalkboardTeacher,
  faPenToSquare,
  faArrowLeft,
  faUser,
  faTrash,
  faPlus,
  faLink,
  faLinkSlash,
  faCircleQuestion,
  faUserGraduate,
  faBold,
  faItalic,
  faHeading,
  faTable,
  faImage,
  faQuoteLeft,
  faListOl,
  faListUl,
  faEye,
  faColumns,
  faArrowsAlt,
  faRedo,
  faTimes,
  faBell,
  faBellSlash,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faArrowRightToBracket,
  faChalkboardTeacher,
  faArrowRightFromBracket,
  faPenToSquare,
  faArrowLeft,
  faUser,
  faTrash,
  faPlus,
  faLink,
  faLinkSlash,
  faCircleQuestion,
  faUserGraduate,
  faBold,
  faItalic,
  faHeading,
  faTable,
  faImage,
  faQuoteLeft,
  faListOl,
  faListUl,
  faEye,
  faColumns,
  faArrowsAlt,
  faRedo,
  faTimes,
  faBell,
  faBellSlash
)

// FontAwesome Watch DOM
// Enables fa classes
dom.watch()

setupInterceptors()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(
  plugin,
  defaultConfig({
    config: {
      classes: {
        input: 'form-control',
        label: 'form-label',
        help: 'form-text',
        outer: 'mb-3',
      },
    },
  })
)

// Add Font Awesome
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
