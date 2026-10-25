import type { IDomainEvent } from '@xeno-js/core';
import type { UniqueId } from '@xeno-js/core';
import type { OrderItemProps } from '../order.entity';

export interface OrderCreatedPayload {
    userId: string;
    tenantId: string | null;
    totalAmount: number;
    items: OrderItemProps[];
}

export class OrderCreatedEvent implements IDomainEvent<OrderCreatedPayload, 'Order'> {
    public readonly eventType = 'ORDER_CREATED';
    public readonly aggregateType = 'Order';
    public readonly destination = 'order-queue'; // Opzionale o basato sulle tue code

    constructor(
        public readonly aggregateId: UniqueId<'Order'>,
        public readonly version: number,
        public readonly occurredAt: Date,
        public readonly payload: OrderCreatedPayload
    ) { }
}