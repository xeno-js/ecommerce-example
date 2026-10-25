import { IEventHandler, IMediator, ResultType } from '@xeno-js/core';
import type { ProductReservedEvent, ProductReservationFailedEvent } from '../../domain';
import { ConfirmOrderCommand, DenyOrderCommand } from '../../../order';

export class ProductReservedListener implements IEventHandler<ProductReservedEvent> {
    public readonly eventType = 'PRODUCT_RESERVED';
    constructor(private readonly _mediator: IMediator) { }

    public async handle(event: ProductReservedEvent, signal?: AbortSignal): Promise<ResultType<void>> {
        const command = new ConfirmOrderCommand(event.payload.orderId);
        return await this._mediator.send(command, signal);
    }
}

export class ProductReservationFailedListener implements IEventHandler<ProductReservationFailedEvent> {
    public readonly eventType = 'PRODUCT_RESERVATION_FAILED';
    constructor(private readonly _mediator: IMediator) { }

    public async handle(event: ProductReservationFailedEvent, signal?: AbortSignal): Promise<ResultType<void>> {
        const command = new DenyOrderCommand(event.payload.orderId, event.payload.reason);
        return await this._mediator.send(command, signal);
    }
}