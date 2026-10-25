import { NativeRouteDefinition, RouteHandlerContext, HttpRouteParamHelper, withCors } from "@xeno-js/core";
import { MyRegistry } from "../registry";

export const productsRoutes: NativeRouteDefinition<MyRegistry>[] = [
    withCors<MyRegistry>({
        path: '/api/v1/products',
        method: 'GET',
        handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
            const input = await HttpRouteParamHelper.extractInput<{ page?: number; pageSize?: number }>(ctx.req, '/api/v1/products');
            return ctx.handle('GET_PRODUCTS_CONTROLLER', input);
        }
    }, ['*'], false),
    withCors<MyRegistry>({
        path: '/api/v1/products/:id',
        method: 'GET',
        handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
            const input = await HttpRouteParamHelper.extractInput<{ id: string }>(ctx.req, '/api/v1/products/:id');
            return ctx.handle('GET_PRODUCT_BY_ID_CONTROLLER', input);
        }
    }, ['*'], false),
];