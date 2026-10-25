import { Query, Optional } from '@xeno-js/core';
import { ProductDto } from '../../infrastructure';

export class GetProductByIdQuery extends Query<Optional<ProductDto>> {
    constructor(public readonly id: string) {
        super(
            'GET_PRODUCT_BY_ID_HANDLER', 
            { 
                bypassCache: false, 
                cacheKey: `product:${id}`,
                ttl: 60 * 60 * 24, 
                isUserScoped: false,
                consistentRead: false
            }
        );
    }
}
