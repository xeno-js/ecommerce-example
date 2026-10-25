import { OrderDto } from '../../infrastructure';
import type { IWriteDataSource, Optional, UserContext, IPaginatedResult } from '@xeno-js/core';

export interface IOrderDataSource extends IWriteDataSource<OrderDto> {
    findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<OrderDto[]>;
    findPaginatedByUserId(userId: string, page: number, pageSize: number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<IPaginatedResult<OrderDto>>;
}