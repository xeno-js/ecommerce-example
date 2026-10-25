import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './auth';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/ui/pages/HomeView.vue')
        },
        {
            path: '/products',
            name: 'Products',
            component: () => import('@/ui/pages/ProductsView.vue')
        },
        {
            path: '/products/:id',
            name: 'ProductDetail',
            component: () => import('@/ui/pages/ProductDetailView.vue')
        }, 
        {
            path: '/cart',
            name: 'Cart',
            component: () => import('@/ui/pages/CartView.vue')
        },
        {
            path: '/orders/:id',
            name: 'OrderDetail',
            component: () => import('@/ui/pages/OrderDetailView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/ui/pages/LoginView.vue'),
            meta: { guestOnly: true }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/ui/pages/DashboardView.vue'),
            meta: { requiresAuth: true }
        },
    ]
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isSessionChecked) {
        await authStore.checkSession();
    }

    const isAuth = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuth) {
        next({ name: 'Login' });
    } else if (to.meta.guestOnly && isAuth) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});