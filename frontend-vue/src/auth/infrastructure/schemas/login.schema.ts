import { ZodUtils } from "@xeno-js/zod";
import { z } from 'zod'

export const loginSchema = ZodUtils.createCommandSchema('LOGIN', {
    provider: z.string('google')
})