import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Catalogo from './views/Catalogo.vue';
import Reserva from './views/Reserva.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/catalogo', component: Catalogo },
    { path: '/reserva', component: Reserva },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;