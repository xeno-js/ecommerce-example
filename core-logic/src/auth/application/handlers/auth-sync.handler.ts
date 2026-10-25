import type { IFactory, ResultType, UserContext } from '@xeno-js/core';
import { Result, AppError, Guards } from '@xeno-js/core';
import { BaseHandler } from '@xeno-js/core';
import { AuthSyncCommand } from '../commands/sync-user.command';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/contracts/iuser-repository.contract';

export class AuthSyncHandler extends BaseHandler<AuthSyncCommand, void> {
    constructor(
        private readonly _userRepository: IUserRepository,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(request: AuthSyncCommand, signal: AbortSignal): Promise<ResultType<void>> {
        const { userId, email, name, tenantId } = request.props;

        const ctx = this._getCurrentContext();
        const data = await this._userRepository.findById(userId!, ctx, signal);
        if(!data.isOk()) 
            return Result.fail(data.getErrorOrThrow());

        const user = data.getValueOrThrow();
        if(Guards.isDefined(user))
        {
            if(user.isInactive())
                return Result.fail(AppError.forbidden('auth-sync.handler', `User with ID ${userId} is marked as deleted or inactive.`));

            const updateUser = user.updateLastLogin(user);
            return await this._userRepository.update(updateUser.getId().toString(), updateUser, ctx, signal);
        }

        const newUser = User.create({ userId, name: name ?? email!.split('@')[0], email: email!, tenantId });
        return await this._userRepository.upsert(newUser, ctx, signal);
    }
}