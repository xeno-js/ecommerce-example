import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

export const AuthCallbackSchema = ZodUtils.createCommandSchema('AUTH_CALLBACK_HANDLER', {
        code: z.string().min(1, "Authorization code is required")
});