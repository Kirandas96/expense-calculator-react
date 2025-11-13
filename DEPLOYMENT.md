# Deployment Guide - Expense Calculator to Vercel

This guide provides step-by-step instructions for deploying your Expense Calculator application to Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
3. [Backend Deployment Options](#backend-deployment-options)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Post-Deployment Configuration](#post-deployment-configuration)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ A Vercel account ([Sign up for free](https://vercel.com/signup))
- ✅ A GitHub account (recommended for easy deployment)
- ✅ MongoDB Atlas account (for cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
- ✅ Node.js installed locally (for testing builds)
- ✅ Git repository (your code should be in a Git repo)

---

## Frontend Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended for First-Time)

This is the easiest method, especially if you're new to Vercel.

#### Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

#### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. If prompted, authorize Vercel to access your GitHub repositories

#### Step 3: Configure Project Settings

Vercel should auto-detect your React app, but verify these settings:

- **Framework Preset:** Create React App (or leave as auto-detected)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

#### Step 4: Set Environment Variables

Before deploying, add your environment variables:

1. In the project configuration page, scroll to **"Environment Variables"**
2. Click **"Add"** and add the following:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `REACT_APP_API_URL` | `https://your-backend-url.com/api` | Production, Preview, Development |

   **Note:** Replace `your-backend-url.com` with your actual backend URL (you'll set this up in the backend deployment section).

   For now, you can use a placeholder and update it later after deploying the backend.

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`

#### Step 6: Verify Deployment

1. Visit your deployment URL
2. Check the browser console for any errors
3. Test the application functionality

---

### Method 2: Deploy via Vercel CLI

If you prefer using the command line:

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Navigate to Project Root

```bash
cd "/Users/kiran.s7/Documents/expense calculator react"
```

#### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Press Enter for default or enter a custom name)
- Directory? **frontend**
- Override settings? **No** (or Yes if you want to customize)

#### Step 5: Set Environment Variables

```bash
vercel env add REACT_APP_API_URL
```

Enter the value when prompted (your backend API URL).

#### Step 6: Deploy to Production

```bash
vercel --prod
```

---

## Backend Deployment Options

Your backend needs to be deployed separately. Here are two recommended options:

### Option A: Deploy to Railway (Recommended)

Railway is easy to use and offers a free tier.

#### Step 1: Sign Up for Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Select the **`backend`** directory

#### Step 3: Configure Environment Variables

In Railway dashboard, go to your service → **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` (or leave Railway's default) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `NODE_ENV` | `production` |

#### Step 4: Get Your Backend URL

1. Railway will automatically assign a URL
2. Go to **Settings** → **Networking**
3. Copy the generated domain (e.g., `your-app.up.railway.app`)
4. Your API URL will be: `https://your-app.up.railway.app/api`

#### Step 5: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Update `REACT_APP_API_URL` to: `https://your-app.up.railway.app/api`
3. Redeploy the frontend (or wait for automatic redeployment)

---

### Option B: Deploy to Render

Render is another excellent option with a free tier.

#### Step 1: Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** expense-calculator-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### Step 3: Set Environment Variables

In the **Environment** section, add:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string |
| `NODE_ENV` | `production` |

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy your service URL (e.g., `https://expense-calculator-backend.onrender.com`)
4. Your API URL will be: `https://expense-calculator-backend.onrender.com/api`

#### Step 5: Update Frontend

Update `REACT_APP_API_URL` in Vercel to point to your Render backend URL.

---

## Environment Variables Setup

### Frontend Environment Variables (Vercel)

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Important:** 
- Replace `your-backend-url.com` with your actual backend deployment URL
- Add this variable for all environments (Production, Preview, Development)
- After adding/updating, you may need to redeploy

### Backend Environment Variables

#### For Railway:
Add in Railway Dashboard → Your Service → Variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-calculator?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_key_here
NODE_ENV=production
```

#### For Render:
Add in Render Dashboard → Your Service → Environment:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-calculator?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_key_here
NODE_ENV=production
```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for free

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Create a username and strong password
   - Save the credentials securely

4. **Whitelist IP Addresses**
   - Go to **Network Access** → **Add IP Address**
   - For production, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to **Clusters** → Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `expense-calculator` (or your preferred database name)
   - Use this as your `MONGODB_URI` value

6. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and use it as your `JWT_SECRET`

---

## Post-Deployment Configuration

### 1. Update CORS Settings (if needed)

If your backend is on a different domain, ensure CORS is properly configured. Your backend already has CORS enabled, but verify it allows your Vercel domain.

In `backend/src/server.js`, the current CORS setup allows all origins. For production, you may want to restrict it:

```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'https://your-app-name.vercel.app'],
  credentials: true
}));
```

### 2. Test Your Deployment

1. **Frontend:**
   - Visit your Vercel URL
   - Test user registration
   - Test login
   - Test creating expenses, categories, and budgets

2. **Backend:**
   - Test API endpoints using Postman or curl
   - Verify MongoDB connection is working
   - Check backend logs for any errors

### 3. Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4. Monitor Deployments

- **Vercel:** Check deployment logs in the dashboard
- **Railway/Render:** Monitor logs in their respective dashboards
- Set up error tracking (optional): Consider adding Sentry or similar service

---

## Troubleshooting

### Frontend Issues

**Problem:** Blank page or 404 errors
- **Solution:** Check that `vercel.json` routing is correct. All routes should redirect to `index.html` for React Router.

**Problem:** API calls failing
- **Solution:** 
  - Verify `REACT_APP_API_URL` is set correctly in Vercel
  - Check browser console for CORS errors
  - Ensure backend URL is accessible

**Problem:** Build fails
- **Solution:**
  - Check build logs in Vercel dashboard
  - Ensure all dependencies are in `package.json`
  - Verify Node.js version compatibility

### Backend Issues

**Problem:** MongoDB connection fails
- **Solution:**
  - Verify MongoDB Atlas IP whitelist includes your deployment platform's IPs
  - Check `MONGODB_URI` format is correct
  - Ensure database user has proper permissions

**Problem:** 401 Unauthorized errors
- **Solution:**
  - Verify `JWT_SECRET` is set correctly
  - Check that tokens are being sent in request headers
  - Ensure backend and frontend are using the same secret

**Problem:** CORS errors
- **Solution:**
  - Update CORS configuration to include your Vercel domain
  - Check that credentials are handled correctly

---

## Quick Reference

### Vercel Build Settings
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Important URLs to Update
1. Frontend `REACT_APP_API_URL` → Backend deployment URL
2. Backend CORS origins → Frontend Vercel URL

### Environment Variables Checklist

**Frontend (Vercel):**
- [ ] `REACT_APP_API_URL`

**Backend (Railway/Render):**
- [ ] `PORT`
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV`

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Railway or Render
3. ✅ Set up MongoDB Atlas
4. ✅ Configure environment variables
5. ✅ Test the deployed application
6. ✅ Set up custom domain (optional)
7. ✅ Monitor and optimize

---

## Support

If you encounter issues:
1. Check the deployment logs in your platform's dashboard
2. Verify all environment variables are set correctly
3. Test API endpoints independently
4. Check browser console for frontend errors
5. Review MongoDB Atlas connection status

For more information:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

