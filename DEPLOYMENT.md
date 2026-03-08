# 🚀 Deployment Guide

## Architecture Overview

This application has two separate parts that need to be deployed:
- **Frontend (React + Vite)** → Deploy to Vercel
- **Backend (Express + PostgreSQL + Redis)** → Deploy to Railway, Render, or similar

## 📦 Backend Deployment (Deploy First!)

### Render (FREE - Recommended ✅)

#### Step 1: Create PostgreSQL Database

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `restaurant-booking-db`
   - **Database**: `restaurant_booking` (or any name)
   - **User**: (auto-generated)
   - **Region**: Choose closest to your location
   - **PostgreSQL Version**: 15 or 16
   - **Datadog API Key**: Leave blank
   - **Instance Type**: **Free** ⭐
4. Click **"Create Database"**
5. Wait for it to provision (~1 minute)
6. Once created, scroll down and copy the **"Internal Database URL"** (starts with `postgresql://`)
   - Example: `postgresql://user:pass@dpg-xxxxx:5432/restaurant_booking`

#### Step 2: Create Redis Instance

1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name**: `restaurant-booking-redis`
   - **Region**: **Same region as your database**
   - **Maxmemory Policy**: `noeviction` (default)
   - **Instance Type**: **Free** ⭐
3. Click **"Create Redis"**
4. Once created, copy the **"Internal Redis URL"** (starts with `redis://`)
   - Example: `redis://red-xxxxx:6379`

#### Step 3: Deploy Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository or select it if already connected
3. **⚠️ IMPORTANT - Configure these settings exactly:**
   ```
   Name: restaurant-booking-backend
   Region: Same region as database and Redis
   Branch: main
   Root Directory: backend          ⚠️ MUST SET THIS!
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free              ⭐
   ```
4. **BEFORE clicking "Create Web Service"**, scroll down to **"Advanced"** section
5. Click **"Add Environment Variable"** and add these:

   ```bash
   NODE_ENV=production
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   REDIS_URL=<paste-internal-redis-url-from-step-2>
   JWT_SECRET=change-this-to-a-random-secure-string
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   ⚠️ **Important Notes:**
   - Use **Internal URLs** for DATABASE_URL and REDIS_URL (not External)
   - Generate a random JWT_SECRET: `openssl rand -base64 32`
   - Get Gmail App Password: https://myaccount.google.com/apppasswords
   - You'll update FRONTEND_URL later after deploying to Vercel

6. Click **"Create Web Service"**
7. Wait for deployment (~2-3 minutes)
8. Once deployed, copy your backend URL from the top of the page
   - Example: `https://restaurant-booking-backend.onrender.com`

#### Step 4: Test Backend

Open your backend URL in a browser and add `/api/health` or `/api/menu`:
```
https://restaurant-booking-backend.onrender.com/api/menu
```

If you see JSON data, it's working! 🎉

**⚠️ Common Issue**: If you see "Database connection error" in logs:
- You likely didn't set environment variables yet
- Go back to Step 3 and make sure all environment variables are added
- Especially check `DATABASE_URL` and `REDIS_URL` are using **Internal URLs**

---

#### How to Find Internal URLs on Render

**For PostgreSQL Database:**
1. Click on your database name in the dashboard
2. Scroll to **"Connections"** section
3. You'll see two URLs:
   - **Internal Database URL** ✅ Use this one!
   - **External Database URL** ❌ Don't use this
4. Copy the Internal URL (click the copy icon)

**For Redis:**
1. Click on your Redis instance in the dashboard
2. Look for **"Internal Redis URL"** on the info page
3. Copy the Internal URL (format: `redis://red-xxxxx:6379`)

**Why Internal URLs?**
- Free (External URLs cost money on Render)
- Faster (same network)
- More secure (not exposed to internet)

---

### 🚨 If You're Seeing Connection Errors in Logs

Your backend might be deployed but showing these errors:
- ❌ `Database connection error: ConnectionRefusedError`
- ⚠️ `Redis unavailable - running without cache`

**This means environment variables aren't set correctly!**

**Quick Fix:**
1. Go to your **PostgreSQL database** → Copy the **Internal Database URL**
2. Go to your **Redis instance** → Copy the **Internal Redis URL**
3. Go to your **Web Service** → **Environment** tab
4. Add/update these variables:
   - `DATABASE_URL` = Internal Database URL from PostgreSQL
   - `REDIS_URL` = Internal Redis URL from Redis
