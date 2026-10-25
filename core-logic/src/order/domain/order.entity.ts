import { AppError, Guards, IDomainEvent, Nullable, UniqueId } from '@xeno-js/core';
import { AggregateRoot } from '@xeno-js/core';
import { OrderCreatedPayload } from './events/order.event';
import { OrderItemValueObject } from './value_object/order-item.value-object';

export const OrderStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    CREATED: 'created',
}

export interface OrderItemProps {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderProps {
    userId: string;
    tenantId: Nullable<string>;
    totalAmount: number;
    items: OrderItemProps[];
    status: string;
    createdAt: Nullable<Date>;
    updatedAt: Nullable<Date>;
    deletedAt: Nullable<Date>;
    isDeleted: boolean;
}

export class Order extends AggregateRoot<OrderProps, OrderCreatedPayload, 'Order'> {
    private constructor(props: OrderProps, id?: string) {
        super(props, id);
    }

    public static fromProps(props: OrderProps, id?: string): Order {
        return new Order(props, id);
    }

    public static create(props: {
        id?: string;
        userId: string;
        tenantId: Nullable<string>;
        items: OrderItemProps[];
    }): Order {
        if (Guards.isNullOrEmpty(props.items)) {
            throw AppError.validationError('Order', 'At least one item is required to create an order.');
        }

        let calculatedTotal = 0;
        const verifiedItems = props.items.map(item => {
            const vo = OrderItemValueObject.create(item);
            calculatedTotal += vo.getSubtotal();
            return vo.getValue();
        });

        const now = new Date();
        const orderProps: OrderProps = {
            userId: props.userId,
            tenantId: props.tenantId,
            totalAmount: calculatedTotal,
            items: verifiedItems,
            status: OrderStatus.PENDING,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            isDeleted: false,
        };

        const order = new Order(orderProps, props.id);

        order.raise({
            eventType: 'ORDER_CREATED',
            aggregateType: 'Order',
            destination: 'order-queue',
            payload: {
                userId: orderProps.userId,
                tenantId: orderProps.tenantId,
                totalAmount: orderProps.totalAmount,
                items: orderProps.items,
            },
        });

        return order;
    }

    public confirm(): void {
        this.setProps({
            ...this.getProps(),
            status: OrderStatus.COMPLETED,
            updatedAt: new Date()
        });
    }

    public deny(reason: string): void {
        this.setProps({
            ...this.getProps(),
            status: OrderStatus.CANCELLED,
            updatedAt: new Date()
        });
        console.warn(`[Order ${this.id.toString()}] Denied: ${reason}`);
    }

    protected apply(event: IDomainEvent<OrderCreatedPayload, 'Order'>, isNew: boolean): void {
        switch (event.eventType) {
            case 'ORDER_CREATED':
                this.setProps({
                    userId: event.payload.userId,
                    tenantId: event.payload.tenantId,
                    totalAmount: event.payload.totalAmount,
                    items: event.payload.items,
                    createdAt: event.occurredAt,
                    updatedAt: event.occurredAt,
                    status: OrderStatus.CREATED,
                    deletedAt: null,
                    isDeleted: false,
                });
                break;
        }
    }

    public isInactive(): boolean {
        const props = this.getProps()
        return props.isDeleted || Guards.isDefined(props.deletedAt);
    }
}