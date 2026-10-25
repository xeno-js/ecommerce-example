import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, Result, AppError, type Optional, type ApiResponseDto } from "@xeno-js/core";
import type { GetOrderByIdQuery } from "../queries/get-order-by-id.query";
import type { OrderDto } from "../../infrastructure";

export class GetOrderByIdHandler extends BaseHandler<GetOrderByIdQuery, Optional<OrderDto>> {
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(query: GetOrderByIdQuery, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<OrderDto>>(`/v1/orders/${query.id}`, { signal });

        if (!result.isOk()) return Result.fail<Optional<OrderDto>, AppError>(result.getErrorOrThrow());

        const responseData = result.getValueOrThrow() as { data: Optional<OrderDto> };
        return Result.ok(responseData.data);
    }
}