5. Click **"Save Changes"** → Service will restart

Within 30 seconds, check your logs - connection errors should be gone! ✅

---

### Railway (Paid - $5/month)

⚠️ Railway no longer offers a free tier. Requires credit card and charges $5/month minimum.

1. **Create Railway account**: https://railway.app
2. **Create new project** → Select "Deploy from GitHub"
3. **Configure the backend**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add services**:
   - PostgreSQL (from Railway templates)
   - Redis (from Railway templates)
5. **Set environment variables** (same as Render above)
6. **Deploy** and note your backend URL

## 🌐 Frontend Deployment (Deploy Second!)

### Vercel Deployment

1. **Push your code to GitHub** (if not already done)

2. **Import project to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

3. **Configure build settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as `.` (the vercel.json handles this)
   - **Build Command**: Automatically detected
   - **Output Directory**: Automatically detected

4. **Add environment variable**:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
   - Replace with your actual backend URL from backend deployment
   - ⚠️ Make sure to include `/api` at the end!

5. **Deploy**!

6. **After deployment, update backend's FRONTEND_URL**:
   - Copy your Vercel URL (e.g., `https://your-app-name.vercel.app`)
   - Go back to Render → Your web service → Environment
   - Update `FRONTEND_URL` to your Vercel URL
   - Click **"Save Changes"** (service will restart automatically)

## ✅ Post-Deployment Checklist

After completing all deployment steps:

- [ ] **Backend is running** 
  - Visit: `https://your-backend.onrender.com/api/menu`
  - Should see JSON data (menu items)
  
- [ ] **Frontend is deployed to Vercel**
  - Visit your Vercel URL
  - Should see the homepage
  
- [ ] **Environment variables are set correctly**
  - Backend: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `EMAIL_*`, `FRONTEND_URL` ✓
  - Frontend: `VITE_API_URL` ✓
  
- [ ] **CORS is configured**
  - `FRONTEND_URL` in backend matches your Vercel URL exactly
  - No trailing slash in FRONTEND_URL
  
- [ ] **Test core functionality**
  - [ ] User registration works
  - [ ] User login works  
  - [ ] View menu items
  - [ ] Create a booking
  - [ ] View bookings in "My Bookings"
  - [ ] Real-time updates appear (Socket.io)
  - [ ] Email confirmation received (check spam folder)

- [ ] **Optional: Set up uptime monitoring**
  - Sign up at https://uptimerobot.com (free)
  - Add HTTP monitor for your backend URL
  - Set interval to 14 minutes (to prevent cold starts)

## 🔧 Troubleshooting

### ❌ "Could not read package.json: ENOENT"
**Error**: `npm error enoent Could not read package.json`

**Cause**: Root Directory not set to `backend`

**Fix**: 
1. Go to Render dashboard → Your web service
2. Click **"Settings"** in the left sidebar
3. Find **"Root Directory"** 
4. Set it to: `backend`
5. Click **"Save Changes"**
6. Service will automatically redeploy

### ❌ CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Fix**: Make sure `FRONTEND_URL` is set correctly in backend environment variables to your exact Vercel URL.

### ❌ API Not Reachable
**Error**: `Network Error` or `ERR_CONNECTION_REFUSED`

**Fix**: 
- Verify `VITE_API_URL` in Vercel includes `/api` at the end
- Example: `https://your-backend.onrender.com/api` (not just `https://your-backend.onrender.com`)
- Check backend is running by visiting the URL directly

### ❌ Socket.io Not Working
**Error**: Real-time updates not appearing

**Fix**: 
- Check that your backend service supports WebSockets (Render and Railway do)
- Verify Socket.io URL matches your backend URL
- Check browser console for connection errors

### ❌ Database Connection Errors
**Error**: `ConnectionRefusedError [SequelizeConnectionRefusedError]` or `ECONNREFUSED`

**Cause**: Missing or incorrect `DATABASE_URL` environment variable

**Fix**: 
1. Go to Render → Your **PostgreSQL database** (not web service)
2. Scroll down to **"Connections"** section
3. Copy the **"Internal Database URL"** (NOT External!)
   - Should start with: `postgresql://`
   - Example: `postgresql://restaurant_booking_user:xxxxx@dpg-xxxxx/restaurant_booking`
