import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, type ApiResponseDto, Result, AppError } from "@xeno-js/core";

import type { LoginCommand } from "../command/login.command";

export class LoginHandler extends BaseHandler<LoginCommand, { url: string }> {
    constructor(private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    async executeAsync(command: LoginCommand, signal: AbortSignal) {
        const provider = command.provider

        const result = await this._client.get<ApiResponseDto<{ url: string }>>(`/v1/auth/login?provider=${provider}`, { signal });

        if (!result.isOk())
            return Result.fail<{ url: string }, AppError>(result.getErrorOrThrow())
        return Result.ok<{ url: string }>((result.getValueOrThrow() as { data: { url: string }}).data)
    }
}
