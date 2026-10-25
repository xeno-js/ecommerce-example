import type { IFactory, ResultType, UserContext } from '@xeno-js/core';
import { AppError, BaseHandler, Result } from '@xeno-js/core';
import { CreateOrderCommand } from '../commands';
import { IOrderRepository, Order } from '../../domain';
import { IProductRepository } from '../../../products';

export class CreateOrderHandler extends BaseHandler<CreateOrderCommand, void> {
    constructor(
        private readonly _orderRepository: IOrderRepository,
        private readonly _productRepository: IProductRepository,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    protected async executeAsync(command: CreateOrderCommand, signal: AbortSignal): Promise<ResultType<void>> {
        const ctx = this._getCurrentContext();
        if (!ctx.userId) {
            return Result.fail(AppError.unauthorized('CreateOrderHandler', 'User context is missing'));
        }

        const productIds = command.items.map(i => i.productId);

        const productsResult = await this._productRepository.findAllByIdArray(productIds, signal)
        if (!productsResult.isOk()) {
            return Result.fail(productsResult.getErrorOrThrow());
        }
        const dbProducts = productsResult.getValueOrThrow() ?? [];

        const newOrder = Order.create({
            userId: ctx.userId.toString(),
            tenantId: ctx.tenantId ? ctx.tenantId.toString() : null,
            items: dbProducts.map(p => {
                const props = p.getProps()
                return {
                    productId: p.id.toString(),
                    name: props.name,
                    price: props.price,
                    quantity: command.items.find(i => i.productId === p.id.toString())?.quantity ?? 1,
                }
            }),
        });

        const saveResult = await this._orderRepository.save(newOrder, signal);
        if (!saveResult.isOk()) return Result.fail(saveResult.getErrorOrThrow());

        return Result.ok();
    }
}
