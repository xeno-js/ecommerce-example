import type { IUnitOfWork, Optional, ResultType, UserContext } from '@xeno-js/core';
import { AppError, Repository, Result } from '@xeno-js/core';
import { DbContext } from '@xeno-js/postgresql';
import {eq } from 'drizzle-orm'

import { DbSchema } from '@/schema';

import { OrderDto, orders } from '../schema';
import type { OrderMapper } from '../../application';
import type { IOrderDataSource, IOrderRepository, Order } from '../../domain';

export class OrderRepository extends Repository<Order, OrderDto> implements IOrderRepository {
    constructor(
        private readonly _orderDataSource: IOrderDataSource,
        private readonly _orderMapper: OrderMapper,
        private readonly _uow: IUnitOfWork<DbContext<DbSchema>>
    ) {
        super(_orderDataSource, _orderMapper);
    }

    public async findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<Order[]>> {
        AppError.throwIfAborted(signal, 'OrderRepository.findByUserId');
        const dtos = await this._orderDataSource.findByUserId(userId, ctx, signal);
        const entities = dtos.map(dto => this._orderMapper.toEntity(dto));
        return Result.ok(entities);
    }

    public override async save(entity: Order, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        AppError.throwIfAborted(signal, 'OrderRepository.save');
        const dto = this._mapper.toDto(entity);

        await this._uow.runInTransaction(
            async (tx) => {
                await tx.insert(orders).values(dto).execute();
            },
            entity,
            signal
        );

        return Result.ok();
    }

    public override async update(id: string | number, entity: Partial<Order> | Order, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        AppError.throwIfAborted(signal, 'OrderRepository.update');
        const fullEntity = entity as Order;
        const dto = this._mapper.toPartialDto(fullEntity);

        await this._uow.runInTransaction(async (tx) => {
            await tx.update(orders).set(dto).where(eq(orders.id, String(id))).execute();
        }, fullEntity, signal);

        return Result.ok();
    }
}