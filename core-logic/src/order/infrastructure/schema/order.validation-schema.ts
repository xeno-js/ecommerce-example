import { z } from 'zod';
import { ZodUtils } from '@xeno-js/zod';

export const orderItemValidationSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    name: z.string().min(1, "Product name is required"),
    price: z.number().positive("Price must be greater than zero"),
    quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = ZodUtils.createCommandSchema('CREATE_ORDER_HANDLER', {
    items: z.array(orderItemValidationSchema).min(1, "At least one item is required"),
});

export const getOrdersSchema = ZodUtils.createQuerySchema('GET_ORDERS_HANDLER', {});
export const getOrderByIdSchema = ZodUtils.createQuerySchema('GET_ORDER_BY_ID_HANDLER', {
    id: z.string().min(1, "Order ID is required"),
});