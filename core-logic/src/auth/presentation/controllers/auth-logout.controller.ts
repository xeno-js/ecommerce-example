import { BaseController } from '@xeno-js/core';
import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { AuthLogoutCommand } from '../../application';

export class AuthLogoutController extends BaseController<void, void> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) { super(requestContext, mediator); }

    public async handle(_req: void, signal: AbortSignal): Promise<ResponseDto<void>> {
        const cmd = new AuthLogoutCommand();
        const result = await this._send(cmd, signal);
        if (!result.isOk()) return this.fail(result.getErrorOrThrow(), 'Logout failed');
        return this.ok(result.getValueOrThrow());
    }
}