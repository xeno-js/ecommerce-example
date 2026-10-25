import { AppError, BaseHandler, IFactory, Optional, Result, ResultType, UserContext } from '@xeno-js/core';
import { GetOrderByIdQuery } from '../query/get-order-by-id.query';
import type { IOrderRepository } from '../../domain';
import type { OrderDto } from '../../infrastructure';
import type { OrderMapper } from '../mappers';

export class GetOrderByIdHandler extends BaseHandler<GetOrderByIdQuery, Optional<OrderDto>> {
    constructor(
        private readonly _orderRepository: IOrderRepository,
        private readonly _mapper: OrderMapper,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    protected async executeAsync(query: GetOrderByIdQuery, signal: AbortSignal): Promise<ResultType<Optional<OrderDto>>> {
        const ctx = this._getCurrentContext();
        if (!ctx.userId) return Result.fail(AppError.unauthorized('GetOrderByIdHandler', 'User context is missing'));

        const result = await this._orderRepository.findById(query.id, ctx, signal);
        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        const order = result.getValueOrThrow();
        if (!order) return Result.fail(AppError.notFound('GetOrderByIdHandler', 'Order not found'));

        if (order.getProps().userId !== ctx.userId.toString()) {
            return Result.fail(AppError.forbidden('GetOrderByIdHandler', 'Access denied to this order'));
        }

        return Result.ok(this._mapper.toDto(order));
    }
}