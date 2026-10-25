import { BaseController } from '@xeno-js/core';
import type { IConfigurationService, IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { AuthCallbackCommand } from '../../application';

export class AuthCallbackController extends BaseController<string, void> {
    constructor(
        private readonly _configration: IConfigurationService,
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) { super (requestContext, mediator) }

    public async handle(code: string, signal: AbortSignal): Promise<ResponseDto<void>> {
        const cmd = new AuthCallbackCommand(code)
        
        const result = await this._send(cmd, signal);
        if (!result.isOk())
            return this.fail(result.getErrorOrThrow(), 'Faild during called auth callback', {
                Location: [`${this._configration.getOrThrow('CLIENT_URL')}/login?error=auth_failed`]
            });

        return this.ok(result.getValueOrThrow(), 302, {}, {
            Location: [`${this._configration.getOrThrow('CLIENT_URL')}/dashboard`]
        });
    }
}
