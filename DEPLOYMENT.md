# Deployment Guide - Vercel

This application is configured for deployment on Vercel with MongoDB for persistent data storage.

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Account** - Already set up with the repo
3. **MongoDB Atlas Account** - Free tier at https://www.mongodb.com/cloud/atlas

## Step 1: Set Up MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project
4. Create a free M0 cluster
5. Create a database user (remember username/password)
6. Whitelist your IP or allow all (0.0.0.0/0) for Vercel
7. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
8. Create a database named `student-management`
9. Your final URL: `mongodb+srv://username:password@cluster.mongodb.net/student-management?retryWrites=true&w=majority`

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Vercel will ask for your project settings
# Select "Express" or "Other" for framework
```

### Option B: Using GitHub (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repo (aaitlhaj-beep/APP)
5. Configure project settings
6. Click "Deploy"

## Step 3: Add Environment Variables

After deploying or during setup in Vercel dashboard:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/student-management?retryWrites=true&w=majority
SESSION_SECRET = your-random-secret-key-here (generate a random string)
NODE_ENV = production
```

4. Redeploy after adding variables

## Step 4: Update MongoDB Cluster Settings

1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add Vercel servers: Check Vercel docs or use 0.0.0.0/0 (allows all IPs)
4. Database Access → Verify user exists and has correct password

## Troubleshooting

### "Cannot find module 'mongoose'"
- Run `npm install` locally and push to git
- Vercel will run `npm install` automatically during deployment

### "MONGODB_URI is undefined"
- Check Environment Variables in Vercel dashboard
- Ensure variables are added for the correct environment (Production)
- Redeploy after adding variables

### "Connection timeout"
- Verify MongoDB IP whitelist includes Vercel servers
- Check MongoDB username and password are correct
- Ensure database name is in the connection string

### "Port already in use"
- Vercel auto-manages ports, this shouldn't happen
- Check logs in Vercel dashboard

## Local Development

For local development with SQLite:

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env if needed (default is local SQLite)
NODE_ENV=development
MONGODB_URI=  # Leave empty for SQLite

# Start server
npm start
```

## Production vs Development

- **Production (Vercel)**: Uses MongoDB Atlas
- **Development (Local)**: Uses SQLite

The app automatically detects which to use based on `NODE_ENV` and `MONGODB_URI` environment variables.

## Monitoring Logs

### On Vercel:
1. Go to your project on vercel.com
2. Click "Deployments"
3. Select the deployment
4. View "Logs" tab

### Local:
```bash
npm start
```

## Redeploying

### After code changes:
```bash
git push origin main
```
Vercel will automatically redeploy.

### Manual redeploy:
1. Vercel dashboard → Deployments
2. Click "Redeploy" on any deployment

## Custom Domain

1. Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions

## Important Security Notes

1. **Never commit `.env` file** - Use environment variables in Vercel dashboard
2. **Change SESSION_SECRET** - Generate a random string
3. **Use strong MongoDB password** - At least 12 characters
4. **Enable 2FA** - On both Vercel and MongoDB Atlas accounts
5. **Limit Database Access** - Whitelist only necessary IPs

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express.js: https://expressjs.com

---

# Alternative Deployment - Advanced Vercel Setup

For a more robust production deployment with staging environments, custom domains, and CI/CD automation.

## Prerequisites (Same as Above)

- Vercel account
- GitHub account with repository
- MongoDB Atlas account

## Phase 1: Advanced Environment Setup

### Create Separate MongoDB Databases

1. **In MongoDB Atlas:**
   - Create 2 clusters or databases:
     - `student-management-prod` (Production)
     - `student-management-staging` (Staging)
   - Create users for each:
     - `prod_user` for production
     - `staging_user` for staging

2. **Get Connection Strings:**
   ```
   PROD: mongodb+srv://prod_user:ProdPassword@cluster0.mongodb.net/student-management-prod?retryWrites=true&w=majority
   
   STAGING: mongodb+srv://staging_user:StagingPassword@cluster0.mongodb.net/student-management-staging?retryWrites=true&w=majority
   ```

### Set Up GitHub Branches

```bash
# Create deployment branches
git branch staging
git branch production

