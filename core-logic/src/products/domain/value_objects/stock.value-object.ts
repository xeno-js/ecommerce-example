import { ValueObject, AppError } from '@xeno-js/core';

export interface StockProps {
    quantity: number;
}

export class StockValueObject extends ValueObject<StockProps> {
    private constructor(props: StockProps) {
        if (props.quantity < 0) {
            throw AppError.validationError('Stock', 'La quantità in stock non può essere negativa.');
        }
        super(props);
    }

    public static create(quantity: number): StockValueObject {
        return new StockValueObject({ quantity });
    }

    public getQuantity(): number {
        return this._props.quantity;
    }

    public hasEnough(amount: number): boolean {
        return this._props.quantity >= amount;
    }

    public decrease(amount: number): StockValueObject {
        if (!this.hasEnough(amount)) {
            throw AppError.validationError('Stock', 'Quantità non disponibile per la sottrazione.');
        }
        return new StockValueObject({ quantity: this._props.quantity - amount });
    }
}