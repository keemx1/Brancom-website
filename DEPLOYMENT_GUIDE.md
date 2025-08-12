# 🚀 Brancom Website Deployment Guide

This guide will help you deploy your Brancom website to the web while maintaining all functionalities.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- A GitHub account
- A domain name (optional but recommended)

## 🎯 Deployment Options

### Option 1: Vercel + Railway (Recommended for beginners)

**Frontend (Vercel):**
- Free hosting
- Automatic HTTPS and CDN
- Great performance
- Easy deployment from Git

**Backend (Railway):**
- Free tier available
- Automatic deployments
- Good for Node.js apps

### Option 2: Netlify + Render

**Frontend (Netlify):**
- Similar to Vercel
- Good for static sites

**Backend (Render):**
- Free tier available
- Easy deployment

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/brancom-website.git
   git push -u origin main
   ```

2. **Organize your files:**
   ```
   brancom-website/
   ├── frontend/          # HTML, CSS, JS files
   │   ├── brancom main.html
   │   ├── client-login.html
   │   ├── client-dashboard.html
   │   ├── images/
   │   └── ...
   ├── backend/           # Node.js server
   │   ├── server.js
   │   ├── package.json
   │   └── ...
   └── README.md
   ```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway](https://railway.app/)**
2. **Sign up/Login with GitHub**
3. **Create New Project → Deploy from GitHub repo**
4. **Select your repository and backend folder**
5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password
   ```
6. **Deploy and get your backend URL** (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com/)**
2. **Sign up/Login with GitHub**
3. **Import your repository**
4. **Configure build settings:**
   - Framework Preset: `Other`
   - Root Directory: `frontend`
   - Build Command: `(leave empty)`
   - Output Directory: `.`
5. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
6. **Deploy**

### Step 4: Update Frontend API URLs

After deployment, update your frontend files to use the production backend URL:

```javascript
// Replace all instances of:
fetch('http://localhost:5000/api/...')

// With:
fetch('https://your-app.railway.app/api/...')
```

### Step 5: Configure Domain (Optional)

1. **In Vercel:** Add your custom domain
2. **In Railway:** Update CORS settings with your domain
3. **Update environment variables** with your domain

## 🔧 Configuration Files

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

## 🚨 Important Notes

1. **Firebase Configuration:** Your Firebase service account is already configured and will work in production
2. **CORS:** Backend is configured to handle CORS for production
3. **Static Files:** Backend serves frontend files in production mode
4. **Environment Variables:** Never commit sensitive data to Git
5. **WhatsApp Integration:** All package subscribe buttons now open WhatsApp with pre-filled messages

## 🧪 Testing Your Deployment

1. **Test Backend:** Visit `https://your-backend-url.railway.app/api/health`
2. **Test Frontend:** Visit your Vercel URL
3. **Test Login:** Try logging in with test credentials
4. **Test Contact Form:** Submit a test message
5. **Test WhatsApp Integration:** Click package subscribe buttons to verify WhatsApp opens with correct messages

## 📱 WhatsApp Integration Features

Your website now includes comprehensive WhatsApp integration:

### Package Subscription Buttons
- **Home Internet Packages:** Basic, Standard, Premium, Ultimate
- **Hotspot Packages:** Quick Browse, Half Day, Full Day, 24 Hour Pass
- Each button opens WhatsApp with pre-filled package details

### Contact Options
- **WhatsApp Chat Button** in contact form section
- **Get Started on WhatsApp** button in CTA section
- **Floating WhatsApp Button** (already existed)

### Message Format
All WhatsApp messages include:
- Package name and details
- Speed/duration information
- Pricing information
- Professional greeting and request for details

### WhatsApp Number
- **Primary:** +254 112 240 649
- **Format:** 254112240649 (for wa.me links)

## 🔄 Continuous Deployment

Both Vercel and Railway will automatically redeploy when you push changes to your GitHub repository.

## 📞 Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify environment variables are set correctly
4. Ensure Firebase credentials are valid

## 🎉 Success!

Your Brancom website is now live on the web with all functionalities working!

---

**Next Steps:**
- Set up a custom domain
- Configure SSL certificates
- Set up monitoring and analytics
- Implement proper security measures
