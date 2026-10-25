import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

const authModelSchema = z.object({
    userId: z.uuid("Invalid user ID format"),
    email: z.email("Invalid email format"),
    name: z.string().nullable(),
    tenantId: z.uuid().nullable(),
});

export const SyncUserSchema = ZodUtils.createCommandSchema('AUTH_SYNC_HANDLER', {
    props: authModelSchema
})