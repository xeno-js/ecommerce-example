import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

export const GetProductByIdSchema = ZodUtils.createQuerySchema('GET_PRODUCT_BY_ID_HANDLER', {
    id: z.string().min(1, "Product ID is required")
});
