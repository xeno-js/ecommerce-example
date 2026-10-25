<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrders } from '@/order';
import LoaderComponent from '@/ui/components/LoaderComponent.vue';

const route = useRoute();
const router = useRouter();
const { order, loading, error, fetchOrderById } = useOrders();

onMounted(async () => {
    if (route.params.id) {
        await fetchOrderById(route.params.id as string);
    }
});
</script>

<template>
    <main class="max-w-4xl mx-auto px-4 py-8">
        <button @click="router.push('/dashboard')" class="text-purple-600 font-medium hover:underline mb-6 block">
            &larr; Back to orders
        </button>

        <div v-if="loading" class="py-12">
            <LoaderComponent text="Caricamento dettaglio..." />
        </div>
        <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">{{ error }}</div>

        <div v-else-if="order"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Order #{{ order.id }}</h1>
                    <p class="text-slate-500 mt-1">Date: {{ new Date(order.createdAt).toLocaleString('it-IT') }}</p>
                </div>
                <span class="badge badge-success mt-2 sm:mt-0 px-3 py-1 text-sm">{{ order.status.toUpperCase() }}</span>
            </div>

            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Purchased Items</h3>
            <ul class="space-y-3">
                <li v-for="item in order.items" :key="item.productId"
                    class="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                    <div>
                        <p class="font-medium text-slate-900 dark:text-white">{{ item.name }}</p>
                        <p class="text-sm text-slate-500">Amount: {{ item.quantity }}</p>
                    </div>
                    <p class="font-bold text-purple-600">&euro; {{ (Number(item.price) * item.quantity).toFixed(2) }}
                    </p>
                </li>
            </ul>

            <div
                class="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center text-xl">
                <span class="font-bold text-slate-900 dark:text-white">Total</span>
                <span class="font-extrabold text-purple-600">&euro; {{ order.totalAmount }}</span>
            </div>
        </div>
    </main>
</template>