import type { IFactory, ResultType, UserContext, IExtendendAuthService } from '@xeno-js/core';
import { Result, AppError } from '@xeno-js/core';
import { BaseHandler } from '@xeno-js/core';
import { AuthCallbackCommand } from '../commands/auth-callback.command';

export class AuthCallbackHandler extends BaseHandler<AuthCallbackCommand, void> {
    constructor(
        private readonly _authService: IExtendendAuthService,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(request: AuthCallbackCommand): Promise<ResultType<void>> {
        const result = await this._authService.exchangeCodeForSession(request.code);

        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        return Result.ok();
    }
}