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

Happy Deploying! 🚀