4. Go to your **Web Service** → **Environment** tab
5. Find `DATABASE_URL` variable
6. If it doesn't exist, click **"Add Environment Variable"**:
   - Key: `DATABASE_URL`
   - Value: Paste the Internal Database URL
7. If it exists, click the edit icon and update it
8. Click **"Save Changes"**
9. Service will automatically restart and reconnect ✅

**Important**: Always use **Internal URLs** - they're faster and free on Render!

### ❌ Redis Connection Errors
**Error**: `Redis unavailable - running without cache`

**Cause**: Missing or incorrect `REDIS_URL` environment variable

**Fix**: 
1. Go to Render → Your **Redis instance** (not web service)
2. Find **"Internal Redis URL"** on the info page
   - Should start with: `redis://`
   - Example: `redis://red-xxxxx:6379`
3. Go to your **Web Service** → **Environment** tab
4. Add or update `REDIS_URL`:
   - Key: `REDIS_URL`
   - Value: Paste the Internal Redis URL
5. Click **"Save Changes"**
6. Service will automatically restart ✅

### ❌ Render Service Sleeping (Cold Start)
**Issue**: First request takes 30+ seconds after inactivity

**This is normal on free tier.** Solutions:
- Upgrade to paid tier ($7/month) for always-on
- Use UptimeRobot to ping your backend every 14 minutes
- Accept the cold start delay

## 🔄 Redeploying

### Automatic Deployments (Recommended)

Both Render and Vercel support automatic deployments from GitHub:

**Backend (Render)**:
1. Push code to GitHub: `git push origin main`
2. Render automatically detects changes and redeploys
3. Wait ~2-3 minutes for deployment

**Frontend (Vercel)**:
1. Push code to GitHub: `git push origin main`
2. Vercel automatically detects changes and redeploys
3. Wait ~1-2 minutes for deployment

### Manual Deployments

**Backend (Render)**:
- Go to your web service dashboard
- Click "Manual Deploy" → "Deploy latest commit"

**Frontend (Vercel)**:
- Go to your project dashboard
- Click "Deployments" → "Redeploy" on the latest deployment

### Environment Variable Changes

**Backend (Render)**:
1. Go to web service → Environment tab
2. Update the variable value
3. Click "Save Changes"
4. Service automatically restarts (~30 seconds)

**Frontend (Vercel)**:
1. Go to project → Settings → Environment Variables
2. Update the variable value
3. Go to Deployments → Click "..." on latest → "Redeploy"
4. ⚠️ **Important**: Vercel requires a redeploy for env var changes to take effect

## 📝 Important Notes

- **Don't deploy backend to Vercel** - It uses serverless functions which don't support:
  - Persistent connections (Socket.io)
  - In-memory Redis
  - Long-running processes
  
- **The `vercel.json` in the root** configures Vercel to:
  - Build from the `frontend` directory
  - Output to `frontend/dist`
  - Handle React Router's client-side routing

## 💰 Free Tier Limits

### Render (Free Tier)
- **Web Services**: 750 hours/month (enough for 1 service running 24/7)
- **PostgreSQL**: Free forever (with limitations: 1GB storage, expires after 90 days of inactivity)
- **Redis**: Free forever (with limitations: 25MB storage)
- **Cold Starts**: Services spin down after 15 minutes of inactivity
- **Limitations**: 512MB RAM, shared CPU

⚠️ **Database Expiration**: Free databases expire after 90 days of *inactivity*. As long as your backend connects to it, it stays active. If it expires:
- You'll get email warnings before deletion
- Export data before expiration
- Create a new free database and restore
- Or upgrade to paid ($7/month)

💡 **Pro Tip**: Set up a free cron job or use UptimeRobot to ping your backend every 14 minutes to prevent cold starts and keep database active.

### Vercel (Free Tier)
- **Bandwidth**: 100GB/month
- **Build Time**: 100 hours/month
- **Serverless Functions**: 100GB-Hrs compute
- **Perfect for**: Static sites, SPAs, JAMstack apps
- **No cold starts** for static content

### Railway (No Free Tier)
- Removed free tier August 2023
- Requires credit card
- $5 minimum/month
- Pay-as-you-go pricing
- Better performance, no cold starts

**Recommendation**: Start with Render (free), upgrade if needed.
