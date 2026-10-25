import { ZodUtils } from "@xeno-js/zod";
import { z } from 'zod';

export const getProductByIdSchema = ZodUtils.createQuerySchema('GET_PRODUCT_BY_ID', {
    id: z.string().min(1, "Product ID is required")
});