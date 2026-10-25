import { BaseHandler, IFactory, Result, ResultType, UserContext, AppError } from '@xeno-js/core';
import { ReserveStockCommand } from '../commands';
import type { IProductRepository } from '../../domain';

export class ReserveStockHandler extends BaseHandler<ReserveStockCommand, void> {
    constructor(
        private readonly _productRepository: IProductRepository,
        identityFactory: IFactory<void, UserContext>
    ) { super(identityFactory); }

    protected async executeAsync(command: ReserveStockCommand, signal: AbortSignal): Promise<ResultType<void>> {
        const ctx = this._getCurrentContext();

        const result = await this._productRepository.findById(command.productId, ctx, signal);
        if (!result.isOk()) return Result.fail(result.getErrorOrThrow());

        const product = result.getValueOrThrow();
        if (!product) return Result.fail(AppError.notFound('ReserveStock', 'Product not found'));

        // Valida lo stock ed emette PRODUCT_RESERVED o PRODUCT_RESERVATION_FAILED
        product.reserveForOrder(command.orderId, command.quantity);

        // Salva e rilascia gli eventi nell'outbox in un'unica transazione
        return await this._productRepository.update(product.id.toString(), product, ctx, signal);
    }
}