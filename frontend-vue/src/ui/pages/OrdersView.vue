<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrders } from '@/order';
import LoaderComponent from '@/ui/components/LoaderComponent.vue';
import PaginationComponent from '@/ui/components/PaginationComponent.vue';

const { orders, loading, error, currentPage, totalPages, hasNextPage, hasPreviousPage, fetchOrders } = useOrders();

onMounted(async () => {
    await fetchOrders(1, 10);
});

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'badge-success';
        case 'pending': return 'badge-warning';
        case 'cancelled': return 'badge-danger';
        default: return 'bg-slate-200 text-slate-800';
    }
};
</script>

<template>
    <section class="max-w-5xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">My Orders</h2>

        <div v-if="loading" class="py-12">
            <LoaderComponent text="Caricamento ordini..." />
        </div>
        <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">{{ error }}</div>
        <div v-else-if="orders.length === 0"
            class="text-slate-500 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">
            You haven't placed any orders yet.
        </div>

        <div v-else class="space-y-4">
            <div v-for="order in orders" :key="order.id"
                class="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Ordine #{{ order.id.slice(0, 8) }}...</p>
                    <p class="font-bold text-lg text-slate-900 dark:text-white">&euro; {{ order.totalAmount }}</p>
                    <p class="text-sm mt-1 text-slate-600 dark:text-slate-400">
                        {{ new Date(order.createdAt).toLocaleDateString('it-IT', {
                            year: 'numeric', month: 'long', day:
                        'numeric' }) }}
                    </p>
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <span :class="['badge', getStatusColor(order.status)]">{{ order.status.toUpperCase() }}</span>
                    <router-link :to="`/orders/${order.id}`"
                        class="text-purple-600 hover:text-purple-800 font-medium ml-auto">
                        Details &rarr;
                    </router-link>
                </div>
            </div>

            <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" :hasNextPage="hasNextPage"
                :hasPreviousPage="hasPreviousPage" @prev="fetchOrders(currentPage - 1, 10)"
                @next="fetchOrders(currentPage + 1, 10)" />
        </div>
    </section>
</template>