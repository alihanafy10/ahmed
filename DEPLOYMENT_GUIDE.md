# Vercel Deployment Guide

## 🚀 Deploy Accident Reporting System to Vercel

This guide will help you deploy both the **Backend API** and **Frontend** to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code is already at `https://github.com/alihanafy10/ahmed`
3. **MongoDB Atlas**: Your database is already configured

---

## 🔧 Step 1: Deploy Backend API

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `alihanafy10/ahmed`
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://alikato:ytIbBw68Uxr1jeBG@kato.ixssyb0.mongodb.net/ahmed?retryWrites=true&w=majority
   JWT_SECRET=accident_report_super_secret_jwt_key_2024_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

5. Click **Deploy**

6. **Save your backend URL**: e.g., `https://your-backend.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to backend folder
cd backend

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

---

## 🎨 Step 2: Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same repository**: `alihanafy10/ahmed`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**:
   
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```
   
   ⚠️ Replace `https://your-backend.vercel.app` with your actual backend URL from Step 1

5. Click **Deploy**

---

## 🔄 Step 3: Update Backend CORS

After deploying the frontend, you need to update the backend to allow requests from your frontend URL.

1. Go to your backend project in Vercel Dashboard
2. Settings → Environment Variables
3. Add a new variable:
   ```
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
   
4. Redeploy the backend (Deployments → Click "..." → Redeploy)

---

## ✅ Step 4: Test Your Deployment

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try to register a new user
3. Login and create an accident report
4. Verify everything works correctly

---

## 🔐 Security Notes

1. **Change JWT_SECRET** in production to a strong random string
2. **MongoDB Credentials**: Consider creating a separate database user for production
3. **Environment Variables**: Never commit `.env` file to GitHub (already protected)

---

## 📱 Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://ahmed-frontend.vercel.app` (or similar)
- **Backend API**: `https://ahmed-backend.vercel.app` (or similar)
- **Database**: MongoDB Atlas (already configured)

---

## 🛠️ Troubleshooting

### Backend Issues:
- Check Vercel logs: Deployments → View Function Logs
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend Issues:
- Check browser console for CORS errors
- Verify `VITE_API_URL` is set correctly
- Ensure backend CORS_ORIGIN includes frontend URL

### Database Connection:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database credentials are correct
- Test connection string in MongoDB Compass

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- **Push to master**: Deploys to production
- **Push to other branches**: Creates preview deployments

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Project Issues: https://github.com/alihanafy10/ahmed/issues

---

**Happy Deploying! 🚀**
