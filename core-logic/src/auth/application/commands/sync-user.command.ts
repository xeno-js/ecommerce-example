import { Command } from '@xeno-js/core';
import { AuthModel } from '../models/auth.model';

export class AuthSyncCommand extends Command<void> {
    constructor(public readonly props: AuthModel) { 
        super('AUTH_SYNC_HANDLER')
    }
}