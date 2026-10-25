import { Command } from '@xeno-js/core';
export class ReserveStockCommand extends Command<void> {
    constructor(
        public readonly productId: string,
        public readonly orderId: string,
        public readonly quantity: number
    ) {
        super('RESERVE_STOCK_HANDLER', {
            patterns: ['*product*']
        });
    }
}