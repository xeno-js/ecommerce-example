import { ValueObject, AppError } from '@xeno-js/core';
import { OrderItemProps } from '../order.entity';

export class OrderItemValueObject extends ValueObject<OrderItemProps> {
    private constructor(props: OrderItemProps) {
        if (props.price <= 0) {
            throw AppError.validationError('OrderItem', 'Price must be greater than zero.');
        }
        if (props.quantity <= 0) {
            throw AppError.validationError('OrderItem', 'Quantity must be at least 1.');
        }
        super(props);
    }

    public static create(props: OrderItemProps): OrderItemValueObject {
        return new OrderItemValueObject(props);
    }

    public getSubtotal(): number {
        return this._props.price * this._props.quantity;
    }
}