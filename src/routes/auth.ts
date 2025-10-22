import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users, tenants } from '@shared/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

const regSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  tenantSlug: z.string().min(2)
});

router.post('/register', async (req, res) => {
  try {
    const p = regSchema.parse(req.body);
    const tenant = await db.query.tenants.findFirst({ where: eq(tenants.slug, p.tenantSlug) });
    if (!tenant) return res.status(400).json({ error: 'Unknown tenant' });
    const hash = await bcrypt.hash(p.password, 10);
    const [u] = await db.insert(users).values({
      email: p.email.toLowerCase(),
      password: hash,
      username: p.username,
      firstName: p.firstName,
      lastName: p.lastName,
      role: 'admin'
    }).returning();
    return res.json({ ok: true, userId: u.id });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ error: 'Registration failed' });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
router.post('/login', async (req, res) => {
  try {
    const p = loginSchema.parse(req.body);
    const u = await db.query.users.findFirst({ where: eq(users.email, p.email.toLowerCase()) });
    if (!u) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(p.password, u.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: u.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return res.json({ token, user: { id: u.id, email: u.email, username: u.username } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

export const authRouter = router;
