import { Query, type Optional } from "@xeno-js/core";
import type { ProductDto } from "../../infrastructure/schemas/product.schema";

export class GetProductByIdQuery extends Query<Optional<ProductDto>> {
    constructor(public readonly id: string, cacheOpts?: {
        ttl?: number;
        bypassCache?: boolean;
        consistentRead?: boolean;
    }) {
        super('GET_PRODUCT_BY_ID', {
            ttl: cacheOpts?.ttl ?? 60 * 60 * 24,
            cacheKey: `product:${id}`,
            bypassCache: cacheOpts?.bypassCache ?? false,
            consistentRead: cacheOpts?.consistentRead ?? false,
            isUserScoped: false
        })
    }
}
