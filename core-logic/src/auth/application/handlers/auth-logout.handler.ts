import type { IFactory, ResultType, UserContext, IExtendendAuthService } from '@xeno-js/core';
import { Result, AppError } from '@xeno-js/core';
import { BaseHandler } from '@xeno-js/core';
import { AuthLogoutCommand } from '../commands/auth-logout.command';

export class AuthLogoutHandler extends BaseHandler<AuthLogoutCommand, void> {
    constructor(
        private readonly _authService: IExtendendAuthService,
        identityFactory: IFactory<void, UserContext>,
    ) { super(identityFactory); }

    protected async executeAsync(_request: AuthLogoutCommand): Promise<ResultType<void>> {
        const result = await this._authService.signOut();
        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        return Result.ok();
    }
}