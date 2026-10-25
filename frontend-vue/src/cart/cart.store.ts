import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface CartItem {
    productId: string
    name: string
    price: number
    quantity: number
    imageUrl?: string
}

export const useCartStore = defineStore('cart', () => {
    const storedCart = localStorage.getItem('xeno_cart')
    const items = ref<CartItem[]>(storedCart ? JSON.parse(storedCart) : [])

    watch(
        items,
        (newItems) => {
            localStorage.setItem('xeno_cart', JSON.stringify(newItems))
        },
        { deep: true }
    )

    function addItem(product: { id: string; name: string; price: string | number; imageUrl?: string }) {
        const existing = items.value.find(i => i.productId === product.id)
        if (existing) {
            existing.quantity++
        } else {
            items.value.push({
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: 1,
                imageUrl: product.imageUrl
            })
        }
    }

    function removeItem(productId: string) {
        items.value = items.value.filter(i => i.productId !== productId)
    }

    function clearCart() {
        items.value = []
        localStorage.removeItem('xeno_cart')
    }

    return { items, addItem, removeItem, clearCart }
})