import { z } from 'zod'
import { ZodUtils } from '@xeno-js/zod';

export const AuthLoginSchema = ZodUtils.createCommandSchema('AUTH_LOGIN_HANDLER' ,{
        provider: z.string().min(1, "Provider is required")
});