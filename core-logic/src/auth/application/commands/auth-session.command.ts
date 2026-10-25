// src/auth/application/commands/auth-session.command.ts
import type { Identity, Optional } from '@xeno-js/core';
import { Command } from '@xeno-js/core';
import { AuthSessionResponse } from '../models/auth-session.model';

export class AuthSessionCommand extends Command<AuthSessionResponse> {
    constructor(public readonly identity: Optional<Identity>) {
        super('AUTH_SESSION_HANDLER')
    }
}