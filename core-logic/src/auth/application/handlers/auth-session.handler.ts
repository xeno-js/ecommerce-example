import type { Identity, IFactory, ResultType, UserContext } from '@xeno-js/core';
import { Result, Guards, GUEST } from '@xeno-js/core';
import { BaseHandler } from '@xeno-js/core';
import { AuthSessionCommand } from '../commands/auth-session.command';
import { AuthSessionResponse } from '../models/auth-session.model';

export class AuthSessionHandler extends BaseHandler<AuthSessionCommand, AuthSessionResponse> {
    constructor(
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    protected async executeAsync(request: AuthSessionCommand): Promise<ResultType<AuthSessionResponse>> {
        const identity = request.identity;
        const user = this._getCurrentContext()
        const guest = GUEST as unknown as Identity
        // Se l'utente non ha il cookie o il token non è valido (GUEST)
        if (!Guards.isDefined(identity) || Guards.isNullOrEmpty(identity.userId) || identity === guest || identity.userId !== user.userId || identity.tenantId !== identity.tenantId) {
            return Result.ok({
                authenticated: false,
                user: null
            });
        }

        // Se il token è valido e l'identità è presente
        return Result.ok({
            authenticated: true,
            user: {
                id: identity.userId,
                email: identity.email ?? '',
                name: identity.name,
                app_metadata: {
                    tenant_id: identity.tenantId?.toString(),
                    roles: identity.roles ?? [],
                    permissions: identity.permissions ?? []
                }
            }
        });
    }
}