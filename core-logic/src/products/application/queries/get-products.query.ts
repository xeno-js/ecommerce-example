import { IPaginatedResult, Query } from '@xeno-js/core';
import { ProductDto } from '../../infrastructure';

export class GetProductsQuery extends Query<IPaginatedResult<ProductDto>> {
    constructor(
        public readonly page: number = 1,
        public readonly pageSize: number = 20
    ) {
        super(
            'GET_PRODUCTS_HANDLER',
            {
                bypassCache: false,
                cacheKey: `products:page:${page}:size:${pageSize}`,
                ttl: 60 * 60,
                isUserScoped: false,
                consistentRead: false
            }
        );
    }
}