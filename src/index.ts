import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { tenantResolver } from './middleware/tenant.js';
import { authRouter } from './routes/auth.js';
import { ilrRouter } from './routes/ilr.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(tenantResolver);

app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use('/auth', authRouter);
app.use('/ilr', ilrRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API listening on :${port}`));