import { BaseHandler, IFactory, Result, ResultType, UserContext, AppError } from '@xeno-js/core';
import { ConfirmOrderCommand } from '../commands';
import { IOrderRepository } from '../../domain';

export class ConfirmOrderHandler extends BaseHandler<ConfirmOrderCommand, void> {
    constructor(
        private readonly _orderRepository: IOrderRepository,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(command: ConfirmOrderCommand, signal: AbortSignal): Promise<ResultType<void>> {
        const ctx = this._getCurrentContext();
        const result = await this._orderRepository.findById(command.orderId, ctx, signal);
        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        const order = result.getValueOrThrow();
        if (!order) return Result.fail(AppError.notFound('ConfirmOrder', 'Order not found'));

        order.confirm();
        return await this._orderRepository.update(order.id.toString(), order, ctx, signal);
    }
}