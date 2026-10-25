import { Command } from '@xeno-js/core';

export class AuthCallbackCommand extends Command<void> {
    constructor(public readonly code: string) { 
        super('AUTH_CALLBACK_HANDLER')
    }
}