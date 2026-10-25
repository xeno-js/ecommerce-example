import { Order, OrderItemProps } from '../../domain';
import { OrderDto } from '../../infrastructure';
import type { IMapper } from '@xeno-js/core';

export class OrderMapper implements IMapper<Order, OrderDto> {
    public toEntity(dto: OrderDto): Order {
        return Order.fromProps({
            userId: dto.userId,
            tenantId: dto.tenantId,
            totalAmount: Number(dto.totalAmount),
            items: dto.items as OrderItemProps[],
            createdAt: dto.createdAt,
            status: dto.status,
            updatedAt: dto.updatedAt,
            deletedAt: dto.deletedAt,
            isDeleted: dto.isDeleted,
        }, dto.id);
    }

    public toDto(entity: Order): OrderDto {
        const props = entity.getProps();
        return {
            id: entity.id.toString(),
            userId: props.userId,
            tenantId: props.tenantId,
            totalAmount: props.totalAmount.toString(),
            items: props.items,
            status: props.status,
            isDeleted: props.isDeleted,
            deletedAt: props.deletedAt,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }

    public toPartialDto(entity: Partial<Order>): Partial<OrderDto> {
        const props = entity.getProps ? entity.getProps() : {} as any;
        return {
            status: props.status,
            totalAmount: props.totalAmount?.toString(),
            items: props.items,
            isDeleted: props.isDeleted,
            deletedAt: props.deletedAt,
            updatedAt: props.updatedAt,
        };
    }
}