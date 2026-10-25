import { Optional, UserContext, AppError, Guards, Enumerable, IPaginatedResult } from '@xeno-js/core';
import { DbContext } from '@xeno-js/postgresql';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { DbSchema } from '../../../schema';
import { products, ProductDto } from '../schemas';
import { IProductDataSource } from '../../domain';

export class ProductDataSource implements IProductDataSource {
    constructor(
        private readonly _db: DbContext<DbSchema>
    ) { }

    public async findById(id: string | number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<ProductDto>> {
        AppError.throwIfAborted(signal, 'ProductDataSource.findById');
        const conditions = [eq(products.id, String(id)), eq(products.isDeleted, false)];
        const result = await this._db.select().from(products).where(and(...conditions)).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }

    public async insert(dto: ProductDto, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.insert');
        await this._db.insert(products).values(dto).execute();
    }

    public async delete(dto: ProductDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.delete');
        const conditions = [eq(products.id, dto.id)];
        
        await this._db.update(products).set({ isDeleted: true, deletedAt: new Date() }).where(and(...conditions)).execute();
    }

    public async update(id: string | number, dto: Partial<ProductDto>, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.update');
        const conditions = [eq(products.id, String(id))];
        
        await this._db.update(products).set(dto).where(and(...conditions)).execute();
    }

    public async findAll(ctx: UserContext, signal: Optional<AbortSignal>): Promise<ProductDto[]> {
        AppError.throwIfAborted(signal, 'ProductDataSource.findAll');
        const conditions = [eq(products.isDeleted, false)];
        return this._db.select().from(products).where(and(...conditions)).execute();
    }

    public async findAllByIdArray(id: string[], signal: Optional<AbortSignal>): Promise<ProductDto[]> {
        AppError.throwIfAborted(signal, 'ProductDataSource.findAllByIdArray');
        return await this._db
            .select()
            .from(products)
            .where(inArray(products.id, id))
            .execute();
    }

    public async findPaginated(page: number, pageSize: number, signal: Optional<AbortSignal>): Promise<IPaginatedResult<ProductDto>> {
        AppError.throwIfAborted(signal, 'ProductDataSource.findPaginated');
        const conditions = [eq(products.isDeleted, false)];

        const numericPage = Number(page) || 1;
        const numericPageSize = Number(pageSize) || 10;
        const offset = (numericPage - 1) * numericPageSize;

        const [{ count }] = await this._db
            .select({ count: sql`count(*)` })
            .from(products)
            .where(and(...conditions))
            .execute();

        const total = Number(count);
        const totalPages = Math.ceil(total / numericPageSize) || 1;

        const items = await this._db
            .select()
            .from(products)
            .where(and(...conditions))
            .limit(numericPageSize)
            .offset(offset)
            .execute();

        return {
            items,
            total,
            page: numericPage,
            pageSize: numericPageSize,
            totalPages,
            hasNextPage: numericPage < totalPages,
            hasPreviousPage: numericPage > 1,
        };
    }

    public async dispose(): Promise<void> { }
}