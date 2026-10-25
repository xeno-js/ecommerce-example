import type { Optional, UserContext } from '@xeno-js/core'
import { AppError, Enumerable, Guards } from '@xeno-js/core';
import { UserDto, users } from '../schemas/user.schema';
import { IUserDataSource } from '../../domain/contracts/iuser-datasource.contract';
import { and, eq } from 'drizzle-orm';
import { DbContext } from '@xeno-js/postgresql';
import { DbSchema } from '../../../schema';

export class UserDataSource implements IUserDataSource {
    constructor(private readonly _db: DbContext<DbSchema>) { }

    public async findById(id: string | number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<UserDto>> {
        AppError.throwIfAborted(signal, 'UserDataSource.findById');
        const db = this._db;
        const conditions = [eq(users.id, String(id))];
        if (Guards.isDefined(ctx.tenantId))
            conditions.push(eq(users.tenantId, ctx.tenantId));

        const result = await db.select().from(users).where(and(...conditions)).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }

    public async findAll(ctx: UserContext, signal: Optional<AbortSignal>): Promise<UserDto[]> {
        AppError.throwIfAborted(signal, 'UserDataSource.findAll');
        const db = this._db;
        if(!Guards.isDefined(ctx.tenantId))
            return []

        return db.select().from(users).where(eq(users.tenantId, ctx.tenantId)).execute();
    }

    public async insert(dto: UserDto, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.insert');
        const db = this._db;
        await db.insert(users).values(dto).execute();
    }

    public async delete(dto: UserDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.delete');
        const db = this._db;

        const conditions = [eq(users.id, dto.id)];
        if (Guards.isDefined(ctx.tenantId))
            conditions.push(eq(users.tenantId, ctx.tenantId));

        await db.update(users)
            .set({ name: 'deleted user', email: `deleted_${dto.id}@anonymized.local`, isDeleted: true, deletedAt: new Date() })
            .where(and(...conditions))
            .execute();
    }

    public async update(id: string | number, dto: Partial<UserDto>, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.update');
        const db = this._db;
        const { id: _, tenantId: __, createdAt: ___, ...safeUpdateFields } = dto;
        const conditions = [eq(users.id, String(id))];
        if (Guards.isDefined(ctx.tenantId)) {
            conditions.push(eq(users.tenantId, ctx.tenantId));
        }
        await db.update(users).set(safeUpdateFields).where(and(...conditions)).execute()
    }

    public async dispose(): Promise<void> {
        // Implement any necessary cleanup logic here
        // For demonstration, no resources to clean up
    }

    public async findByEmail(email: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<UserDto>> {
        AppError.throwIfAborted(signal, 'UserDataSource.findByEmail');
        const db = this._db;
        const conditions = [eq(users.email, email)];
        if (Guards.isDefined(ctx.tenantId))
            conditions.push(eq(users.tenantId, ctx.tenantId));
        const result = await db.select().from(users).where(and(...conditions)).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }

    public async upsert(dto: UserDto, partialDto: Partial<UserDto>, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.upsert');

        const db = this._db;

        const { createdAt, id, ...safeSetData } = partialDto;

        await db.insert(users)
            .values({
                ...dto,
                createdAt: dto.createdAt ?? new Date(),
            })
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    ...safeSetData,
                    updatedAt: new Date(),
                    lastLoginAt: partialDto.lastLoginAt ?? new Date(),
                }
            })
            .execute();
    }
}
