import { MyRegistry } from "@/registry";
import { HttpRouteParamHelper, NativeRouteDefinition } from "@xeno-js/core";
import { CreateOrderPayload } from "./application";

export const ordersRoutes: NativeRouteDefinition<MyRegistry>[] = [
    {
        path: '/api/v1/orders',
        method: 'GET',
        handler: async (ctx) => {
            const input = await HttpRouteParamHelper.extractInput<{ page?: number; pageSize?: number }>(ctx.req, '/api/v1/orders');
            return ctx.handle('GET_ORDERS_CONTROLLER', input);
        }
    },
    {
        path: '/api/v1/orders/:id',
        method: 'GET',
        handler: async (ctx) => {
            const input = await HttpRouteParamHelper.extractInput<{ id: string }>(ctx.req, '/api/v1/orders/:id');
            return ctx.handle('GET_ORDER_BY_ID_CONTROLLER', input);
        }
    },
    {
        path: '/api/v1/orders',
        method: 'POST',
        handler: async (ctx) => {
            const input = await HttpRouteParamHelper.extractInput<CreateOrderPayload>(ctx.req, '/api/v1/orders');
            return ctx.handle('CREATE_ORDER_CONTROLLER', input);
        }
    }
];