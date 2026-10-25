import { AggregateRoot, Guards, IDomainEvent, Nullable } from '@xeno-js/core';
import { StockValueObject } from '../value_objects/stock.value-object';
import type { ProductDomainEventPayload, ProductReservationFailedPayload, ProductReservedPayload } from '../events/product.events';

export interface ProductProps {
    name: string;
    description: Nullable<string>;
    price: number;
    stock: number;
    imageUrl: Nullable<string>;
    createdAt: Nullable<Date>;
    updatedAt: Nullable<Date>;
    deletedAt: Nullable<Date>;
    isDeleted: boolean;
}

export class Product extends AggregateRoot<ProductProps, ProductDomainEventPayload, 'Product'> {
    private constructor(props: ProductProps, id?: string) {
        super(props, id);
    }

    public static fromProps(props: ProductProps, id?: string): Product {
        return new Product(props, id);
    }

    /**
     * Tenta di riservare la quantità di prodotto per un ordine.
     * Genera l'evento corrispondente in base alla disponibilità.
     */
    public reserveForOrder(orderId: string, quantity: number): void {
        const props = this.getProps()
        const stockVO = StockValueObject.create(props.stock);

        if (stockVO.hasEnough(quantity)) {
            // C'è stock: Emettiamo l'evento di successo
            this.raise({
                eventType: 'PRODUCT_RESERVED',
                aggregateType: 'Product',
                destination: 'product',
                payload: {
                    orderId,
                    productId: this.id.toString(),
                    quantity
                } as ProductReservedPayload
            });
        } else {
            // Niente stock: Emettiamo l'evento di rifiuto
            this.raise({
                eventType: 'PRODUCT_RESERVATION_FAILED',
                aggregateType: 'Product',
                destination: 'product',
                payload: {
                    orderId,
                    productId: this.id.toString(),
                    reason: `Stock insufficiente per il prodotto ${props.name}. Richiesti: ${quantity}, Disponibili: ${props.stock}`
                } as ProductReservationFailedPayload
            });
        }
    }

    protected apply(event: IDomainEvent<ProductDomainEventPayload, 'Product'>, isNew: boolean): void {
        switch (event.eventType) {
            case 'PRODUCT_RESERVED': {
                const props = this.getProps()
                const payload = event.payload as ProductReservedPayload;
                const stockVO = StockValueObject.create(props.stock);

                this.setProps({
                    ...props,
                    stock: stockVO.decrease(payload.quantity).getQuantity(),
                    updatedAt: event.occurredAt
                });
                break;
            }
            case 'PRODUCT_RESERVATION_FAILED': {
                this.setProps({
                    ...this.getProps(),
                    updatedAt: event.occurredAt
                });
                break;
            }
        }
    }
}