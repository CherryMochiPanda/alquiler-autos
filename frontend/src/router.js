import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Catalogo from './views/Catalogo.vue';
import Reserva from './views/Reserva.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/catalogo', component: Catalogo },
  { path: '/reserva', component: Reserva },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;