import type { IDomainEvent, UniqueId } from '@xeno-js/core';

export interface ProductReservedPayload {
    orderId: string;
    productId: string;
    quantity: number;
}

export interface ProductReservationFailedPayload {
    orderId: string;
    productId: string;
    reason: string;
}

export type ProductDomainEventPayload = ProductReservedPayload | ProductReservationFailedPayload;

export class ProductReservedEvent implements IDomainEvent<ProductReservedPayload, 'Product'> {
    public readonly eventType = 'PRODUCT_RESERVED';
    public readonly aggregateType = 'Product';
    public readonly destination = 'product'; // Match con il nome outbox nel bootstrap

    constructor(
        public readonly aggregateId: UniqueId<'Product'>,
        public readonly version: number,
        public readonly occurredAt: Date,
        public readonly payload: ProductReservedPayload
    ) { }
}

export class ProductReservationFailedEvent implements IDomainEvent<ProductReservationFailedPayload, 'Product'> {
    public readonly eventType = 'PRODUCT_RESERVATION_FAILED';
    public readonly aggregateType = 'Product';
    public readonly destination = 'product'; // Match con il nome outbox nel bootstrap

    constructor(
        public readonly aggregateId: UniqueId<'Product'>,
        public readonly version: number,
        public readonly occurredAt: Date,
        public readonly payload: ProductReservationFailedPayload
    ) { }
}