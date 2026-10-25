import { BaseHandler, IFactory, UserContext, ResultType, IPaginatedResult } from '@xeno-js/core';
import { GetProductsQuery } from '../queries';
import { IProductRepository } from '../../domain';
import { ProductMapper } from '../mappers';
import { ProductDto } from '../../infrastructure';

export class GetProductsHandler extends BaseHandler<GetProductsQuery, IPaginatedResult<ProductDto>> {
    constructor(
        private readonly _productReadDao: IProductRepository,
        private readonly _mapper: ProductMapper,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(query: GetProductsQuery, signal: AbortSignal): Promise<ResultType<IPaginatedResult<ProductDto>>> {
        return await this._productReadDao.findPaginated(query.page, query.pageSize, signal);
    }
}
