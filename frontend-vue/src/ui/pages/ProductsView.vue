<script setup lang="ts">
import { useProducts } from '@/products';
import { useCartStore } from '@/cart/cart.store';
import { onMounted } from 'vue';
import PaginationComponent from '@/ui/components/PaginationComponent.vue';
import ButtonComponent from '@/ui/components/ButtonComponent.vue';
import LoaderComponent from '@/ui/components/LoaderComponent.vue';

const {
    products,
    loading,
    error,
    fetchProducts,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage
} = useProducts();

const cartStore = useCartStore();

onMounted(async () => {
    await fetchProducts(1, 10);
});

const addToCart = (item: any) => {
    cartStore.addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
    });
};
</script>

<template>
    <main class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Product Catalog</h1>

        <!-- Stato di Caricamento -->
        <div v-if="loading" class="py-16 flex justify-center">
            <LoaderComponent text="Caricamento prodotti in corso..." />
        </div>

        <!-- Stato di Errore -->
        <div v-else-if="error"
            class="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-medium rounded-lg">
            {{ error }}
        </div>

        <!-- Stato Vuoto -->
        <div v-else-if="products.length === 0" class="text-slate-500 py-8 text-center">
            No products available at the moment. (Try seeding the database!)
        </div>

        <!-- Griglia Prodotti -->
        <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="item in products" :key="item.id"
                    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div v-if="item.imageUrl"
                            class="w-full h-40 overflow-hidden rounded-lg mb-4 bg-slate-100 dark:bg-slate-700">
                            <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover"
                                loading="lazy" />
                        </div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">{{ item.name }}</h3>
                        <p class="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{{ item.description }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">&euro; {{ item.price }}
                        </p>
                        <div class="flex gap-2 items-center">
                            <router-link :to="`/products/${item.id}`" class="flex-1">
                                <ButtonComponent type="secondary" class="w-full text-sm">Details</ButtonComponent>
                            </router-link>
                            <ButtonComponent type="primary" class="flex-1 text-sm" @click="addToCart(item)">
                                Buy now
                            </ButtonComponent>
                        </div>
                    </div>
                </div>
            </div>

            <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" :hasNextPage="hasNextPage"
                :hasPreviousPage="hasPreviousPage" @prev="fetchProducts(currentPage - 1, 10)"
                @next="fetchProducts(currentPage + 1, 10)" />
        </div>
    </main>
</template>