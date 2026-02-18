# Deployment Guide - Anand Yadav Portfolio

This guide covers deploying the portfolio to Vercel (free hosting) and other static hosts.

## 🎯 Prerequisites

1. GitHub account (free)
2. Vercel account (free)
3. Portfolio code pushed to GitHub

---

## 📦 Step 1: Prepare Your Code

### 1.1 Update Personal Information

Before deploying, update all placeholder content:

1. **Personal Info** (`src/data/personal.ts`):
   - Replace email with your real email
   - Update GitHub and LinkedIn URLs
   - Add resume PDF to `public/` if available

2. **Experience** (`src/data/experience.ts`):
   - Update company name
   - Add actual start date
   - Verify all details

3. **Education** (`src/data/education.ts`):
   - Update university name
   - Add actual degree and field
   - Update dates

4. **Metadata** (`src/app/layout.tsx`):
   - Update Open Graph URL with your domain
   - Verify title and description

### 1.2 Test Locally

```bash
# Build the project
npm run build

# Test the production build locally
npm start
```

Verify everything works correctly.

---

## 🚀 Step 2: Deploy to Vercel (Free)

### 2.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial portfolio deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/anand-portfolio.git

# Push to GitHub
git push -u origin main
```

### 2.2 Deploy on Vercel

1. **Sign Up/Login**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Create New Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `anand-portfolio` repository

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `out` (important for static export)
   - **Install Command**: `npm install` (default)

4. **Environment Variables** (if needed):
   - Usually none required for static sites
   - Add any if you use environment variables later

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### 2.3 Verify Deployment

1. Visit your Vercel URL
2. Test all sections
3. Verify theme switching works
4. Check mobile responsiveness
5. Test all links (GitHub, LinkedIn, etc.)

---

## 🌐 Step 3: Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `anandyadav.dev`)
4. Follow DNS configuration instructions

### 3.2 Configure DNS

Vercel will provide DNS records to add:

**Option A: Use Vercel Nameservers** (Easiest)
- Update nameservers at your domain registrar
- Point to Vercel's nameservers

**Option B: Add DNS Records** (More Control)
- Add A record or CNAME record
- Point to Vercel's provided value

### 3.3 Update Portfolio URLs

After domain is configured:

1. Update `src/app/layout.tsx`:
   ```typescript
   openGraph: {
     url: "https://anandyadav.dev", // Your actual domain
   }
   ```

2. Update `src/data/personal.ts` if you have absolute URLs

3. Rebuild and redeploy:
   ```bash
   git add .
   git commit -m "Update domain URLs"
   git push
   ```
   Vercel will auto-deploy on push.

---

## 🔄 Step 4: Updating Your Portfolio

### 4.1 Make Changes Locally

1. Edit content in `src/data/` files
2. Test locally: `npm run dev`
3. Build to verify: `npm run build`

### 4.2 Deploy Updates

```bash
# Commit changes
git add .
git commit -m "Update portfolio content"
git push
```

Vercel automatically:
- Detects the push
- Runs build
- Deploys new version
- Updates your live site

### 4.3 Manual Redeploy

If needed, you can manually trigger a redeploy:
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"

---

## 📊 Step 5: Monitor & Analytics

### 5.1 Vercel Analytics (Optional)

1. Go to project settings
2. Enable "Web Analytics" (free tier available)
3. View traffic and performance metrics

### 5.2 Performance Monitoring

- Vercel provides built-in performance metrics
- Check "Analytics" tab in dashboard
- Monitor Core Web Vitals

---

## 🎨 Alternative Deployment Options

### Option 1: Netlify

1. **Sign up** at [netlify.com](https://netlify.com)
2. **Drag & Drop**:
   - Build locally: `npm run build`
   - Drag the `out/` folder to Netlify dashboard
3. **Or Connect Git**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `out`

### Option 2: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add script to package.json**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d out"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Your site: `https://username.github.io/anand-portfolio`

### Option 3: AWS S3 + CloudFront

1. **Build**:
   ```bash
   npm run build
   ```

2. **Upload to S3**:
   - Create S3 bucket
   - Enable static website hosting
   - Upload `out/` contents

3. **Configure CloudFront** (optional):
   - Create CloudFront distribution
   - Point to S3 bucket
   - Use custom domain

### Option 4: Any Static Host

Since this is a static export, you can deploy anywhere:

1. **Build**:
   ```bash
   npm run build
   ```

2. **Upload `out/` directory** to your host:
   - FTP/SFTP upload
   - cPanel file manager
   - Any static file hosting service

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Issue**: Build command fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct scripts
3. Ensure all dependencies are in `dependencies` (not `devDependencies`)
4. Check Node.js version (Vercel auto-detects, but can specify in settings)

### Static Export Issues

**Issue**: `out/` directory not generated

**Solutions**:
1. Verify `next.config.ts` has `output: "export"`
2. Check for dynamic routes (not supported in static export)
3. Ensure no API routes are used

### Theme Not Working

**Issue**: Theme toggle doesn't work after deployment

**Solutions**:
1. Verify `next-themes` is installed
2. Check `ThemeProvider` is in layout
3. Ensure `suppressHydrationWarning` is on `<html>`

### Images Not Loading

**Issue**: Images broken after deployment

**Solutions**:
1. Use `images.unoptimized: true` in `next.config.ts` (already set)
2. Ensure images are in `public/` directory
3. Use relative paths: `/image.png` not `./image.png`

### 404 Errors

**Issue**: Pages return 404

**Solutions**:
1. For Vercel: Check "Trailing Slash" setting
2. Ensure `trailingSlash: true` in `next.config.ts` (already set)
3. Verify all routes are statically generated

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All personal information updated
- [ ] Email, GitHub, LinkedIn URLs are real
- [ ] Company names and dates are accurate
- [ ] Projects have correct descriptions
- [ ] All links work (test locally)
- [ ] Theme switching works
- [ ] Mobile responsive (test on phone)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors
- [ ] SEO metadata updated
- [ ] Domain configured (if using custom domain)

After deploying:

- [ ] Site loads correctly
- [ ] All sections visible
- [ ] Navigation works
- [ ] Theme toggle works
- [ ] Links open correctly
- [ ] Mobile view looks good
- [ ] Performance is good (check Lighthouse)

---

## 🎉 Success!

Your portfolio is now live! Share it with:

- Recruiters
- Potential employers
- Your LinkedIn profile
- GitHub profile
- Resume

**Remember**: Keep your portfolio updated as you complete new projects or gain new experience!

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Next.js documentation
3. Check GitHub Issues for similar problems
4. Verify all configuration files are correct

---

**Happy Deploying! 🚀**

