import { BaseController, IContextAccessor, IMediator, RequestContext, ResponseDto, IPaginatedResult } from '@xeno-js/core';
import { GetProductsQuery } from '../../application';
import { ProductDto } from '../../infrastructure';

export class GetProductsController extends BaseController<{ page?: number; pageSize?: number }, IPaginatedResult<ProductDto>> {
    constructor(requestContext: IContextAccessor<RequestContext>, mediator: IMediator) {
        super(requestContext, mediator);
    }

    public async handle(request: { page?: number; pageSize?: number }, signal: AbortSignal): Promise<ResponseDto<IPaginatedResult<ProductDto>>> {
        const page = Number(request?.page) || 1;
        const pageSize = Number(request?.pageSize) || 10;

        const query = new GetProductsQuery(page, pageSize);
        const result = await this._query(query, signal);

        if (!result.isOk()) return this.fail(result.getErrorOrThrow());
        return this.ok(result.getValueOrThrow()!);
    }
}