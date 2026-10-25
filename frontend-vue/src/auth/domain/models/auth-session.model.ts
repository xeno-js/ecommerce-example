import type { Guid, Nullable } from '@xeno-js/core';

export interface AuthSessionUser {
    id: Guid | string;
    email: string;
    name: string;
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