import { BaseController, IContextAccessor, IMediator, Optional, RequestContext, ResponseDto } from '@xeno-js/core';
import { GetOrderByIdQuery } from '../application';
import type { OrderDto } from '../infrastructure';

export class GetOrderByIdController extends BaseController<{ id: string }, Optional<OrderDto>> {
    constructor(requestContext: IContextAccessor<RequestContext>, mediator: IMediator) {
        super(requestContext, mediator);
    }

    public async handle(request: { id: string }, signal: AbortSignal): Promise<ResponseDto<Optional<OrderDto>>> {
        const query = new GetOrderByIdQuery(request.id);
        const result = await this._query(query, signal);

        if (!result.isOk()) return this.fail(result.getErrorOrThrow());
        return this.ok(result.getValueOrThrow());
    }
}