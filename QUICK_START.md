# Quick Start - Railway Deployment

## ✅ Your Backend is Ready!

Everything is configured and ready to deploy to Railway. Here's the fastest way to get started:

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub (1 minute)

```bash
git add server/
git commit -m "Add minimal backend for Railway deployment"
git push
```

### Step 2: Deploy to Railway (2 minutes)

1. Go to **[railway.app/new](https://railway.app/new)**
2. Click "Deploy from GitHub repo"
3. Select your repository
4. **IMPORTANT:** Set **Root Directory** to `server`
5. Click "Deploy"

### Step 3: Add Database (1 minute)

1. In Railway project, click "New" → "Database" → "PostgreSQL"
2. Done! Railway auto-sets `DATABASE_URL`

### Step 4: Set Environment Variables (1 minute)

Copy these from your Replit Secrets to Railway:

```
JWT_SECRET=6f712e4479ef7a67e227a37f1c19428d031a006e17d2e4eb0056cf7a4204becfc1db6bb11c8f90554f85dc9264af0e5d
SEED_TENANT_SLUG=<your-value>
SEED_TENANT_NAME=<your-value>
SEED_TENANT_UKPRN=<your-value>
```

### Step 5: Seed Database (30 seconds)

In Railway dashboard or CLI:

```bash
railway run npm run seed
```

## ✨ That's It!

Your API is now live at: `https://your-app.railway.app`

## 🧪 Test Your Deployment

```bash
# Replace with your Railway URL
URL="https://your-app.railway.app"

# Health check
curl $URL/health

# Generate ILR XML
curl $URL/ilr/export/2526

# Register user
curl -X POST $URL/auth/register \
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

## 📝 What You Get

✅ Multi-tenant architecture  
✅ JWT authentication  
✅ User registration & login  
✅ ILR 25/26 XML generation (ESFA-compliant)  
✅ PostgreSQL database  
✅ Production-ready security (Helmet, CORS, bcrypt)  

## 📚 More Info

- **Detailed instructions:** See `DEPLOYMENT.md`
- **Status & verification:** See `RAILWAY_DEPLOYMENT_STATUS.md`
- **Build fix details:** See `RAILWAY_BUILD_FIX.md`
- **Full documentation:** See `README.md`

## 💡 Pro Tips

1. **Custom Domain:** Add in Railway dashboard → Settings → Domains
2. **View Logs:** Railway dashboard → Deployments → View Logs
3. **Database Access:** Railway dashboard → PostgreSQL → Connect
4. **Auto-Deploy:** Railway auto-deploys on every GitHub push

---

**Ready to go!** Follow Step 1 above to get started. 🚀
