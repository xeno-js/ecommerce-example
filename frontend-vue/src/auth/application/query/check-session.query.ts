import type { AuthSessionResponse } from "@/auth/domain";
import { Query } from "@xeno-js/core";

export class CheckQuerySession extends Query<AuthSessionResponse> {
    constructor() {
        super('CHECK_SESSION', {
            ttl: 60,
            cacheKey: `check.session`,
            bypassCache: true,
            consistentRead: false,
            isUserScoped: true
        })
    }
}
