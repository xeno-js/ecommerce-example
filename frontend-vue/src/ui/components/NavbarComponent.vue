<script setup lang="ts">
import { useAuthStore } from '@/auth'
import { useCartStore } from '@/cart/cart.store' // Supponendo che lo store sia in @/cart o importato correttamente
import { computed } from 'vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const totalItemsCount = computed(() => cartStore.items.reduce((sum, item) => sum + item.quantity, 0))
</script>

<template>
    <header class="navbar-container">
        <div class="navbar-content">
            <div class="navbar-brand">
                <router-link to="/" class="brand-link">Xeno.Js App</router-link>
            </div>
            <nav class="navbar-links">
                <router-link to="/" class="nav-item" active-class="active">Home</router-link>
                <router-link to="/products" class="nav-item" active-class="active">Prodocts</router-link>
                <router-link to="/cart" class="nav-item cart-link" active-class="active">
                    <i class="bi bi-cart"></i> Cart
                    <span v-if="totalItemsCount > 0" class="badge-count">{{ totalItemsCount }}</span>
                </router-link>
                <router-link v-if="isAuthenticated" to="/dashboard" class="nav-item"
                    active-class="active">Dashboard</router-link>
            </nav>
            <div class="navbar-actions">
                <router-link v-if="!isAuthenticated" to="/login" class="btn-login">
                    Login
                </router-link>
                <router-link v-else to="/dashboard" class="btn-dashboard">
                    Dashboard
                </router-link>
            </div>
        </div>
    </header>
</template>

<style scoped>
.navbar-container {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    width: 100%;
}

.navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand-link {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--text-heading);
    text-decoration: none;
}

.navbar-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav-item {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: var(--font-medium);
    transition: color 0.2s ease;
    position: relative;
}

.nav-item:hover,
.nav-item.active {
    color: var(--accent);
}

.badge-count {
    background-color: var(--accent);
    color: white;
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    margin-left: 0.25rem;
    vertical-align: top;
}

.navbar-actions {
    display: flex;
    align-items: center;
}

.btn-login,
.btn-dashboard {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    transition: background-color 0.2s;
}

.btn-login:hover,
.btn-dashboard:hover {
    background: var(--accent-hover);
}
</style>