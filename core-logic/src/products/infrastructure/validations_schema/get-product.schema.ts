import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

export const GetProductsSchema = ZodUtils.createQuerySchema('GET_PRODUCTS_HANDLER', {
    page: z.any().optional().transform(val => (val ? parseInt(String(val), 10) : 1)),
    pageSize: z.any().optional().transform(val => (val ? parseInt(String(val), 10) : 10)),
});