import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Catalogo from './views/Catalogo.vue';
import Reserva from './views/Reserva.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/catalogo', component: Catalogo },
  { path: '/reservar', component: Reserva },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  {path: '/detalle-auto',
  name: 'DetalleAuto',
  component: () => import('./views/DetalleAuto.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;