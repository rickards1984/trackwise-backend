import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // required for Neon / many hosted Postgres
  });

  // Create required extension and base tables
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      ukprn text,
      branding_json text,
      created_at timestamptz DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      display_name text NOT NULL,
      created_at timestamptz DEFAULT now(),
      active boolean DEFAULT true
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_tenants (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      role text NOT NULL,
      PRIMARY KEY (user_id, tenant_id)
    );
  `);

  await pool.end();
  console.log('✅ Bootstrap complete: tables ensured.');
}

main().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
