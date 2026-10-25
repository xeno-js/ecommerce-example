import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { LOG_LEVEL, withConsoleLogger, withPerformance, withQueryCaching, XenoAppBuilder } from '@xeno-js/core'
import { withAxiosHttp } from '@xeno-js/axios'

import App from './App.vue'
import './style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import type { MyRegistry } from './registry'
import { COMMON_CONSTANTS } from './commons'
import { withSentryVueLogger } from '@xeno-js/sentry-vue'
import { withZodValidation } from '@xeno-js/zod'
import { checkSessionSchema, loginSchema, logoutSchema, syncUserSchema } from './auth/infrastructure/schemas'
import { ServicesUtils, withPiniaContext } from '@xeno-js/vue'
import { CheckSessionHandler, LoginHandler, LogoutHandler, SyncUserHandler } from './auth/application/handlers'
import { router } from './router'
import { GetProductByIdHandler, getProductByIdSchema, GetProductsHandler, getProductsSchema } from './products/index'
import { CreateOrderHandler, createOrderSchema, getOrderByIdSchema, getOrdersSchema } from './order/index'
import { GetOrdersHandler } from './order/application/handlers/get-orders.handler'
import { GetOrderByIdHandler } from './order/application/handlers/get-order-by-id.handler'

async function bootstrap() {
    try {
        const app = createApp(App);
        app.use(createPinia())

        const builder = new XenoAppBuilder<MyRegistry>(undefined, 'vite')
            .addContext(withPiniaContext({ requestIdWindowMs: 5000 }))
            .addLogger([withConsoleLogger(opts => opts.level = LOG_LEVEL.DEBUG), withSentryVueLogger((opts, config) => {
                opts.enabled = config.getEnvironment() === 'production'
                opts.dsn = config.getOrThrow(COMMON_CONSTANTS.SENTRY_DSN)
                opts.environment = config.getEnvironment()
                opts.app = app
                opts.router = router
                opts.tracesSampleRate = 0.2
                opts.level = LOG_LEVEL.WARN
            })])
            .addCache((opts) => {
                opts.inMemory = true
            })
            .addPipeline([withQueryCaching(), withZodValidation((opts) => {
                opts.schemas = {
                    'LOGIN': loginSchema,
                    'LOGOUT': logoutSchema,
                    'CHECK_SESSION': checkSessionSchema,
                    'SYNC_USER': syncUserSchema,
                    'GET_PRODUCTS': getProductsSchema,
                    'GET_PRODUCT_BY_ID': getProductByIdSchema,
                    'CREATE_ORDER': createOrderSchema,
                    'GET_ORDERS': getOrdersSchema,
                    'GET_ORDER_BY_ID': getOrderByIdSchema,
                }
            }), withPerformance((opts) => {
                opts.thresholdMs = 500
            })])
            .addHttpClient(withAxiosHttp((opts, config) =>
                opts.push({
                    name: 'bffRemoteDs',
                    axios: {
                        baseURL: config.getOrThrow(COMMON_CONSTANTS.API_BASE_URL),
                        timeout: 30000,
                        withCredentials: true,
                        xsrfCookieName: config.getOrThrow(COMMON_CONSTANTS.CSRF),
                        xsrfHeaderName: 'x-csrf-token'
                    }
                },
                    {
                        name: 'publicRemoteDs',
                        axios: {
                            baseURL: config.getOrThrow(COMMON_CONSTANTS.API_BASE_URL),
                            timeout: 30000,
                            withCredentials: false,
                        }
                    },
                )
            ))
            .addServices((opts) => {
                opts.addScoped('CHECK_SESSION', (c) => new CheckSessionHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('SYNC_USER', (c) => new SyncUserHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('LOGIN', (c) => new LoginHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('LOGOUT', (c) => new LogoutHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('GET_PRODUCTS', (c) => new GetProductsHandler(c.resolve('httpClientFactory').get('publicRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('GET_PRODUCT_BY_ID', (c) => new GetProductByIdHandler(c.resolve('httpClientFactory').get('publicRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('CREATE_ORDER', (c) => new CreateOrderHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')))
                opts.addScoped('GET_ORDERS', (c) => new GetOrdersHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')));
                opts.addScoped('GET_ORDER_BY_ID', (c) => new GetOrderByIdHandler(c.resolve('httpClientFactory').get('bffRemoteDs'), c.resolve('userContextFactory')));
            })

        const xenoApp = await builder.build()
        ServicesUtils.provide(app, xenoApp)

        app.use(router)
        app.mount('#app')
        const { logger } = ServicesUtils.useApp<MyRegistry>()
        logger.info('Application started successfully')
    } catch (error) {
        console.error('Error during application startup', { error })
    }
}

await bootstrap()
