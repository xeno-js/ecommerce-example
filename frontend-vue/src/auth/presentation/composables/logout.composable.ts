import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth/infrastructure'

export function useLogout() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
        await authStore.logout()
        if (!authStore.error) {
            await router.push({ name: 'Login' })
        }
    }

    return {
        loading: authStore.loading,
        error: authStore.error,
        handleLogout,
    }
}