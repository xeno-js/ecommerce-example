import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, type ApiResponseDto, Result, AppError } from "@xeno-js/core";

import type { SyncUserCommand } from "../command";

export class SyncUserHandler extends BaseHandler<SyncUserCommand, void> {
    constructor(private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(_query: SyncUserCommand, signal: AbortSignal) {
        const result = await this._client.post<ApiResponseDto<{ success: boolean }>>('/v1/auth/sync', {}, { signal });
        if (!result.isOk())
            return Result.fail<void, AppError>(result.getErrorOrThrow())
        return Result.ok<void>()
    }
}
