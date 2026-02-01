# GitHub Pages Deployment Guide

This guide provides detailed instructions for deploying the Lost & Found Portal frontend to GitHub Pages.

## Overview

This repository is configured to deploy the React frontend to GitHub Pages automatically using GitHub Actions. The Django backend requires separate hosting (see Backend Hosting below).

## Quick Start: Automated Deployment

The easiest way to deploy is using the included GitHub Actions workflow:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/AnkonM/Online-Lost---Found-Prototype`
2. Click on **Settings** (top navigation bar)
3. Scroll down and click on **Pages** (left sidebar under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" from the dropdown
5. Save the settings

### Step 2: Trigger Deployment

The workflow will automatically run when you:
- Push changes to the `main` branch
- Manually trigger it from the Actions tab

To manually trigger:
1. Go to the **Actions** tab in your repository
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the `main` branch
5. Click "Run workflow"

### Step 3: Access Your Site

After the workflow completes (usually 2-3 minutes), your site will be available at:
```
https://AnkonM.github.io/Online-Lost---Found-Prototype
```

## Manual Deployment (Alternative)

If you prefer to deploy manually using the command line:

### Prerequisites
- Node.js 14+ and npm installed
- Git configured with access to your repository

### Steps

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/AnkonM/Online-Lost---Found-Prototype.git
   cd Online-Lost---Found-Prototype
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

This will:
- Build the production version of the app
- Create/update the `gh-pages` branch
- Push the build to GitHub Pages

## Configuration Details

### Homepage URL
The `package.json` includes:
```json
"homepage": "https://AnkonM.github.io/Online-Lost---Found-Prototype"
```

This ensures all assets load correctly on GitHub Pages.

### Deploy Scripts
The `package.json` includes deployment scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

## Backend Hosting

⚠️ **Important**: GitHub Pages only hosts static files. The Django backend must be hosted separately.

### Recommended Backend Hosting Platforms:

1. **Heroku** (Easy, free tier available)
   - Great for small projects
   - Simple deployment with Git
   - Free tier with some limitations

2. **Railway** (Modern, developer-friendly)
   - Automatic deployments from Git
   - Free tier available
   - Easy database setup

3. **PythonAnywhere** (Python-specific)
   - Designed for Python/Django apps
   - Free tier available
   - Good documentation

4. **DigitalOcean App Platform** (Scalable)
   - $5/month for basic tier
   - Automatic scaling
   - Good for production

5. **Render** (Modern platform)
   - Free tier for web services
   - Automatic deployments
   - Easy database integration

6. **Google Cloud Run** (Serverless)
   - Pay per use
   - Auto-scaling
   - Good for production

### After Deploying the Backend

Once you've deployed your backend, you need to update the frontend to use the new API URL:

1. **Update API configuration** in `frontend/src/services/api.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.com/api';
   ```

2. **Rebuild and redeploy** the frontend:
   ```bash
   cd frontend
   npm run deploy
   ```

3. **Update CORS settings** in your Django backend's `settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://AnkonM.github.io",
   ]
   ```

## Troubleshooting

### Deployment Fails
- Check the Actions tab for error messages
- Ensure you have enabled GitHub Pages in Settings
- Verify that the workflow has write permissions

### 404 Not Found
- Make sure GitHub Pages is enabled with "GitHub Actions" as the source
- Wait a few minutes after deployment (can take 5-10 minutes)
- Clear browser cache and try again

### Assets Not Loading (404 for CSS/JS)
- Verify the `homepage` field in `package.json` matches your repository name
- Ensure the URL is exactly: `https://AnkonM.github.io/Online-Lost---Found-Prototype`

### Build Fails
- Check for linting errors: `npm run build`
- Fix any errors in the code
- Commit and push changes to trigger a new deployment

### Backend API Calls Fail
- Verify your backend is running and accessible
- Check CORS settings on the backend
- Update the API URL in `frontend/src/services/api.js`
- Ensure the backend accepts requests from `https://AnkonM.github.io`

## Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. Go to repository Settings → Pages
2. Under "Custom domain", enter your domain (e.g., `lostfound.example.com`)
3. Add a CNAME record in your domain's DNS settings pointing to `AnkonM.github.io`
4. Wait for DNS propagation (can take up to 48 hours)
5. Update the `homepage` field in `frontend/package.json` to your custom domain
6. Rebuild and redeploy

## Monitoring Deployments

- View deployment history in the **Actions** tab
- Each deployment creates a new workflow run
- Click on a run to see detailed logs
- Green checkmark = successful deployment
- Red X = failed deployment (click for details)

## Local Development

To test locally before deploying:

```bash
cd frontend
npm install
npm start
```

This runs the development server at `http://localhost:3000`

To test the production build locally:

```bash
npm run build
npx serve -s build
```

## Security Considerations

1. **Never commit sensitive data** (API keys, passwords, etc.)
2. **Use environment variables** for sensitive configuration
3. **Enable HTTPS** (GitHub Pages provides this automatically)
4. **Configure CORS properly** on your backend
5. **Validate all user input** on both frontend and backend

## Support

For issues or questions:
1. Check this guide and the main README.md
2. Review closed issues in the repository
3. Open a new issue with details about your problem

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/#github-pages)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
