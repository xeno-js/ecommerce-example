import { IEventHandler, IMediator, ResultType, Result } from '@xeno-js/core';
import type { OrderCreatedEvent } from '../../domain';
import { ReserveStockCommand } from '../../../products';

export class OrderCreatedListener implements IEventHandler<OrderCreatedEvent> {
    public readonly eventType = 'ORDER_CREATED';
    constructor(private readonly _mediator: IMediator) { }

    public async handle(event: OrderCreatedEvent, signal?: AbortSignal): Promise<ResultType<void>> {
        for (const item of event.payload.items) {
            const command = new ReserveStockCommand(item.productId, event.aggregateId.toString(), item.quantity);
            const result = await this._mediator.send(command, signal);

            if (!result.isOk()) {
                return Result.fail(result.getErrorOrThrow());
            }
        }
        return Result.ok();
    }
}