import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, Result } from "@xeno-js/core";
import type { ApiResponseDto, AppError } from "@xeno-js/core";
import { CreateOrderCommand } from "../command/create-order.command";

export class CreateOrderHandler extends BaseHandler<CreateOrderCommand, void> {
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    async executeAsync(command: CreateOrderCommand, signal: AbortSignal) {
        const result = await this._client.post<ApiResponseDto<void>>('/v1/orders', { items: command.items }, { signal });

        if (!result.isOk()) {
            return Result.fail<void, AppError>(result.getErrorOrThrow());
        }

        return Result.ok<void>();
    }
}