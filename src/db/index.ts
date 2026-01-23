import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL environment variable is not set');
}

// Create postgres client for Drizzle
const client = postgres(process.env.DIRECT_URL);

// Create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Export schema for use in queries
export * from './schema';
