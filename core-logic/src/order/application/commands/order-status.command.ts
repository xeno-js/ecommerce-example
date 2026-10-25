import { Command } from '@xeno-js/core';

export class ConfirmOrderCommand extends Command<void> {
    constructor(public readonly orderId: string) {
        super('CONFIRM_ORDER_HANDLER', {
            patterns: ['*order*']
        }); }
}

export class DenyOrderCommand extends Command<void> {
    constructor(public readonly orderId: string, public readonly reason: string) {
        super('DENY_ORDER_HANDLER', {
            patterns: ['*order*']
        }); }
}