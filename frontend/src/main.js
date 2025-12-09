import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCar, faBolt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { faSearch, faCalendarCheck, faClipboardCheck, faCarSide } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch, faCalendarCheck, faClipboardCheck, faCarSide)
library.add(faCar, faBolt, faMoneyBillWave)

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.use(i18n)

// Inicializa auth store desde localStorage
import { useAuthStore } from './stores/useAuthStore'
const authStore = useAuthStore(pinia)
authStore.initializeAuth()
// Backend seeds admin user; frontend seeding removed to avoid conflicts

app.mount('#app')