import { BaseController, IContextAccessor, IMediator, RequestContext, ResponseDto, Optional } from '@xeno-js/core';
import { GetProductByIdQuery } from '../../application';
import { ProductDto } from '../../infrastructure';

export class GetProductByIdController extends BaseController<{ id: string }, Optional<ProductDto>> {
    constructor(requestContext: IContextAccessor<RequestContext>, mediator: IMediator) {
        super(requestContext, mediator);
    }

    public async handle(request: { id: string }, signal: AbortSignal): Promise<ResponseDto<Optional<ProductDto>>> {
        const query = new GetProductByIdQuery(request.id);
        const result = await this._query(query, signal);

        if (!result.isOk()) return this.fail(result.getErrorOrThrow());
        return this.ok(result.getValueOrThrow());
    }
}