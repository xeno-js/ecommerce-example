import { Command } from '@xeno-js/core';

export class AuthLogoutCommand extends Command<void> {
    constructor() {
        super('AUTH_LOGOUT_HANDLER')
    }
}