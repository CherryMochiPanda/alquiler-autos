import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Catalogo from './views/Catalogo.vue';
import Reserva from './views/Reserva.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';
import Account from './views/Account.vue';
import Admin from './views/Admin.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/catalogo', component: Catalogo },
  { path: '/reservar', component: Reserva },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/account', component: Account },
  { path: '/admin', component: Admin, beforeEnter: (to, from, next) => {
      try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('isAdmin') === 'true') next()
        else next('/')
      } catch (e) {
        next('/')
      }
    }
  },
  {path: '/detalle-auto',
  name: 'DetalleAuto',
  component: () => import('./views/DetalleAuto.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;