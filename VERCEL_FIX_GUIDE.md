# 🔧 Vercel Backend Fix Guide

## Problem
The backend deployment on Vercel is returning 500 errors because of serverless configuration issues.

## Solution: Redeploy Backend on Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your **backend project** (ahmed-roan)

### Step 2: Verify Environment Variables
Click on **Settings** → **Environment Variables** and ensure ALL these variables are set:

```
MONGODB_URI=mongodb+srv://alikato:ytIbBw68Uxr1jeBG@kato.ixssyb0.mongodb.net/ahmed?retryWrites=true&w=majority
JWT_SECRET=accident_report_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=production
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/tmp/uploads
CORS_ORIGIN=*
```

⚠️ **IMPORTANT**: Make sure there are NO spaces or extra characters!

### Step 3: Force Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** - UNCHECK this box
6. Click **"Redeploy"**

### Step 4: Wait and Monitor
1. Wait 2-3 minutes for deployment to complete
2. Click on the deployment to see logs
3. Look for errors in the **Function Logs**

### Step 5: Test the Backend
After redeployment, test:
```bash
curl https://ahmed-roan.vercel.app/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Accident Report API is running",
  "timestamp": "..."
}
```

---

## Alternative: Redeploy from Scratch

If the above doesn't work, try redeploying from scratch:

### 1. Delete Current Backend Project
- Go to Settings → General → Delete Project

### 2. Create New Deployment
1. Go to: https://vercel.com/new
2. Import: `alihanafy10/ahmed`
3. **Root Directory**: `backend`
4. **Framework Preset**: Other
5. Add ALL environment variables (from Step 2 above)
6. Click **Deploy**

---

## What We Fixed in Code

The latest push includes:
- ✅ Created `api/index.js` for proper Vercel serverless structure
- ✅ Updated `vercel.json` to use api folder
- ✅ Fixed database connection pooling for serverless
- ✅ Added DB connection middleware for each request
- ✅ Improved error handling and logging

---

## Troubleshooting

### Still Getting 500 Errors?
1. Check Vercel Function Logs for actual error
2. Verify MongoDB Atlas allows connections from `0.0.0.0/0`
3. Test MongoDB connection string in MongoDB Compass
4. Ensure environment variables are set correctly (no typos!)

### MongoDB Connection Issues?
1. Go to MongoDB Atlas
2. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Database Access → Verify user `alikato` has read/write permissions

### Vercel Logs Show Timeout?
- Check if MongoDB Atlas is responding
- Try increasing function timeout (already set to 10s)

---

## After Backend is Fixed

Once the health endpoint works, test registration:
```bash
curl -X POST https://ahmed-roan.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "nationalId": "12345678901234",
    "phone": "01012345678",
    "email": "test@example.com",
    "password": "password123",
    "birthDate": "1995-01-15",
    "address": "Test Address",
    "governorate": "القاهرة"
  }'
```

---

## Need More Help?

If you're still having issues:
1. Share the Vercel Function Logs
2. Check if the deployment shows any build errors
3. Verify the `api/index.js` file exists in the deployed version

**The code is ready - you just need to redeploy on Vercel with correct settings!**
