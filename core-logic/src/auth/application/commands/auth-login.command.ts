import { Command } from '@xeno-js/core'

export class AuthLoginCommand extends Command<{ url: string }> {
    constructor(public readonly provider: string) {
        super('AUTH_LOGIN_HANDLER')
    }
}