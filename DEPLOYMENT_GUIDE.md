# Portfolio Deployment Guide

## Option 1: GitHub Pages (Recommended)

### Step 1: Prepare Your Files
1. Make sure all files are in the `Abhishek_Portfolio` folder
2. Ensure `index.html` is in the root of this folder
3. Check that the image path is correct: `IMG_4797.jpg` should be in the same folder

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in/create account
2. Click "New Repository" (green button)
3. Name it: `abhishek-raj-portfolio` or `portfolio`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we'll upload our files)
6. Click "Create Repository"

### Step 3: Upload Your Files
**Option A: Web Interface (Easier)**
1. Click "uploading an existing file"
2. Drag and drop all files from `Abhishek_Portfolio` folder
3. Add commit message: "Initial portfolio upload"
4. Click "Commit changes"

**Option B: Git Commands (If you have Git installed)**
```bash
cd /Users/abhishekraj/workspace/portfolio/Abhishek_Portfolio
git init
git add .
git commit -m "Initial portfolio upload"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/abhishek-raj-portfolio.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 5: Access Your Live Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/abhishek-raj-portfolio`
- It may take 5-10 minutes to go live initially
- GitHub will show you the URL in the Pages settings

---

## Option 2: Netlify (Alternative)

### Steps:
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub account
3. Click "Add new site" → "Deploy manually"
4. Drag and drop your `Abhishek_Portfolio` folder
5. Your site will be live instantly with a random URL
6. You can change the site name in settings

**Benefits:**
- Instant deployment
- Easy drag-and-drop
- Custom domain support
- Automatic HTTPS

---

## Option 3: Vercel (Alternative)

### Steps:
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "New Project"
4. Import your GitHub repository (after uploading to GitHub)
5. Deploy with default settings

**Benefits:**
- Lightning fast
- Automatic deployments from GitHub
- Great performance
- Custom domains

---

## Recommended Workflow

1. **Start with GitHub Pages** (most professional)
2. **Upload your portfolio** to GitHub repository
3. **Enable Pages** to get your live URL
4. **Share the URL** with employers/clients
5. **Update easily** by pushing new code to GitHub

## Custom Domain (Optional)

If you want a custom domain like `abhishekraj.dev`:
1. Buy domain from Namecheap, GoDaddy, etc. (~$10-15/year)
2. Add CNAME record pointing to your GitHub Pages URL
3. Configure custom domain in GitHub Pages settings

## Final URL Examples

- **GitHub Pages**: `https://abhishekraj.github.io/portfolio`
- **Netlify**: `https://abhishek-raj-portfolio.netlify.app`
- **Vercel**: `https://abhishek-raj-portfolio.vercel.app`
- **Custom Domain**: `https://abhishekraj.dev`

Choose GitHub Pages for the most professional and permanent solution!
