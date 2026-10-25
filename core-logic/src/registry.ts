import type { DbSchema } from './schema';
import { IController, IHandler, IMapper, IPaginatedResult, Optional, XenoRegistry } from '@xeno-js/core';
import { DbContext, DbTransaction } from '@xeno-js/postgresql';

import { AuthCallbackCommand, AuthLoginCommand, AuthLogoutCommand, AuthSessionCommand, AuthSessionResponse, AuthSyncCommand, IUserDataSource, IUserRepository, User, UserDto } from './auth';

import { IProductDataSource, IProductRepository, GetProductByIdQuery, GetProductsQuery, ProductDto, ProductMapper } from './products';
import { CreateOrderCommand, GetOrderByIdQuery, GetOrdersQuery, IOrderDataSource, IOrderRepository, IPricingService, IStockValidationService, OrderDto, OrderMapper } from './order';
import { ReserveStockCommand } from './products/application/commands/reserve-stock.command';
import { ConfirmOrderCommand, DenyOrderCommand } from './order/application/commands/order-status.command';

/**
 * @file registry.ts
 * @description Centralized Type Contract for Dependency Injection.
 */
export interface MyRegistry extends XenoRegistry<DbContext<DbSchema>, DbTransaction> {
    // Add your application injection tokens here
    // e.g., USER_REPOSITORY: IUserRepository;
    USER_REPOSITORY: IUserRepository;
    USER_DATA_SOURCE: IUserDataSource;
    AUTH_SYNC_HANDLER: IHandler<AuthSyncCommand, void>;
    USER_MAPPER: IMapper<User, UserDto>;
    AUTH_SYNC_CONTROLLER: IController<void, { success: boolean }>;

    AUTH_CALLBACK_HANDLER: IHandler<AuthCallbackCommand, Optional<void>>;
    AUTH_CALLBACK_CONTROLLER: IController<string, Optional<void>>;

    AUTH_SESSION_HANDLER: IHandler<AuthSessionCommand, AuthSessionResponse>;
    AUTH_SESSION_CONTROLLER: IController<void, Optional<AuthSessionResponse>>;

    AUTH_LOGIN_HANDLER: IHandler<AuthLoginCommand, { url: string }>;
    AUTH_LOGIN_CONTROLLER: IController<string, { url: string }>;

    AUTH_LOGOUT_HANDLER: IHandler<AuthLogoutCommand, void>;
    AUTH_LOGOUT_CONTROLLER: IController<void, void>;

    PRODUCT_READDAO: IProductRepository;
    PRODUCT_DATA_SOURCE: IProductDataSource;
    PRODUCT_MAPPER: ProductMapper;

    GET_PRODUCTS_HANDLER: IHandler<GetProductsQuery, IPaginatedResult<ProductDto>>
    GET_PRODUCTS_CONTROLLER: IController<{ page?: number; pageSize?: number }, IPaginatedResult<ProductDto>>;

    GET_PRODUCT_BY_ID_HANDLER: IHandler<GetProductByIdQuery, Optional<ProductDto>>;
    GET_PRODUCT_BY_ID_CONTROLLER: IController<{ id: string }, Optional<ProductDto>>;

    CREATE_ORDER_CONTROLLER: IController<CreateOrderCommand, void>;
    CREATE_ORDER_HANDLER: IHandler<CreateOrderCommand, void>;
    ORDER_REPOSITORY: IOrderRepository
    ORDER_DATA_SOURCE: IOrderDataSource
    ORDER_MAPPER: OrderMapper

    GET_ORDERS_HANDLER: IHandler<GetOrdersQuery, IPaginatedResult<OrderDto>>;
    GET_ORDERS_CONTROLLER: IController<{ page?: number; pageSize?: number }, IPaginatedResult<OrderDto>>;
    GET_ORDER_BY_ID_HANDLER: IHandler<GetOrderByIdQuery, Optional<OrderDto>>;
    GET_ORDER_BY_ID_CONTROLLER: IController<{ id: string }, Optional<OrderDto>>;

    RESERVE_STOCK_HANDLER: IHandler<ReserveStockCommand, void>;
    CONFIRM_ORDER_HANDLER: IHandler<ConfirmOrderCommand, void>;
    DENY_ORDER_HANDLER: IHandler<DenyOrderCommand, void>;
}
