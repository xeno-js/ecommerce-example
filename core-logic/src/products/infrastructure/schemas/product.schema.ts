import { boolean, pgTable, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price').notNull(),
    stock: integer('stock').notNull().default(0),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
    imageUrl: text('image_url'),
});

export type ProductDto = typeof products.$inferSelect;
export type NewProductDto = typeof products.$inferInsert;