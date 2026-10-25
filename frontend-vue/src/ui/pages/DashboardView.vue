<script setup lang="ts">
import { useAuthCallback, useAuthStore, useLogout } from '@/auth'
import ButtonComponent from '@/ui/components/ButtonComponent.vue'
import OrdersView from './OrdersView.vue'

const authStore = useAuthStore()
const { loading: isSyncing, error: syncError } = useAuthCallback()
const { handleLogout, loading: isLoggingOut, error: logoutError } = useLogout()
</script>

<template>
    <main class="max-w-4xl mx-auto px-4 py-8">
        <header
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-700 pb-6 mb-8 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your profile and track your orders.</p>
            </div>
            <ButtonComponent type="danger" @click.prevent="handleLogout" :disabled="isLoggingOut">
                <span v-if="isLoggingOut">Logout...</span>
                <span v-else>Logout</span>
            </ButtonComponent>
        </header>

        <section
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm mb-8">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Account Info</h2>
            <div class="space-y-2 text-slate-600 dark:text-slate-300">
                <p><strong>Mail:</strong> <span class="text-slate-900 dark:text-white">{{ authStore.identity?.email ??
                        'N/D' }}</span></p>
                <p><strong>Name:</strong> <span class="font-mono dark:text-white">{{ authStore.identity?.name ??
                        'N/D' }}</span></p>
            </div>
        </section>

        <OrdersView />

        <section class="space-y-2">
            <div v-if="isSyncing"
                class="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                Data synchronization with the server is in progress...
            </div>
            <div v-if="syncError"
                class="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-sm">
                An error occured: {{ syncError }}
            </div>
            <div v-if="logoutError"
                class="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-sm">
                Logout error: {{ logoutError }}
            </div>
        </section>
    </main>
</template>