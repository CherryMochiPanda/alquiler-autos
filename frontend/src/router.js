import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Catalogo from './views/Catalogo.vue'
import Reserva from './views/Reserva.vue'
import Account from './views/Account.vue'
import UserReservations from './views/UserReservations.vue'
import Admin from './views/Admin.vue'
import DetalleAuto from './views/DetalleAuto.vue'

// Guarda para proteger ruta admin
function adminGuard(to, from, next) {
  try {
    const raw = localStorage.getItem('currentUser')
    if (!raw) return next('/')
    const user = JSON.parse(raw)
    if (user?.role === 'admin') {
      next()
    } else {
      next('/')
    }
  } catch (e) {
    next('/')
  }
}

const routes = [
  { path: '/', component: Home },
  { path: '/catalogo', component: Catalogo },
  { path: '/reservar', component: Reserva },
  { path: '/account', component: Account },
  { path: '/account/reservas', component: UserReservations },
  { path: '/detalle-auto', name: 'DetalleAuto', component: DetalleAuto },
  {
    path: '/admin',
    component: Admin,
    beforeEnter: adminGuard,
    meta: { requiresAdmin: true }
  },
  // Redireccionar vistas antiguas a Account con tabs
  { path: '/login', redirect: '/account' },
  { path: '/signup', redirect: '/account' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
