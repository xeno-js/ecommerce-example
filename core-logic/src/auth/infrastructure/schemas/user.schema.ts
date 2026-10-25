import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'; 

export const users = pgTable('users', {
 id: text('id').primaryKey(),
 name: text('name').notNull(),
 email: text('email').notNull().unique(),
 tenantId: text('tenant_id'),
 isDeleted: boolean('is_deleted').notNull().default(false),
 deletedAt: timestamp('deleted_at'),
 createdAt: timestamp('created_at').defaultNow(),
 updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
 lastLoginAt: timestamp('last_login_at'),
});

/**
 * Types inferred from the schema.
 * - UserDto: Represents the shape of the data retrieved from the database ($inferSelect).
 * - NewUserDto: Represents the shape of the data required to insert a new record ($inferInsert).
 */
export type UserDto = typeof users.$inferSelect;