# Push to GitHub
git push origin staging
git push origin production
```

## Phase 2: Vercel Multi-Environment Deployment

### Step 1: Deploy Production

1. Go to https://vercel.com
2. Click "New Project"
3. Import `APP` repository
4. **Production Deployment Settings:**
   - **Project Name**: `app-prod`
   - **Framework**: Express
   - **Git Settings**: 
     - Production Branch: `main` or `production`
     - Auto-deploy on push: ✓
5. **Environment Variables (Production)**:
   ```
   MONGODB_URI = mongodb+srv://prod_user:ProdPassword@cluster0.mongodb.net/student-management-prod?retryWrites=true&w=majority
   SESSION_SECRET = [Generate with: openssl rand -hex 32]
   NODE_ENV = production
   DB_ENV = production
   ```
6. Click "Deploy"

### Step 2: Deploy Staging

1. Click "New Project" (in Vercel)
2. Import the **same** `APP` repository again
3. **Staging Deployment Settings:**
   - **Project Name**: `app-staging`
   - **Framework**: Express
   - **Git Settings**:
     - Production Branch: `staging`
     - Auto-deploy on push: ✓
4. **Environment Variables (Staging)**:
   ```
   MONGODB_URI = mongodb+srv://staging_user:StagingPassword@cluster0.mongodb.net/student-management-staging?retryWrites=true&w=majority
   SESSION_SECRET = [Generate with: openssl rand -hex 32] (different from prod)
   NODE_ENV = production
   DB_ENV = staging
   ```
5. Click "Deploy"

## Phase 3: Connect Custom Domains

### For Production Domain

1. In Vercel dashboard (app-prod project):
   - Go to "Settings" → "Domains"
   - Add your domain: `yourdomain.com`
   - Vercel will show DNS records to add

2. In your domain registrar:
   - Add the DNS records provided by Vercel
   - Wait 24-48 hours for propagation

3. Enable SSL:
   - Vercel automatically provisions SSL certificate

### For Staging Domain

1. Repeat same process for staging project
2. Use subdomain: `staging.yourdomain.com`

## Phase 4: CI/CD & Automated Deployment

### Option A: GitHub Actions (Automatic Testing Before Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests (if any)
        run: npm test || true
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Option B: Manual Deployment Flow

```bash
# For staging updates:
git commit -m "Update feature"
git push origin staging
# → Vercel auto-deploys to staging.yourdomain.com

# For production updates (after testing staging):
git checkout main
git merge staging
git push origin main
# → Vercel auto-deploys to yourdomain.com
```

## Phase 5: Monitoring & Rollbacks

### Enable Monitoring

1. In Vercel dashboard:
   - Go to "Monitoring" tab
   - Enable "Performance Analytics"
   - Enable "Web Vitals"

2. Set up alerts:
   - Email notifications for failed deployments
   - Performance threshold alerts

### Rollback to Previous Deployment

1. In Vercel dashboard:
   - Go to "Deployments" tab
   - Find previous successful deployment
   - Click "..." menu
   - Select "Promote to Production"
   - Confirm

**This takes ~30 seconds and doesn't require re-deployment**

## Phase 6: Performance Optimization

### Update vercel.json for caching:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/public/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Database Connection Pooling (in `database-mongo.js`):

Ensure your MongoDB connection uses:
```javascript
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
};

mongoose.connect(MONGODB_URI, options);
```

## Troubleshooting Advanced Setup

### "Deployments not auto-triggering"
- Check GitHub branch protection rules
- Ensure branch name matches Vercel settings exactly (case-sensitive)

### "Wrong database being used"
- Verify `DB_ENV` variable in both Vercel projects
- Check MONGODB_URI in each project's environment variables
- Confirm each has unique MongoDB cluster/database

### "Environment variables not updating"
- Changes to env vars require redeployment
- Click "Redeploy" in Vercel after changing variables
- Or `git push` to trigger auto-redeployment

### "Custom domain not working"
- DNS can take 24-48 hours to propagate
- Use https://dns.google or https://whatsmydns.net to check
- Ensure all DNS records from Vercel are added to registrar

## Deployment Comparison Matrix

| Feature | Basic | Advanced |
|---------|-------|----------|
| Environments | 1 Production | 2+ (Prod + Staging) |
| Database | Shared | Isolated per environment |
| Custom Domain | Yes | Yes (multiple) |
| Rollback Time | ~2 minutes | ~30 seconds |
| Branching | Main only | Main + Staging |
| Downtime | Possible | Minimal |
| Monitoring | Basic | Advanced analytics |
| Cost | ~$20/month | ~$40-60/month |

---

Happy Advanced Deploying! 🚀
