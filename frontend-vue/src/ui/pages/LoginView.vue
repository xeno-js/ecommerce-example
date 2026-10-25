<script setup lang="ts">
import { useLogin } from '@/auth';
import ButtonComponent from '@/ui/components/ButtonComponent.vue';
import LoaderComponent from '@/ui/components/LoaderComponent.vue';

const { handleLogin, loading, error } = useLogin();
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
        <div
            class="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm text-center">

            <div v-if="loading" class="py-8">
                <LoaderComponent text="Reindirizzamento in corso..." />
            </div>

            <div v-else>
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Login
                </h1>
                <p class="text-slate-600 dark:text-slate-400 text-sm mb-8">To sign in securely, use your
                    Google account.</p>

                <div class="space-y-4">
                    <ButtonComponent type="primary" @click.prevent="handleLogin"
                        class="w-full py-3 justify-center text-base">
                        <span class="flex items-center gap-2">
                            <i class="bi bi-google"></i> Login with Google
                        </span>
                    </ButtonComponent>
                </div>

                <p v-if="error" class="text-red-600 dark:text-red-400 text-sm mt-4">{{ error }}</p>
            </div>

        </div>
    </main>
</template>