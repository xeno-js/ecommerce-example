import type { IMapper } from '@xeno-js/core';
import { Product, ProductProps } from '../../domain';
import { ProductDto } from '../../infrastructure';

export class ProductMapper implements IMapper<Product, ProductDto> {
    public toEntity(dto: ProductDto): Product {
        const props: ProductProps = {
            name: dto.name,
            description: dto.description,
            price: Number(dto.price),
            stock: dto.stock,
            imageUrl: dto.imageUrl,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            deletedAt: dto.deletedAt,
            isDeleted: dto.isDeleted
        };
        return Product.fromProps(props, dto.id);
    }

    public toDto(entity: Product): ProductDto {
        const props = entity.getProps();
        return {
            id: entity.getId().toString(),
            name: props.name,
            description: props.description,
            price: props.price.toString(),
            stock: props.stock,
            imageUrl: props.imageUrl,
            createdAt: props.createdAt,
            isDeleted: props.isDeleted ?? false,
            deletedAt: props.deletedAt,
            updatedAt: props.updatedAt,
        };
    }

    public toPartialDto(entity: Partial<Product>): Partial<ProductDto> {
        const props = entity.getProps ? entity.getProps() : {} as ProductProps;
        return {
            name: props.name,
            description: props.description,
            price: props.price?.toString(),
            stock: props.stock,
            imageUrl: props.imageUrl,
            isDeleted: props.isDeleted
        };
    }
}