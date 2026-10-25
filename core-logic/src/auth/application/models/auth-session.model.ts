// src/auth/domain/models/auth-session.response.ts
import type { Guid, Maybe, Nullable } from '@xeno-js/core';

export interface AuthSessionUser {
    id: Guid | string;
    email: string;
    name: Maybe<string>;
    app_metadata: {
        tenant_id?: Guid | string;
        roles: string[];
        permissions: string[];
    };
}

export interface AuthSessionResponse {
    authenticated: boolean;
    user: Nullable<AuthSessionUser>;
}