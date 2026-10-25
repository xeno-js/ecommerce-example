import { BaseController, IContextAccessor, IMediator, IPaginatedResult, RequestContext, ResponseDto } from '@xeno-js/core';
import { GetOrdersQuery } from '../application';
import type { OrderDto } from '../infrastructure';

export class GetOrdersController extends BaseController<{ page?: number; pageSize?: number }, IPaginatedResult<OrderDto>> {
    constructor(requestContext: IContextAccessor<RequestContext>, mediator: IMediator) {
        super(requestContext, mediator);
    }

    public async handle(request: { page?: number; pageSize?: number }, signal: AbortSignal): Promise<ResponseDto<IPaginatedResult<OrderDto>>> {
        const page = Number(request?.page) || 1;
        const pageSize = Number(request?.pageSize) || 10;

        const query = new GetOrdersQuery(page, pageSize);
        const result = await this._query(query, signal);

        if (!result.isOk()) return this.fail(result.getErrorOrThrow());
        return this.ok(result.getValueOrThrow()!);
    }
}