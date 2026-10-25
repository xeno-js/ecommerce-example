import type { IConfigurationService, IServiceContainer } from '@xeno-js/core'
import { TOKENS } from '@xeno-js/core'

import { MyRegistry } from '../registry';
import { AuthCallbackController, AuthLoginController, AuthLogoutController, AuthSessionController, AuthSyncController } from './presentation';
import { AuthCallbackHandler, AuthLoginHandler, AuthLogoutHandler, AuthSessionHandler, AuthSyncHandler, UserMapper } from './application';
import { UserDataSource, UserRepository } from './infrastructure';
import { authRoutes } from './auth.routes';

export const AuthModule = Object.freeze({
    // ROUTES
    ROUTES: Object.freeze(authRoutes),

    register(opts: IServiceContainer<MyRegistry>, config: IConfigurationService): void {
        opts.addTransient('AUTH_SYNC_CONTROLLER', (c) => new AuthSyncController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)))
        opts.addScoped('AUTH_SYNC_HANDLER', (c) => new AuthSyncHandler(c.resolve('USER_REPOSITORY'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)))
        opts.addScoped('USER_REPOSITORY', (c) => new UserRepository(c.resolve('USER_DATA_SOURCE'), c.resolve('USER_MAPPER')))
        opts.addScoped('USER_DATA_SOURCE', (c) => new UserDataSource(c.resolve(TOKENS.DB_CONTEXT)))
        opts.addScoped('USER_MAPPER', (c) => new UserMapper())

        opts.addTransient('AUTH_CALLBACK_CONTROLLER', (c) => new AuthCallbackController(c.resolve(TOKENS.CONFIGURATION_SERVICE), c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)))
        opts.addScoped('AUTH_CALLBACK_HANDLER', (c) => new AuthCallbackHandler(c.resolve(TOKENS.AUTH_SERVICE), c.resolve(TOKENS.USER_CONTEXT_FACTORY)))

        opts.addTransient('AUTH_SESSION_CONTROLLER', (c) => new AuthSessionController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)))
        opts.addScoped('AUTH_SESSION_HANDLER', (c) => new AuthSessionHandler(c.resolve(TOKENS.USER_CONTEXT_FACTORY)))

        opts.addTransient('AUTH_LOGIN_CONTROLLER', (c) => new AuthLoginController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)))
        opts.addScoped('AUTH_LOGIN_HANDLER', (c) => new AuthLoginHandler(c.resolve(TOKENS.AUTH_SERVICE), c.resolve(TOKENS.USER_CONTEXT_FACTORY)))

        opts.addTransient('AUTH_LOGOUT_CONTROLLER', (c) => new AuthLogoutController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addScoped('AUTH_LOGOUT_HANDLER', (c) => new AuthLogoutHandler(c.resolve(TOKENS.AUTH_SERVICE), c.resolve(TOKENS.USER_CONTEXT_FACTORY)))
    }
} as const)