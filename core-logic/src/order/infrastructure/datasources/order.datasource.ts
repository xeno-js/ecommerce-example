import type { Optional, UserContext, IPaginatedResult } from '@xeno-js/core';
import { AppError, Enumerable, Guards } from '@xeno-js/core';
import { DbContext } from '@xeno-js/postgresql';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { DbSchema } from '../../../schema';
import type { IOrderDataSource } from '../../domain';
import { OrderDto, orders } from '../schema';

export class OrderDataSource implements IOrderDataSource {
    constructor(
        private readonly _db: DbContext<DbSchema>
    ) { }

    public async findById(id: string | number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<OrderDto>> {
        AppError.throwIfAborted(signal, 'OrderDataSource.findById');
        const conditions = [eq(orders.id, String(id)), eq(orders.isDeleted, false)];
        if (Guards.isDefined(ctx.tenantId)) conditions.push(eq(orders.tenantId, ctx.tenantId));
        if (Guards.isDefined(ctx.userId)) conditions.push(eq(orders.userId, ctx.userId));

        const result = await this._db.select().from(orders).where(and(...conditions)).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }

    public async findAll(ctx: UserContext, signal: Optional<AbortSignal>): Promise<OrderDto[]> {
        AppError.throwIfAborted(signal, 'OrderDataSource.findAll');
        if (!Guards.isDefined(ctx.tenantId)) return [];
        return await this._db.select().from(orders).where(eq(orders.tenantId, ctx.tenantId)).execute();
    }

    public async insert(dto: OrderDto, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.insert');
        await this._db.insert(orders).values(dto).execute();
    }

    public async delete(dto: OrderDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.delete');
        const conditions = [eq(orders.id, dto.id)];
        if (Guards.isDefined(ctx.tenantId)) conditions.push(eq(orders.tenantId, ctx.tenantId));
        await this._db.update(orders).set({ isDeleted: true, deletedAt: new Date() }).where(and(...conditions)).execute();
    }

    public async update(id: string | number, dto: Partial<OrderDto>, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'OrderDataSource.update');
        const conditions = [eq(orders.id, String(id))];
        if (Guards.isDefined(ctx.tenantId)) conditions.push(eq(orders.tenantId, ctx.tenantId));
        await this._db.update(orders).set(dto).where(and(...conditions)).execute();
    }

    public async findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<OrderDto[]> {
        AppError.throwIfAborted(signal, 'OrderDataSource.findByUserId');
        const conditions = [eq(orders.userId, userId), eq(orders.isDeleted, false)];
        if (Guards.isDefined(ctx.tenantId)) conditions.push(eq(orders.tenantId, ctx.tenantId));

        return await this._db.select()
            .from(orders)
            .where(and(...conditions))
            .orderBy(desc(orders.createdAt))
            .execute();
    }

    public async findPaginatedByUserId(userId: string, page: number, pageSize: number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<IPaginatedResult<OrderDto>> {
        AppError.throwIfAborted(signal, 'OrderDataSource.findPaginatedByUserId');
        const conditions = [eq(orders.userId, userId), eq(orders.isDeleted, false)];
        if (Guards.isDefined(ctx.tenantId)) conditions.push(eq(orders.tenantId, ctx.tenantId));

        const numericPage = Number(page) || 1;
        const numericPageSize = Number(pageSize) || 10;
        const offset = (numericPage - 1) * numericPageSize;

        const [{ count }] = await this._db
            .select({ count: sql`count(*)` })
            .from(orders)
            .where(and(...conditions))
            .execute();

        const total = Number(count);
        const totalPages = Math.ceil(total / numericPageSize) || 1;

        const items = await this._db
            .select()
            .from(orders)
            .where(and(...conditions))
            .orderBy(desc(orders.createdAt))
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
