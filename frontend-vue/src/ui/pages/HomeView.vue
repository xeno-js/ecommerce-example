<script setup lang="ts">
import { useAuthStore } from '@/auth'
import ButtonComponent from '@/ui/components/ButtonComponent.vue'

const authStore = useAuthStore()
</script>

<template>
    <div class="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
        <!-- Hero Section -->
        <section class="relative overflow-hidden py-20 lg:py-32">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span
                    class="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                    Enterprise Isomorphic Architecture
                </span>
                <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                    Next-Gen E-Commerce with <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Xeno.js</span>
                </h1>
                <p class="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10">
                    Explore our high-performance isomorphic application featuring CQRS pattern, distributed caching with
                    pattern matching, Object Storage images, and transactional stock management.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <router-link to="/products">
                        <ButtonComponent type="primary"
                            class="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-lg shadow-purple-500/20">
                            Browse Catalog
                        </ButtonComponent>
                    </router-link>
                    <router-link v-if="!authStore.isAuthenticated" to="/login">
                        <ButtonComponent type="secondary" class="w-full sm:w-auto px-8 py-4 text-base font-semibold">
                            Sign In with Google
                        </ButtonComponent>
                    </router-link>
                    <router-link v-else to="/dashboard">
                        <ButtonComponent type="secondary" class="w-full sm:w-auto px-8 py-4 text-base font-semibold">
                            Go to Dashboard
                        </ButtonComponent>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Features Grid -->
        <section class="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Powered by Advanced Architecture</h2>
                    <p class="text-slate-600 dark:text-slate-400 mt-2">Built with robustness, security, and maximum
                        speed in mind.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div
                        class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl font-bold mb-4">
                            ⚡
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Distributed Caching</h3>
                        <p class="text-slate-600 dark:text-slate-300 text-sm">
                            Seamless query caching with automatic pattern-matching invalidation via pipeline behaviors
                            upon state-changing commands.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div
                        class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl font-bold mb-4">
                            📦
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Paginated Catalog</h3>
                        <p class="text-slate-600 dark:text-slate-300 text-sm">
                            Optimized Drizzle ORM queries with server-side pagination, strict Zod validation, and
                            dynamic Object Storage image URLs.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div
                        class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl font-bold mb-4">
                            🛒
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Transactional Checkout
                        </h3>
                        <p class="text-slate-600 dark:text-slate-300 text-sm">
                            Client-side cart persistence via Pinia combined with robust server-side command handlers and
                            inventory management.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <footer
            class="py-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
            <p>&copy; 2026 Xeno.JS Ecosystem. All rights reserved.</p>
        </footer>
    </div>
</template>