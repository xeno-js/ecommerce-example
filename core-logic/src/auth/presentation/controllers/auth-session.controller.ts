// src/auth/presentation/controllers/auth-session.controller.ts
import { BaseController } from '@xeno-js/core'
import type { IContextAccessor, IMediator, Optional, RequestContext, ResponseDto } from '@xeno-js/core'
import { AuthSessionCommand, AuthSessionResponse } from '../../application'

export class AuthSessionController extends BaseController<void, Optional<AuthSessionResponse>> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) {
        super(requestContext, mediator)
    }

    public async handle(_req: void, signal: AbortSignal): Promise<ResponseDto<Optional<AuthSessionResponse>>> {
        const ctx = this.getContext()
        const identity = ctx?.identity

        const cmd = new AuthSessionCommand(identity)
        const result = await this._send(cmd, signal)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Failed to retrieve auth session')
        }

        return this.ok(result.getValueOrThrow())
    }
}