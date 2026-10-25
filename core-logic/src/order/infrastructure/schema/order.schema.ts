import { boolean, pgTable, text, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';
import { users } from '../../../auth';

export const orders = pgTable('orders', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    tenantId: text('tenant_id'),
    totalAmount: numeric('total_amount').notNull(),
    items: jsonb('items').notNull(),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at'),
    status: text('status').notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export type OrderDto = typeof orders.$inferSelect;
export type NewOrderDto = typeof orders.$inferInsert;
