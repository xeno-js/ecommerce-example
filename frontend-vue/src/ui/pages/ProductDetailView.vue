<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/products'
import { useCartStore } from '@/cart/cart.store'
import ButtonComponent from '@/ui/components/ButtonComponent.vue'
import LoaderComponent from '../components/LoaderComponent.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

const { product, loading, error, fetchProductById } = useProducts()
const cartStore = useCartStore()

onMounted(async () => {
    if (productId) {
        await fetchProductById(productId)
    }
})

const addToCart = () => {
    if (product.value) {
        cartStore.addItem({
            id: product.value.id,
            name: product.value.name,
            price: product.value.price,
            imageUrl: product.value.imageUrl
        })
    }
}
</script>

<template>
    <main class="max-w-4xl mx-auto px-4 py-8">
        <button @click="router.push({ name: 'Products' })"
            class="text-purple-600 dark:text-purple-400 font-medium hover:underline mb-6 flex items-center gap-1 cursor-pointer">
            &larr; Back to product catalog
        </button>

        <div v-if="loading" class="py-8">
            <LoaderComponent text="Loading products details..." />
        </div>
        <div v-if="error" class="text-red-600">{{ error }}</div>

        <div v-if="!loading && product"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
            <div v-if="product.imageUrl"
                class="w-full h-80 overflow-hidden rounded-lg mb-6 bg-slate-100 dark:bg-slate-700">
                <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">{{ product.name }}</h1>
            <p class="text-slate-600 dark:text-slate-300 text-lg mb-6">{{ product.description || 'Nessuna descrizione disponibile.' }}</p>

            <div class="flex justify-between items-center my-6 py-4 border-y border-slate-200 dark:border-slate-700">
                <span class="text-3xl font-bold text-purple-600 dark:text-purple-400">&euro; {{ product.price }}</span>
                <span class="font-medium text-slate-700 dark:text-slate-300">Available: {{ product.stock }}
                    unit</span>
            </div>

            <div class="mb-6">
                <ButtonComponent type="primary" @click="addToCart" class="w-full sm:w-auto px-8 py-3">
                    Add to Cart
                </ButtonComponent>
            </div>

            <div class="text-slate-400 text-xs">
                <small>Created at: {{ new Date(product.createdAt).toLocaleDateString() }}</small>
            </div>
        </div>

        <div v-if="!loading && !product && !error" class="text-slate-500">
            Product not found.
        </div>
    </main>
</template>