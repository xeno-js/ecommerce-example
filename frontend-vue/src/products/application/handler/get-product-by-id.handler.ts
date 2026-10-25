import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, type ApiResponseDto, Result, AppError, type Optional } from "@xeno-js/core";
import type { GetProductByIdQuery } from "../query/get-product-by-id.query";
import type { ProductDto } from "../../infrastructure/schemas/product.schema";

export class GetProductByIdHandler extends BaseHandler<GetProductByIdQuery, Optional<ProductDto>> {
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(query: GetProductByIdQuery, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<ProductDto>>(`/v1/products/${query.id}`, {
            signal,
        });
        if (!result.isOk())
            return Result.fail<Optional<ProductDto>, AppError>(result.getErrorOrThrow());

        const responseData = result.getValueOrThrow() as { data: Optional<ProductDto> };
        return Result.ok(responseData.data);
    }
}