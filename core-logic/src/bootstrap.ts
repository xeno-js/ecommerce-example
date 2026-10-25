import { XenoAppBuilder, LOG_LEVEL, withAuthZ, withIdempotency, withPerformance, withQueryCaching, withConsoleLogger, withConcurrency, TOKENS, IXenoApplication, IAppBuilder } from '@xeno-js/core';
import { withPostgresql } from '@xeno-js/postgresql';
import { withRedis } from '@xeno-js/redis';
import { withSupabase } from '@xeno-js/supabase';
import type { MyRegistry } from './registry';
import { withZodValidation } from '@xeno-js/zod';
import { AuthCallbackSchema, AuthLoginSchema, AuthLogoutSchema, AuthModule, AuthSessionSchema, SyncUserSchema } from './auth';
import { withPinoLogger } from '@xeno-js/pino';
import { withSentryNodeLogger } from '@xeno-js/sentry-node';
import { routes } from './routes';
import { GetProductByIdSchema, GetProductsSchema, ProductsModule, ProductReservationFailedListener, ProductReservedListener } from './products';
import { runDatabaseSeed } from './seed';
import { OrdersModule, createOrderSchema, OrderCreatedListener } from './order';

const basePipelines = [
  withIdempotency<MyRegistry>((opts) => {
    opts.lockTtlSeconds = 60,
      opts.processedTtlSeconds = 60 * 60 * 24,
      opts.intentRegistry = {
        'LOGIN': {
          lockTtlSeconds: 10,
          processedTtlSeconds: 30
        },
        'AUTH_SYNC_HANDLER': { lockTtlSeconds: 180, processedTtlSeconds: 60 * 60 },
        'AUTH_LOGOUT_HANDLER': { lockTtlSeconds: 60, processedTtlSeconds: 60 * 60 * 2 },
        'CREATE_ORDER_HANDLER': {
          lockTtlSeconds: 15,
          processedTtlSeconds: 60 * 60 * 24
        }
      }
  }),
  withPerformance<MyRegistry>((opts) => {
    opts.thresholdMs = 500,
      opts.intentThresholdMs = {
        'AUTH_SYNC_HANDLER': { thresholdMs: 3000 },
        'AUTH_LOGOUT_HANDLER': { thresholdMs: 500 },
        'CREATE_ORDER_HANDLER': { thresholdMs: 1000 },
      }
  }),
  withQueryCaching<MyRegistry>(),
  withConcurrency<MyRegistry>((opts) => {
    opts.maxRetries = 3
    opts.delayConfig = {
      baseDelayMs: 100,
      maxJitterMs: 40
    }
    opts.intentRegistry = {
      'CREATE_ORDER_HANDLER': {
        delayConfig: {
          baseDelayMs: 150,
          maxJitterMs: 50
        }
      }
    }
  })
]

export function GetXenoBuilder(type: 'worker' | 'api'): IAppBuilder<MyRegistry, IXenoApplication<MyRegistry>> {

  const XenoApp = new XenoAppBuilder<MyRegistry>()

  if (type === 'api') {
    XenoApp
      .addRoutes(routes)
      .addMiddlewares((opts, config) => {
        opts.isSSR = true
        opts.cors = {
          allowOrigins: [config.get('CLIENT_URL', '')!],
          enablePreflight: true,
          withCredentials: true,
          enabled: true
        }

        opts.csrf = {
          secret: config.getOrThrow('CSRF_SECRET'),
          cookieName: '__Host-xeno-csrf',
          headerName: 'x-csrf-token',
          cookieMaxAgeSeconds: 3600,
          sameSite: 'lax'
        }
      })
      .addAuth(withSupabase((opts, config) => {
        opts.url = config.getOrThrow('SUPABASE_URL')
        opts.key = config.getOrThrow('SUPABASE_KEY')
        opts.redirectTo = `${config.get('BASE_URL')}/v1/auth/callback`
        opts.ssr = {
          cookieOptions: {
            path: '/',
            httpOnly: true,
            secure: config.getEnvironment() === 'production',
            sameSite: 'lax',
          },
          cookieEncoding: "base64url"
        }
      }))
      .addPipeline([...basePipelines,
        withZodValidation((opts) => opts.schemas = {
          'AUTH_CALLBACK_HANDLER': AuthCallbackSchema,
          'AUTH_SESSION_HANDLER': AuthSessionSchema,
          'AUTH_SYNC_HANDLER': SyncUserSchema,
          'AUTH_LOGIN_HANDLER': AuthLoginSchema,
          'AUTH_LOGOUT_HANDLER': AuthLogoutSchema,
          'GET_PRODUCTS_HANDLER': GetProductsSchema,
          'GET_PRODUCT_BY_ID_HANDLER': GetProductByIdSchema,
          'CREATE_ORDER_HANDLER': createOrderSchema
        }),
        withAuthZ((opts) => {
          opts.policies = {
            'AUTH_SYNC_HANDLER': { userId: true },
            'AUTH_LOGOUT_HANDLER': { userId: true },
            'CREATE_ORDER_HANDLER': { userId: true },
            'GET_ORDERS_HANDLER': { userId: true },
            'GET_ORDER_BY_ID_HANDLER': { userId: true },
          }
        }),])
      .addServices(async (c) => runDatabaseSeed(c.createScope()), 10)
  }

  if(type === 'worker') {
    XenoApp
      .addPipeline(basePipelines)
  }
  XenoApp
    .addCache(withRedis((opts, config) => {
      opts.isEnabled = config.getEnvironment() === 'production'
    }))
    .addDb(withPostgresql((opts, config) => {
      opts.connectionString = config.getOrThrow('DATABASE_URL')
      opts.outbox = {
        enable: true,
        worker: type === 'worker',
        name: ['order', 'product'],
        handlers: [
          (c) => new OrderCreatedListener(c.resolve(TOKENS.MEDIATOR)),
          (c) => new ProductReservedListener(c.resolve(TOKENS.MEDIATOR)),
          (c) => new ProductReservationFailedListener(c.resolve(TOKENS.MEDIATOR))
        ]
      }
    }))
    .addLogger([
      withPinoLogger((opts, config) => {
        opts.isEnabled = config.getEnvironment() === 'production'
        opts.destination = "stdout"
        opts.prettyPrint = false
        opts.logLevel = LOG_LEVEL.INFO
      }),
      withSentryNodeLogger((opts, config) => {
        opts.dsn = config.getOrThrow('SENTRY_DSN')
        opts.environment = config.getEnvironment()
        opts.isEnabled = config.getEnvironment() === 'production'
        opts.level = LOG_LEVEL.WARN
        opts.release = config.getOrThrow('SENTRY_RELEASE')
      }),
      withConsoleLogger((opts, config) => {
        opts.isEnabled = config.getEnvironment() === 'development'
        opts.level = LOG_LEVEL.DEBUG
      })
    ])
    .addServices((opts, config) => {
      AuthModule.register(opts, config);
      ProductsModule.register(opts);
      OrdersModule.register(opts)
    })
    
  return XenoApp
}
