<script setup lang="ts">
import { useCartStore } from '@/cart/cart.store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth'
import { useCreateOrder } from '@/order'
import { useProducts } from '@/products'
import ButtonComponent from '@/ui/components/ButtonComponent.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const productsStore = useProducts()
const router = useRouter()
const { createOrder, loading, error } = useCreateOrder()

const items = computed(() => cartStore.items)
const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
})

const handleCheckout = async () => {
    if (!authStore.isAuthenticated) {
        router.push({ name: 'Login' })
        return
    }

    const payloadItems = items.value.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }))

    const success = await createOrder(payloadItems)

    if (success) {
        cartStore.clearCart()
        payloadItems.map(prod => productsStore.fetchProductById(prod.productId, { bypassCache: true }))
        router.push({ name: 'Dashboard' })
    }
}
</script>

<template>
    <main class="max-w-5xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Your Cart</h1>

        <div v-if="items.length === 0" class="text-slate-500 dark:text-slate-400">
            The cart is empty.
            <router-link to="/products" class="text-purple-600 underline">got to products catalog</router-link>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div class="lg:col-span-2 flex flex-col gap-4">
                <div v-for="item in items" :key="item.productId"
                    class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm gap-4">
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name"
                        class="w-16 h-16 object-cover rounded-lg bg-slate-100" />
                    <div class="flex-grow">
                        <h3 class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</h3>
                        <p class="text-purple-600 dark:text-purple-400 font-bold">&euro; {{ item.price }} x {{
                            item.quantity }}</p>
                    </div>
                    <button @click="cartStore.removeItem(item.productId)"
                        class="text-red-500 hover:text-red-700 text-2xl font-bold p-2">
                        &times;
                    </button>
                </div>
            </div>

            <div
                class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm h-fit">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>

                <div class="flex justify-between text-lg font-bold my-4 text-slate-900 dark:text-white">
                    <span>Tot:</span>
                    <span class="text-purple-600 dark:text-purple-400">&euro; {{ totalPrice }}</span>
                </div>

                <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {{ error }}
                </div>

                <ButtonComponent type="primary" :disabled="loading || items.length === 0" @click="handleCheckout"
                    class="w-full">
                    <span v-if="loading" class="flex items-center gap-2 justify-center">
                        <i class="bi bi-arrow-repeat animate-spin"></i> Processing...
                    </span>
                    <span v-else>Place Order</span>
                </ButtonComponent>
            </div>
        </div>
    </main>
</template>