import { AppError, BaseHandler, IFactory, IPaginatedResult, Result, ResultType, UserContext } from '@xeno-js/core';
import type { OrderDto } from '../../infrastructure';
import type { IOrderDataSource } from '../../domain';
import { GetOrdersQuery } from '../query/getorders.query';

export class GetOrdersHandler extends BaseHandler<GetOrdersQuery, IPaginatedResult<OrderDto>> {
    constructor(
        private readonly _orderDataSource: IOrderDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    protected async executeAsync(query: GetOrdersQuery, signal: AbortSignal): Promise<ResultType<IPaginatedResult<OrderDto>>> {
        const ctx = this._getCurrentContext();
        if (!ctx.userId) return Result.fail(AppError.unauthorized('GetOrdersHandler', 'User context is missing'));

        const result = await this._orderDataSource.findPaginatedByUserId(
            ctx.userId.toString(),
            query.page,
            query.pageSize,
            ctx,
            signal
        );

        return Result.ok(result);
    }
}