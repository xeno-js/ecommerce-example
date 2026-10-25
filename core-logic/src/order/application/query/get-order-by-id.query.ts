import { Optional, Query } from '@xeno-js/core';
import type { OrderDto } from '../../infrastructure/schema';

export class GetOrderByIdQuery extends Query<Optional<OrderDto>> {
    constructor(public readonly id: string) {
        super('GET_ORDER_BY_ID_HANDLER', {
            bypassCache: false,
            cacheKey: `order:${id}`,
            ttl: 60,
            isUserScoped: true,
            consistentRead: false
        });
    }
}