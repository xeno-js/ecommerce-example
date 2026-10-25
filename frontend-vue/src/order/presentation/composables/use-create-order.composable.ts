import { ref } from 'vue';
import { ServicesUtils } from '@xeno-js/vue';
import { CreateOrderCommand, type CreateOrderPayload } from '../../application';
import { getFriendlyError } from '@/commons/shared/utils/error.utils';

export function useCreateOrder() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function createOrder(items: CreateOrderPayload['items']): Promise<boolean> {
        loading.value = true;
        error.value = null;

        const { mediator } = ServicesUtils.useApp();
        const command = new CreateOrderCommand(items);
        const result = await mediator.send(command);

        if (!result.isOk()) {
            error.value = getFriendlyError(result.getErrorOrThrow().message);
            loading.value = false;
            return false;
        }

        loading.value = false;
        return true;
    }

    return { loading, error, createOrder };
}