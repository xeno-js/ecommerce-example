import { users } from './auth'
import { orders } from './order';
import { products } from './products';

/**
 * Centralized Database Schema dictionary.
 */
export type DbSchema = {
  orders: typeof orders;
  users: typeof users,
  products: typeof products;
};
