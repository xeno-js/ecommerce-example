import { ProductDto } from "../../../products";

export interface OrderCalculationItem {
    productId: string;
    quantity: number;
}

export interface VerifiedOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IPricingService {
    calculate(
        requestedItems: OrderCalculationItem[],
        dbProducts: ProductDto[]
    ): { totalAmount: number; items: VerifiedOrderItem[] }
}