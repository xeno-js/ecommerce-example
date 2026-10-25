import { ProductDto } from "../../../products";

export interface IStockValidationService {
    validate(
            requestedItems: Array<{ productId: string; quantity: number }>,
            dbProducts: ProductDto[]
        ): void
}