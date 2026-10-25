import { ZodUtils } from "@xeno-js/zod";
import { z } from 'zod';

export const createOrderSchema = ZodUtils.createCommandSchema('CREATE_ORDER', {
    items: z.array(z.object({
        productId: z.string().min(1, "Product ID is required"),
        name: z.string().min(1, "Product name is required"),
        price: z.number().positive("Price must be greater than zero"),
        quantity: z.number().int().positive("Quantity must be at least 1")
    })).min(1, "At least one item is required")
});