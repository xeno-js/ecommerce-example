import { Query, type IPaginatedResult } from "@xeno-js/core";
import type { ProductDto } from "../../infrastructure/schemas/product.schema.ts"; // o il DTO condiviso

export class GetProductsQuery extends Query<IPaginatedResult<ProductDto>> {
    constructor(
        public readonly page: number = 1,
        public readonly pageSize: number = 20,
        cacheOpts?: {
            ttl?: number;
            bypassCache?: boolean;
            consistentRead?: boolean;
        }
    ) {
        super(
            'GET_PRODUCTS',
            {
                bypassCache: cacheOpts?.bypassCache ?? false,
                cacheKey: `products:page:${page}:size:${pageSize}`,
                ttl: cacheOpts?.ttl ?? 60 * 60,
                isUserScoped: false,
                consistentRead: cacheOpts?.consistentRead ?? false
            }
        );
    }
}