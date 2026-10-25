import { Query, type Optional } from "@xeno-js/core";
import type { OrderDto } from "../../infrastructure";

export class GetOrderByIdQuery extends Query<Optional<OrderDto>> {
    constructor(public readonly id: string) {
        super('GET_ORDER_BY_ID', {
            bypassCache: false,
            cacheKey: `fe:order:${id}`,
            ttl: 60,
            isUserScoped: true,
            consistentRead: false
        });
    }
}