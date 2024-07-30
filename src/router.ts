import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

//注册路由
const routes = [
    {
        path: '/',
        name: 'main',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('./views/MainPage.vue')
    },
    {
        path: '/other',
        name: 'other',
        component: () => import('./views/OtherPage.vue')
    }
];
const router = createRouter({
    routes,
    history: createWebHashHistory()
});

export default router;