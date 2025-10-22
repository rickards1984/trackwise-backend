# Railway Deployment Fixes

## Issues Fixed (Oct 22, 2025)

### 1. Missing Dependency
- ✅ Added `drizzle-zod` to package.json dependencies

### 2. Schema Property Mismatches
The minimal backend schema uses different field names than the full platform:

**Fixed in `src/routes/auth.ts`:**
- ❌ `password` → ✅ `passwordHash`
- ❌ `username`, `firstName`, `lastName` → ✅ `displayName`

### 3. Self-Contained Schema
- ✅ Created `src/shared/schema.ts` inside the server directory
- ✅ Updated `tsconfig.json` to use local schema
- ✅ No external dependencies on parent workspace

## Schema Structure

The minimal backend uses this simplified schema:

```typescript
// Tenants
{
  id: serial
  slug: text (unique)
  name: text
  ukprn: text (optional)
  createdAt: timestamp
}

// Users
{
  id: serial
  email: text (unique)
  passwordHash: text
  displayName: text
  createdAt: timestamp
  active: boolean
}

// UserTenants (join table)
{
  userId: integer (FK)
  tenantId: integer (FK)
  role: text
}
```

## Updated API Endpoints

### Register
```bash
POST /auth/register
{
  "email": "admin@example.com",
  "password": "ChangeMe123!",
  "displayName": "Admin User",
  "tenantSlug": "demo"
}
```

### Login
```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "ChangeMe123!"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "displayName": "Admin User"
  }
}
```

## Deployment Status

✅ All TypeScript compilation errors fixed
✅ Railway should build successfully
✅ Ready for deployment
