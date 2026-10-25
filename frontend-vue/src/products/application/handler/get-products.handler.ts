import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, type ApiResponseDto, Result, AppError, type IPaginatedResult } from "@xeno-js/core";
import type { GetProductsQuery } from "../query/get-products.query";
import type { ProductDto } from "../../infrastructure/schemas/product.schema";

export class GetProductsHandler extends BaseHandler<GetProductsQuery, IPaginatedResult<ProductDto>> {
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(query: GetProductsQuery, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<IPaginatedResult<ProductDto>>>('/v1/products', {
            query: { page: query.page, pageSize: query.pageSize },
            signal,
        });

        if (!result.isOk())
            return Result.fail<IPaginatedResult<ProductDto>, AppError>(result.getErrorOrThrow());

        const responseData = result.getValueOrThrow() as { data: IPaginatedResult<ProductDto> };
        return Result.ok(responseData.data);
    }
}