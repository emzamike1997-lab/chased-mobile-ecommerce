# GitHub and Vercel Deployment Guide

## Quick Start Commands

### Push to GitHub

```bash
# Navigate to project directory
cd "c:\Users\emzam\Desktop\mobile device"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chased-mobile-ecommerce.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Detailed Steps

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `chased-mobile-ecommerce`
   - **Description**: "Premium mobile e-commerce platform for boots and bags - UK market"
   - **Visibility**: Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click **Create repository**

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/chased-mobile-ecommerce.git
git branch -M main
git push -u origin main
```

> **Note**: Replace `YOUR_USERNAME` with your actual GitHub username

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account
5. Click **Add New...** → **Project**
6. Find and select `chased-mobile-ecommerce` from your repositories
7. Click **Import**
8. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: (leave empty)
9. Click **Deploy**
10. Wait 1-2 minutes for deployment to complete
11. Your site will be live at: `https://chased-mobile-ecommerce.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd "c:\Users\emzam\Desktop\mobile device"

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? chased-mobile-ecommerce
# - Directory? ./
# - Override settings? No
```

### 4. Verify Deployment

1. Open the Vercel deployment URL
2. Test on mobile device or use browser DevTools mobile view
3. Verify all features work:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Products display
   - ✅ Registration/Login
   - ✅ Add to cart
   - ✅ Wishlist
   - ✅ Price negotiator

### 5. Custom Domain (Optional)

To add a custom domain:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `chased.co.uk`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Issue: "Permission denied" when pushing to GitHub

**Solution**: Set up SSH key or use Personal Access Token
```bash
# Use HTTPS with token instead
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/chased-mobile-ecommerce.git
```

### Issue: Images not loading on Vercel

**Solution**: Verify all image paths are relative
- ✅ Correct: `assets/boot1.png`
- ❌ Incorrect: `/assets/boot1.png` or `C:/Users/...`

### Issue: JavaScript not working on deployed site

**Solution**: Check browser console for errors. Ensure all file paths are relative.

## Environment Variables (Future)

When you add a backend, set environment variables in Vercel:

1. Go to project **Settings** → **Environment Variables**
2. Add variables like:
   - `DATABASE_URL`
   - `API_KEY`
   - `STRIPE_SECRET_KEY`

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
# Commit changes
git add .
git commit -m "Update: description of changes"

# Push to GitHub
git push

# Vercel will automatically deploy the new version!
```

## Project URLs

After deployment, you'll have:
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/chased-mobile-ecommerce`
- **Vercel Production**: `https://chased-mobile-ecommerce.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/YOUR_USERNAME/chased-mobile-ecommerce`

---

**Ready to deploy!** Follow the steps above to get your CHASED website live on the internet.
