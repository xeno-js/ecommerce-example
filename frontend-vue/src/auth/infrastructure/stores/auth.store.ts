import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GUEST, Guards } from '@xeno-js/core'
import type { Identity, Optional } from '@xeno-js/core'
import { CheckQuerySession, LogoutCommand, SyncUserCommand } from '@/auth/application'
import { LoginCommand } from '@/auth/application/command/login.command'
import { ServicesUtils } from '@xeno-js/vue'
import { getFriendlyError } from '@/commons/shared/utils/error.utils'

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const identity = ref<Optional<Identity>>(undefined)
    const isSessionChecked = ref(false)
    const isSynced = ref(false)

    const isAuthenticated = computed(() => Guards.isDefined(identity.value) && identity.value !== GUEST as unknown as Identity)

    async function checkSession(): Promise<void> {
        loading.value = true;
        const { mediator, requestContext } = ServicesUtils.useApp()

        const query = new CheckQuerySession()
        const result = await mediator.query<Identity & { isAuthenticated: boolean }>(query)

        console.log(result)
        if (result.isOk()) {
            const data = result.getValueOrThrow()

            if (data?.isAuthenticated) {
                identity.value = data
                requestContext.updateIdentity(data)
            }
        }
        if (!result.isOk())
            error.value = getFriendlyError(result.getErrorOrThrow().message)

        isSessionChecked.value = true
        loading.value = false
    }

    async function syncUser(): Promise<void> {
        if (!isAuthenticated.value) return;

        loading.value = true
        error.value = null

        const { mediator } = ServicesUtils.useApp()

        const command = new SyncUserCommand()
        const result = await mediator.send(command)

        if (!result.isOk())
            error.value = getFriendlyError(result.getErrorOrThrow().message)
        else
            isSynced.value = true

        loading.value = false
    }

    async function login(): Promise<void> {
        loading.value = true
        error.value = null

        const { mediator } = ServicesUtils.useApp()

        const command = new LoginCommand('google')
        const response = await mediator.send<{ url: string }>(command)

        if (response.isOk() && Guards.isDefined(response.getValueOrThrow())) {
            const data = response.getValueOrThrow();

            window.location.href = data!.url;
        } else
            error.value = response.getErrorOrThrow().message

        loading.value = false
    }

    async function logout(): Promise<void> {
        loading.value = true;
        error.value = null

        const { mediator } = ServicesUtils.useApp()

        const command = new LogoutCommand()
        const result = await mediator.send(command)

        identity.value = undefined
        isSessionChecked.value = false;
        if (!result.isOk())
            error.value = getFriendlyError(result.getErrorOrThrow().message)

        loading.value = false
    }

    return {
        loading, error, identity, isSessionChecked, isAuthenticated, isSynced,
        checkSession, syncUser, logout, login
    }
})
