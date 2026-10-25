import { NativeRouteDefinition, ResponseDto } from "@xeno-js/core";
import { MyRegistry } from "./registry";
import { AuthModule } from "./auth";
import { ProductsModule } from "./products";
import { OrdersModule } from "./order";

export const routes: NativeRouteDefinition<MyRegistry>[] = [
    ...AuthModule.ROUTES,
    ...ProductsModule.ROUTES,
    ...OrdersModule.ROUTES
];