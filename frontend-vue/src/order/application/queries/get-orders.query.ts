import { Query, type IPaginatedResult } from "@xeno-js/core";
import type { OrderDto } from "../../infrastructure";

export class GetOrdersQuery extends Query<IPaginatedResult<OrderDto>> {
    constructor(
        public readonly page: number = 1,
        public readonly pageSize: number = 10
    ) {
        super('GET_ORDERS', {
            bypassCache: false,
            cacheKey: `fe:orders:page:${page}:size:${pageSize}`,
            ttl: 60,
            isUserScoped: true,
            consistentRead: false
        });
    }
}