import { IServiceContainer, TOKENS } from '@xeno-js/core';
import { MyRegistry } from '../registry';
import { productsRoutes } from './products.routes';
import { GetProductsController, GetProductByIdController } from './presentation';
import { GetProductByIdHandler, GetProductsHandler, ProductMapper, ReserveStockHandler } from './application';
import { ProductRepository, ProductDataSource } from './infrastructure';

export const ProductsModule = Object.freeze({
    ROUTES: Object.freeze(productsRoutes),

    register(opts: IServiceContainer<MyRegistry>): void {
        // Controllers
        opts.addTransient('GET_PRODUCTS_CONTROLLER', (c) => new GetProductsController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addTransient('GET_PRODUCT_BY_ID_CONTROLLER', (c) => new GetProductByIdController(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));

        // Handlers
        opts.addScoped('GET_PRODUCTS_HANDLER', (c) => new GetProductsHandler(c.resolve('PRODUCT_READDAO'), c.resolve('PRODUCT_MAPPER'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
        opts.addScoped('GET_PRODUCT_BY_ID_HANDLER', (c) => new GetProductByIdHandler(c.resolve('PRODUCT_READDAO'), c.resolve('PRODUCT_MAPPER'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));

        // Repository & DataSource
        opts.addScoped('PRODUCT_READDAO', (c) => new ProductRepository(c.resolve('PRODUCT_DATA_SOURCE'), c.resolve('PRODUCT_MAPPER'), c.resolve(TOKENS.UNIT_OF_WORK)));
        opts.addScoped('PRODUCT_DATA_SOURCE', (c) => new ProductDataSource(c.resolve(TOKENS.DB_CONTEXT)));

        // Mappers
        opts.addScoped('PRODUCT_MAPPER', () => new ProductMapper());

        opts.addScoped('RESERVE_STOCK_HANDLER', (c) => new ReserveStockHandler(c.resolve('PRODUCT_READDAO'), c.resolve(TOKENS.USER_CONTEXT_FACTORY)));
    }
} as const);