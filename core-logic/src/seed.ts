import type { IServiceScope } from '@xeno-js/core';
import { Guards, GuidHelper, TOKENS } from '@xeno-js/core';
import { products } from './products';
import { MyRegistry } from './registry';

export async function runDatabaseSeed(container: IServiceScope<MyRegistry>): Promise<void> {
    try {
        const db = container.resolve(TOKENS.DB_CONTEXT);

        console.info('🌱 Init Database (Seeding)...');

        const existingProducts = await db.select().from(products).limit(1).execute();

        if (Guards.isNullOrEmpty(existingProducts)) {
            console.info('📦 Products table is empty. Seeding 55 products...');

            const mockProducts = Array.from({ length: 55 }, (_, index) => {
                const id = index + 1;
                return {
                    id: GuidHelper.generate(),
                    name: `Demo Product ${id} - ${['Laptop', 'Keyboard', 'Mouse', 'Monitor', 'Headset', 'Webcam', 'Hub USB', 'Docking Station'][index % 8]}`,
                    description: `Demo description for product ${id}`,
                    price: (19.99 + (index * 15.50) % 500).toFixed(2),
                    stock: 5 + (index * 7) % 95,
                    imageUrl: `https://picsum.photos/seed/product-${id}/400/300`,
                    isDeleted: false,
                };
            });

            await db.insert(products).values(mockProducts).execute();

            console.info('✅ Seed of 55 products completed successfully!');
        } else {
            console.info('✅ Products table is not empty. No seeding needed. Goodbye!');
        }
    } catch (error) {
        console.warn('⚠️ An error occurred during seeding:', error);
    }
}