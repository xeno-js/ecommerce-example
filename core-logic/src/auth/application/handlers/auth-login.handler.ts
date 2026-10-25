import type { IFactory, ResultType, UserContext, Provider, IExtendendAuthService } from '@xeno-js/core'
import { AppError } from '@xeno-js/core'
import { BaseHandler } from '@xeno-js/core'
import { AuthLoginCommand } from '../commands/auth-login.command'

export class AuthLoginHandler extends BaseHandler<AuthLoginCommand, { url: string }> {
    constructor(
        private readonly _authService: IExtendendAuthService,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(request: AuthLoginCommand): Promise<ResultType<{ url: string }>> {
        const result = await this._authService.signInWithProvider(request.provider as Provider);
        return result
    }
}