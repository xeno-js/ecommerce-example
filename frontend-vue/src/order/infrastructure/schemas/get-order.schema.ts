import { ZodUtils } from "@xeno-js/zod";
import { z } from "zod";

export interface OrderItemDto {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderDto {
    id: string;
    userId: string;
    tenantId: string | null;
    totalAmount: number | string;
    items: OrderItemDto[];
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const getOrdersSchema = ZodUtils.createQuerySchema('GET_ORDERS', {
    page: z.any().optional().transform(val => (val ? parseInt(String(val), 10) : 1)),
    pageSize: z.any().optional().transform(val => (val ? parseInt(String(val), 10) : 10)),
});

export const getOrderByIdSchema = ZodUtils.createQuerySchema('GET_ORDER_BY_ID', {
    id: z.string().min(1, "L'ID dell'ordine è obbligatorio")
});