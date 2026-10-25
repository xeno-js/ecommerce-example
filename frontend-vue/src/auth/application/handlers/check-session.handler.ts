import { BaseHandler, type IRemoteDataSource, type UserContext, type IFactory, Result } from "@xeno-js/core";
import type { ApiResponseDto, AppError, Identity } from "@xeno-js/shared";

import { CheckQuerySession } from '../query/check-session.query'
import type { AuthSessionResponse } from "@/auth/domain";
import { SessionMapper } from "../mappers/session.mapper";

export class CheckSessionHandler extends BaseHandler<CheckQuerySession, Identity & { isAuthenticated: boolean }> {
    
    constructor(
        private readonly _client: IRemoteDataSource,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }
    
    async executeAsync(_query: CheckQuerySession, signal: AbortSignal) {
        const result = await this._client.get<ApiResponseDto<AuthSessionResponse>>('/v1/auth/session', {
            signal
        });
        if(result.isOk()){
            const data = (result.getValueOrThrow() as { data: AuthSessionResponse }).data

            return Result.ok(SessionMapper.map(data))
        }
        else 
            return Result.fail<Identity & { isAuthenticated: boolean }, AppError>(result.getErrorOrThrow())
    }
}
