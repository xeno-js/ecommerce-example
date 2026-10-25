import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { BaseController } from '@xeno-js/core';
import { CreateOrderCommand, CreateOrderPayload } from '../application';

export class CreateOrderController extends BaseController<CreateOrderPayload, void> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) {
        super(requestContext, mediator);
    }

    public async handle(request: CreateOrderPayload, signal: AbortSignal): Promise<ResponseDto<void>> {
        const cmd = new CreateOrderCommand(request.items);
        const result = await this._send(cmd, signal);

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Error during CreateOrder operation');
        }

        return this.ok(result.getValueOrThrow());
    }
}
