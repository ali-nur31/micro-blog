import { createRouter, createWebHistory } from 'vue-router';
import FeedView from './views/FeedView.vue';
import AuthView from './views/AuthView.vue';

const routes = [
    { path: '/', component: FeedView },
    { path: '/login', component: AuthView }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
