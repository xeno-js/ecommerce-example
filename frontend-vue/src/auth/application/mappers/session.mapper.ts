import type { AuthSessionResponse } from "@/auth/domain";
import { GuidHelper, type Guid, type Identity } from "@xeno-js/core";

export const SessionMapper = {
    map(session: AuthSessionResponse): Identity & { isAuthenticated: boolean } {
        const user = session.user

        return {
            isAuthenticated: session.authenticated,
            userId: GuidHelper.isValid(user?.id ?? '') ? user?.id as Guid : undefined,
            tenantId: GuidHelper.isValid(user?.app_metadata.tenant_id ?? '') ? user?.app_metadata.tenant_id as Guid : undefined,
            name: user?.name,
            email: user?.email,
            roles: user?.app_metadata.roles,
            permissions: user?.app_metadata.permissions
        }
    }
}