import type { IPaginatedResult, IWriteDataSource, Optional } from '@xeno-js/core';
import { ProductDto } from '../../infrastructure/schemas/product.schema';

export interface IProductDataSource extends IWriteDataSource<ProductDto> {
    findPaginated(page: number, pageSize: number, signal: Optional<AbortSignal>): Promise<IPaginatedResult<ProductDto>>
    findAllByIdArray(id: string[], signal: Optional<AbortSignal>): Promise<ProductDto[]>
}