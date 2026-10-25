import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, Result, AppError, type IPaginatedResult, type ApiResponseDto } from "@xeno-js/core";
import type { GetOrdersQuery } from "../queries/get-orders.query";
import type { OrderDto } from "../../infrastructure";

export class GetOrdersHandler extends BaseHandler<GetOrdersQuery, IPaginatedResult<OrderDto>> {
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(query: GetOrdersQuery, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<IPaginatedResult<OrderDto>>>('/v1/orders', {
            query: { page: query.page, pageSize: query.pageSize },
            signal
        });

        if (!result.isOk()) return Result.fail<IPaginatedResult<OrderDto>, AppError>(result.getErrorOrThrow());

        const responseData = result.getValueOrThrow() as { data: IPaginatedResult<OrderDto> };
        return Result.ok(responseData.data);
    }
}