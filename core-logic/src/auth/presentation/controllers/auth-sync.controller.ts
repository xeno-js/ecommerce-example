import { BaseController } from '@xeno-js/core';
import { AppError, Guards } from '@xeno-js/core';
import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { AuthSyncCommand } from '../../application';

export class AuthSyncController extends BaseController<void, {success: boolean }> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) { super (requestContext, mediator) }

    public async handle(_request: void, singal: AbortSignal): Promise<ResponseDto<{ success: boolean }>> {
        const ctx = this.getContext();
        const identity = ctx?.identity;
        if (!Guards.isDefined(identity))
            return this.fail(AppError.unauthorized('', 'No identity found in request context'));

        const cmd = new AuthSyncCommand({
            userId: identity.userId,
            email: identity.email,
            name: identity.name,
            tenantId: identity.tenantId?.toString() ?? null
        })

        const result = await this._send(cmd, singal);
        if (!result.isOk())
            return this.fail(result.getErrorOrThrow(), 'Error during user sync operation');

        return this.ok({ success: true });
    }
}