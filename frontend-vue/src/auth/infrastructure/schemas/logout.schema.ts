import { ZodUtils } from "@xeno-js/zod";

export const logoutSchema = ZodUtils.createCommandSchema('LOGOUT', {})