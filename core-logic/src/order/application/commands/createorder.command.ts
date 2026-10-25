import { Command } from '@xeno-js/core';

export interface CreateOrderPayload { 
    items: { productId: string; name: string; price: number; quantity: number }[];
}

export class CreateOrderCommand extends Command<void> {
    constructor(
        public readonly items: CreateOrderPayload['items']
    ) {
        super('CREATE_ORDER_HANDLER', {
            keys: ['products', 'order'],
            patterns: ['*product*', '*order*'],
        });
    }
}
