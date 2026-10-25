export interface ProductDto {
        id: string;
        name: string;
        description: string;
        price: number;
        stock: BigInteger;
        imageUrl: string;
        isDeleted: boolean;
        deletedAt: Date;
        createdAt: Date;
        updatedAt: Date;
}