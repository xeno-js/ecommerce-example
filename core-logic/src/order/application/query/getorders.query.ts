import { IPaginatedResult, Query } from '@xeno-js/core';
import type { OrderDto } from '../../infrastructure/schema';

export class GetOrdersQuery extends Query<IPaginatedResult<OrderDto>> {
    constructor(
        public readonly page: number = 1,
        public readonly pageSize: number = 10
    ) {
        super('GET_ORDERS_HANDLER', {
            bypassCache: false,
            cacheKey: `orders:page:${page}:size:${pageSize}`,
            ttl: 60,
            isUserScoped: true,
            consistentRead: false
        });
    }
}