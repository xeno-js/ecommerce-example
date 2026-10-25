import type { IRepository, Optional, ResultType, UserContext } from '@xeno-js/core';
import type { Order } from '../order.entity';

export interface IOrderRepository extends IRepository<Order> {
    findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<Order[]>>;
}