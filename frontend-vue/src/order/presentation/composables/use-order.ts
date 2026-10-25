import { ref } from 'vue';
import { ServicesUtils } from '@xeno-js/vue';
import { GetOrdersQuery, GetOrderByIdQuery } from '../../application';
import type { OrderDto } from '../../infrastructure';
import type { Optional, IPaginatedResult } from '@xeno-js/core';
import { getFriendlyError } from '@/commons/shared/utils/error.utils';

export function useOrders() {
    const orders = ref<OrderDto[]>([]);
    const order = ref<Optional<OrderDto>>(undefined);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const hasNextPage = ref(false);
    const hasPreviousPage = ref(false);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchOrders(page: number = 1, size: number = 10) {
        loading.value = true;
        error.value = null;
        orders.value = [];

        const { mediator } = ServicesUtils.useApp();
        const query = new GetOrdersQuery(page, size);
        const result = await mediator.query<IPaginatedResult<OrderDto>>(query);

        if (result.isOk()) {
            const data = result.getValueOrThrow();
            const items = data?.items.map(o => o)
            orders.value = items ?? [];
            currentPage.value = data?.page ?? page;
            totalPages.value = data?.totalPages ?? 1;
            hasNextPage.value = Boolean(data?.hasNextPage);
            hasPreviousPage.value = Boolean(data?.hasPreviousPage);
        } else {
            error.value = getFriendlyError(result.getErrorOrThrow().message);
        }
        loading.value = false;
    }

    async function fetchOrderById(id: string) {
        loading.value = true;
        error.value = null;
        order.value = undefined;

        const { mediator } = ServicesUtils.useApp();
        const query = new GetOrderByIdQuery(id);
        const result = await mediator.query<Optional<OrderDto>>(query);

        if (result.isOk()) {
            order.value = result.getValueOrThrow();
        } else {
            error.value = getFriendlyError(result.getErrorOrThrow().message);
        }
        loading.value = false;
    }

    return {
        orders, order, loading, error,
        currentPage, totalPages, hasNextPage, hasPreviousPage,
        fetchOrders, fetchOrderById
    };
}