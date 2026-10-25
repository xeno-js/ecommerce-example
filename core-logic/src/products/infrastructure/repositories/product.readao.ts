import { AppError, IPaginatedResult, IUnitOfWork, Optional, Repository, Result, ResultType, UserContext } from '@xeno-js/core';
import { eq } from 'drizzle-orm'

import { ProductDto, products } from '../schemas';
import { ProductMapper } from '../../application';
import { IProductRepository, IProductDataSource, Product } from '../../domain';
import { DbContext } from '@xeno-js/postgresql';
import { DbSchema } from '@/schema';

export class ProductRepository extends Repository<Product, ProductDto> implements IProductRepository {
    constructor(
        protected readonly _dataSource: IProductDataSource,
        _productMapper: ProductMapper,
        protected readonly _uow: IUnitOfWork<DbContext<DbSchema>>
    ) {
        super(_dataSource, _productMapper);
    }

    public async findPaginated(page: number, pageSize: number, signal: Optional<AbortSignal>): Promise<ResultType<IPaginatedResult<ProductDto>>> {
        const paginatedResult = await this._dataSource.findPaginated(page, pageSize, signal);

        return Result.ok(paginatedResult);
    }

    public async findAllByIdArray(id: string[], signal: Optional<AbortSignal>): Promise<ResultType<Product[]>> {
        const products = await this._dataSource.findAllByIdArray(id, signal);
        return Result.ok(products.map(p => this._mapper.toEntity(p)));
    }

    public override async update(id: string | number, entity: Partial<Product> | Product, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        AppError.throwIfAborted(signal, 'ProductRepository.update');
        const fullEntity = entity as Product;
        const dto = this._mapper.toPartialDto(fullEntity);

        await this._uow.runInTransaction(async (tx) => {
            await tx.update(products).set(dto).where(eq(products.id, String(id))).execute();
        }, fullEntity, signal);

        return Result.ok();
    }
}
