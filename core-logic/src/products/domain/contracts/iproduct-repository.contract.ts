import type { IPaginatedResult, IRepository, Optional, ResultType } from '@xeno-js/core';
import type { Product } from '../entities/product.entity';
import { ProductDto } from '../../infrastructure';

export interface IProductRepository extends IRepository<Product> {
    findPaginated(page: number, pageSize: number, signal: Optional<AbortSignal>): Promise<ResultType<IPaginatedResult<ProductDto>>>
    findAllByIdArray(id: string[], signal: Optional<AbortSignal>): Promise<ResultType<Product[]>>
}