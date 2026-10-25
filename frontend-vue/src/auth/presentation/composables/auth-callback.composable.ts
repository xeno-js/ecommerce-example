import { onMounted } from 'vue'
import { useAuthStore } from '@/auth/infrastructure'

export function useAuthCallback() {
    const authStore = useAuthStore()

    onMounted(async () => {
        if (authStore.isAuthenticated && !authStore.loading && !authStore.isSynced) {
            await authStore.syncUser()
        }
    })

    return {
        loading: authStore.loading,
        error: authStore.error
    }
}