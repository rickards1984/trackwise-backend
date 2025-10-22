import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL,
                      ssl: true });
export const db = drizzle(pool, { schema });
export type DB = typeof db;