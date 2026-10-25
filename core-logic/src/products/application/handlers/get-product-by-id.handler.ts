import { BaseHandler, IFactory, UserContext, Result, ResultType, Optional, AppError } from '@xeno-js/core';
import { GetProductByIdQuery } from '../queries';
import { IProductRepository } from '../../domain';
import { ProductMapper } from '../mappers';
import { ProductDto } from '../../infrastructure';

export class GetProductByIdHandler extends BaseHandler<GetProductByIdQuery, Optional<ProductDto>> {
    constructor(
        private readonly _productReadDao: IProductRepository,
        private readonly _mapper: ProductMapper,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(query: GetProductByIdQuery, signal: AbortSignal): Promise<ResultType<Optional<ProductDto>>> {
        const ctx = this._getCurrentContext();
        const result = await this._productReadDao.findById(query.id, ctx, signal);

        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        const product = result.getValueOrThrow();
        if (!product) return Result.fail(AppError.notFound('GetProductById', 'Product not found'));

        return Result.ok(this._mapper.toDto(product));
    }
}
