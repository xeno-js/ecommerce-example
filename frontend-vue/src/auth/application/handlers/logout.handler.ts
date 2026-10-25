import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, type ApiResponseDto, Result, AppError } from "@xeno-js/core";

import type { LogoutCommand } from "../command/logout.command";

export class LogoutHandler extends BaseHandler<LogoutCommand, void> {
    constructor(private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(_command: LogoutCommand, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<void>>('/v1/auth/logout', { signal });
        
        if(!result.isOk())
            return Result.fail<void, AppError>(result.getErrorOrThrow())
        return Result.ok<void>()
    }
}
