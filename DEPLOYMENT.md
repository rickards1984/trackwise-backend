# Minimal Backend Deployment Guide for Railway

This directory contains a minimal, production-ready Express + Drizzle + PostgreSQL API designed for Railway deployment.

## ✅ What's Been Built

### File Structure
```
server/
├── src/
│   ├── db.ts                    # PostgreSQL connection with Drizzle
│   ├── index.ts                 # Express server entry point
│   ├── seed.ts                  # Database seeding script
│   ├── middleware/
│   │   └── tenant.ts            # Multi-tenant resolution middleware
│   ├── modules/
│   │   └── ilr/
│   │       └── generator.ts     # ILR 25/26 XML generator
│   └── routes/
│       ├── auth.ts              # Authentication (register/login with JWT)
│       └── ilr.ts               # ILR export endpoint
├── dist/                        # TypeScript compiled output
├── package.json                 # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration

shared/
└── schema.ts                    # Shared Drizzle schema (includes tenants table)
```

### Features Implemented

1. **Multi-Tenant Architecture**
   - Tenants table in shared schema
   - Tenant resolution middleware
   - Seed script to create initial tenant

2. **Authentication System**
   - POST `/auth/register` - User registration with tenant validation
   - POST `/auth/login` - JWT-based authentication
   - bcrypt password hashing

3. **ILR Generation**
   - GET `/ilr/export/:year` - Generates ESFA-compliant ILR 25/26 XML
   - Uses xmlbuilder2 for proper XML formatting
   - Includes Header, Source, LearningProvider, and Learner sections

4. **Health Check**
   - GET `/health` - Simple health check endpoint

## 🚀 Railway Deployment Steps

### Important: Build Configuration Fixed

The `server/` directory contains both:
1. **Main Replit Application** (root-level files like `vite.ts`, `index.ts`)
2. **Minimal Railway Backend** (in `src/` subdirectory)

The `tsconfig.json` has been configured to **exclude all root-level files** and only compile the minimal backend in `src/`. This ensures Railway won't encounter import errors from the Replit-specific files.

### 1. Prerequisites
- Railway account
- PostgreSQL database provisioned in Railway

### 2. Environment Variables
Set these in Railway's environment variables:

```bash
DATABASE_URL=<your-railway-postgres-connection-string>
JWT_SECRET=6f712e4479ef7a67e227a37f1c19428d031a006e17d2e4eb0056cf7a4204becfc1db6bb11c8f90554f85dc9264af0e5d
SEED_TENANT_SLUG=demo
SEED_TENANT_NAME=Demo Training Provider
SEED_TENANT_UKPRN=12345678
PORT=3000
NODE_ENV=production
```

### 3. Railway Configuration

#### Option A: Deploy from GitHub
1. Push this code to a GitHub repository
2. Connect Railway to your GitHub repo
3. Set the **Root Directory** to `server`
4. Railway will automatically detect `package.json`

#### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set environment variables
railway variables set DATABASE_URL=<connection-string>
railway variables set JWT_SECRET=<your-secret>
railway variables set SEED_TENANT_SLUG=demo
railway variables set SEED_TENANT_NAME="Demo Training Provider"
railway variables set SEED_TENANT_UKPRN=12345678

# Deploy
cd server
railway up
```

### 4. Build and Start Commands

Railway should auto-detect these from `package.json`:

```json
{
  "scripts": {
    "build": "tsc -p .",
    "start": "node dist/server/src/index.js",
    "seed": "ts-node src/seed.ts"
  }
}
```

**Important:** Railway will run:
- Build: `npm run build`
- Start: `npm run start`

### 5. Post-Deployment

After deployment, run the seed script once to create your initial tenant:

```bash
railway run npm run seed
```

Or connect to your Railway deployment and make a manual database insert:

```sql
INSERT INTO tenants (slug, name, ukprn)
VALUES ('demo', 'Demo Training Provider', '12345678');
```

## 🧪 Testing the Deployed API

### Health Check
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"ok": true, "ts": "2025-10-21T23:30:00.000Z"}
```

### Register a User
```bash
curl -X POST https://your-app.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "tenantSlug": "demo"
  }'
```

### Login
```bash
curl -X POST https://your-app.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin"
  }
}
```

### Export ILR XML
```bash
curl https://your-app.railway.app/ilr/export/2526
```

Expected response: Valid ESFA ILR 25/26 XML

## 📦 Dependencies

### Production
- `express` - Web framework
- `cors` - CORS middleware
- `helmet` - Security headers
- `pg` - PostgreSQL client
- `drizzle-orm` - Type-safe ORM
- `zod` - Schema validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `xmlbuilder2` - XML generation
- `dotenv` - Environment variables

### Development
- `typescript` - Type checking
- `ts-node` - TypeScript execution
- `nodemon` - Development server
- Type definitions for all packages

## 🔧 Local Development

To run locally (requires PostgreSQL):

```bash
cd server
npm install
npm run build
npm run seed
npm run dev
```

Server will start on `http://localhost:3000`

## 📝 Notes

- The TypeScript build outputs to `server/dist/server/src/` and `server/dist/shared/`
- The start command points to the correct path: `node dist/server/src/index.js`
- Schema is shared between main app and minimal backend via `shared/schema.ts`
- Multi-tenant support is built-in from the start
- ILR generator follows ESFA 2025-26 specification

## ⚠️ Important

1. **Database Migrations**: Use Drizzle Kit for schema changes:
   ```bash
   npx drizzle-kit push:pg
   ```

2. **Security**: Change `JWT_SECRET` to a new random value for production

3. **UKPRN**: Replace with your actual UK Provider Reference Number

4. **Tenant Data**: Update tenant information for your organization
