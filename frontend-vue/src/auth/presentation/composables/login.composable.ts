import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth/infrastructure'

export function useLogin() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogin = async () => {
        await authStore.login()
        if (!authStore.error) {
            await router.push({ name: 'Login' })
        }
    }

    return {
        loading: authStore.loading,
        error: authStore.error,
        handleLogin,
    }
}