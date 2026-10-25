import { MyRegistry } from "@/registry"
import { HttpRouteParamHelper, NativeRouteDefinition, RouteHandlerContext } from "@xeno-js/core"

export const authRoutes: NativeRouteDefinition<MyRegistry>[] = [{
    path: '/api/v1/auth/callback',
    method: 'GET',
    handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
        const input = await HttpRouteParamHelper.extractInput<{ code: string }>(ctx.req, '/auth/callback');
        return ctx.handle('AUTH_CALLBACK_CONTROLLER', input.code)
    }
}, {
    path: '/api/v1/auth/login',
    method: 'GET',
    handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
        const input = await HttpRouteParamHelper.extractInput<{ provider: string }>(ctx.req, '/auth/login');
        return ctx.handle('AUTH_LOGIN_CONTROLLER', input.provider)
    }
}, {
    path: '/api/v1/auth/logout',
    method: 'GET',
    handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
        return ctx.handle('AUTH_LOGOUT_CONTROLLER')
    }
}, {
    path: '/api/v1/auth/session',
    method: 'GET',
    handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
        return ctx.handle('AUTH_SESSION_CONTROLLER')
    }
}, {
    path: '/api/v1/auth/sync',
    method: 'POST',
    handler: async (ctx: RouteHandlerContext<MyRegistry>) => {
        return ctx.handle('AUTH_SYNC_CONTROLLER')
    }
}]