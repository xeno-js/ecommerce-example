import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

const identitySchema = z.object({
    userId: z.uuid().optional(),
    email: z.string().optional(),
    tenantId: z.uuid().optional(),
    roles: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
});

export const AuthSessionSchema = ZodUtils.createCommandSchema('AUTH_SESSION_HANDLER', {
    identity: identitySchema
})