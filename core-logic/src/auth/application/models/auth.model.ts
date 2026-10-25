import type { Maybe, Nullable, Optional } from '@xeno-js/core';

export interface AuthModel {
    userId: Optional<string>;
    email: Optional<string>;
    name: Maybe<string>;
    tenantId: Nullable<string>;
}