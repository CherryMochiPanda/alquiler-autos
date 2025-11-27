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

// Seed demo admin user if missing (email: admin@correo.com / pass: admin123)
try {
  const key = 'demo_users'
  const raw = localStorage.getItem(key)
  const users = raw ? JSON.parse(raw) : []
  const exists = users.some(u => u.email === 'admin@correo.com')
  if (!exists) {
    const adminUser = {
      id: 'admin-' + Date.now(),
      firstName: 'Admin',
      lastName: 'Demo',
      email: 'admin@correo.com',
      password: 'admin123',
      phone: '+53 00000000',
      dni: '00000000000',
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
    users.push(adminUser)
    localStorage.setItem(key, JSON.stringify(users))
  }
} catch (e) {
  // ignore
}

app.mount('#app')