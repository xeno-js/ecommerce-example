import type { Identity, IHandler, IPaginatedResult, Optional, XenoRegistry } from "@xeno-js/core"
import type { CheckQuerySession, LogoutCommand, SyncUserCommand } from "./auth/application"
import type { LoginCommand } from "./auth/application/command/login.command"
import type { GetProductByIdQuery, GetProductsQuery, ProductDto } from "./products"
import type { CreateOrderCommand, GetOrderByIdQuery, GetOrdersQuery, OrderDto } from "./order"

export interface MyRegistry extends XenoRegistry {
    CHECK_SESSION: IHandler<CheckQuerySession, Identity & { isAuthenticated: boolean }>
    SYNC_USER: IHandler<SyncUserCommand, void>
    LOGIN: IHandler<LoginCommand, { url: string }>
    LOGOUT: IHandler<LogoutCommand, void>
    GET_PRODUCTS: IHandler<GetProductsQuery, IPaginatedResult<ProductDto>>
    GET_PRODUCT_BY_ID: IHandler<GetProductByIdQuery, Optional<ProductDto>>
    CREATE_ORDER: IHandler<CreateOrderCommand, void>
    GET_ORDERS: IHandler<GetOrdersQuery, IPaginatedResult<OrderDto>>;
    GET_ORDER_BY_ID: IHandler<GetOrderByIdQuery, Optional<OrderDto>>;
}