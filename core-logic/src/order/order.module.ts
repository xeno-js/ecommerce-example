import type { IServiceContainer } from '@xeno-js/core';
import { TOKENS } from '@xeno-js/core';
import { CreateOrderController, GetOrderByIdController, GetOrdersController } from './presentation';
import { CreateOrderHandler, GetOrderByIdHandler, GetOrdersHandler, ConfirmOrderHandler, DenyOrderHandler, OrderMapper } from './application';
import { ordersRoutes } from './order.route';
import { MyRegistry } from '@/registry';
import { OrderDataSource, OrderRepository } from './infrastructure';

export const OrdersModule = Object.freeze({
    ROUTES: Object.freeze(ordersRoutes),
    register(opts: IServiceContainer<MyRegistry>): void {
        // Controllers
        opts.addTransient('CREATE_ORDER_CONTROLLER', (c) => new CreateOrderController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addTransient('GET_ORDERS_CONTROLLER', (c) => new GetOrdersController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addTransient('GET_ORDER_BY_ID_CONTROLLER', (c) => new GetOrderByIdController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));

        // Handlers
        opts.addScoped('CREATE_ORDER_HANDLER', (c) => new CreateOrderHandler(c.resolve('ORDER_REPOSITORY'), c.resolve('PRODUCT_READDAO'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
        opts.addScoped('GET_ORDERS_HANDLER', (c) => new GetOrdersHandler(c.resolve('ORDER_DATA_SOURCE'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
        opts.addScoped('GET_ORDER_BY_ID_HANDLER', (c) => new GetOrderByIdHandler(c.resolve('ORDER_REPOSITORY'), c.resolve('ORDER_MAPPER'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));

        // Repository & DataSource
        opts.addScoped('ORDER_REPOSITORY', (c) => new OrderRepository(c.resolve('ORDER_DATA_SOURCE'), c.resolve('ORDER_MAPPER'), c.resolve(TOKENS.UNIT_OF_WORK)));
        opts.addScoped('ORDER_DATA_SOURCE', (c) => new OrderDataSource(c.resolve(TOKENS.DB_CONTEXT)));

        // Mappers
        opts.addScoped('ORDER_MAPPER', () => new OrderMapper());

        opts.addScoped('CONFIRM_ORDER_HANDLER', (c) => new ConfirmOrderHandler(c.resolve('ORDER_REPOSITORY'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
        opts.addScoped('DENY_ORDER_HANDLER', (c) => new DenyOrderHandler(c.resolve('ORDER_REPOSITORY'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
    }
} as const);
