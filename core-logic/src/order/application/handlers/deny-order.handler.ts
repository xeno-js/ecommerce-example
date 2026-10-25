import { BaseHandler, IFactory, Result, ResultType, UserContext, AppError } from '@xeno-js/core';
import { DenyOrderCommand } from '../commands';
import { IOrderRepository } from '../../domain';

export class DenyOrderHandler extends BaseHandler<DenyOrderCommand, void> {
    constructor(
        private readonly _orderRepository: IOrderRepository,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(command: DenyOrderCommand, signal: AbortSignal): Promise<ResultType<void>> {
        const ctx = this._getCurrentContext();
        const result = await this._orderRepository.findById(command.orderId, ctx, signal);
        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        const order = result.getValueOrThrow();
        if (!order) return Result.fail(AppError.notFound('DenyOrder', 'Order not found'));

        order.deny(command.reason);
        return await this._orderRepository.update(order.id.toString(), order, ctx, signal);
    }
}