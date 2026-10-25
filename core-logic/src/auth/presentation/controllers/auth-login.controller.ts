import { BaseController } from '@xeno-js/core'
import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core'
import { AuthLoginCommand } from '../../application'

export class AuthLoginController extends BaseController<string, { url: string }> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) { super(requestContext, mediator) }

    public async handle(provider: string, signal: AbortSignal): Promise<ResponseDto<{ url: string }>> {
        const cmd = new AuthLoginCommand(provider)
        const result = await this._send(cmd, signal)
        if (!result.isOk()) return this.fail(result.getErrorOrThrow(), 'Login URL generation failed')
        return this.ok(result.getValueOrThrow()!)
    }
}