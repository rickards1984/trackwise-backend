import 'dotenv/config';
import { db } from './db.js';
import { tenants } from '@shared/schema.js';
import { eq } from 'drizzle-orm';

const slug = process.env.SEED_TENANT_SLUG || 'demo';
const name = process.env.SEED_TENANT_NAME || 'Demo Training Provider';
const ukprn = process.env.SEED_TENANT_UKPRN || '12345678';

const run = async () => {
  const existing = await db.query.tenants.findFirst({ where: eq(tenants.slug, slug) });
  if (!existing) {
    await db.insert(tenants).values({ slug, name, ukprn });
    console.log('Seeded tenant:', slug);
  } else {
    console.log('Tenant exists:', slug);
  }
};
run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
