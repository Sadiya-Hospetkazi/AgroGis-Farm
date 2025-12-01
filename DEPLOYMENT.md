# AgroGig Deployment Guide

This guide explains how to deploy the AgroGig application to Railway (backend) and Vercel (frontend).

## Prerequisites

1. GitHub account
2. Railway account (for backend deployment)
3. Vercel account (for frontend deployment)
4. MySQL database (can be hosted on Railway or other providers)

## Deploying the Backend to Railway

1. **Prepare the Repository**
   - Ensure your code is pushed to a GitHub repository
   - The repository should have the structure as in this project

2. **Create a New Project on Railway**
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project" and select "Deploy from GitHub repo"
   - Select your AgroGig repository

3. **Configure Environment Variables**
   - Go to your project settings in Railway
   - Add the following environment variables:
     - `NODE_ENV`: production
     - `PORT`: 3001 (or leave it to let Railway auto-assign)
     - `DB_HOST`: Your MySQL database host
     - `DB_USER`: Your MySQL database user
     - `DB_PASSWORD`: Your MySQL database password
     - `DB_NAME`: Your MySQL database name (e.g., agrogig)
     - `JWT_SECRET`: A secure secret key for JWT tokens
     - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (optional)

4. **Deploy**
   - Railway will automatically detect this as a Node.js application
   - It will use the `npm start` command to run the application
   - Once deployed, Railway will provide a URL like `agrogis-farm-production.up.railway.app`

## Deploying the Frontend to Vercel

1. **Prepare the Repository**
   - Ensure your code is pushed to a GitHub repository
   - The repository should have the structure as in this project

2. **Create a New Project on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and select "Import Git Repository"
   - Select your AgroGig repository

3. **Configure Project Settings**
   - Framework Preset: Other
   - Root Directory: Leave empty (default)
   - Build Command: Leave empty (static site)
   - Output Directory: frontend

4. **Deploy**
   - Vercel will automatically deploy the frontend
   - Once deployed, Vercel will provide a URL for your frontend

## Connecting Frontend and Backend

The frontend is configured to automatically detect the deployment environment:

- When both frontend and backend are deployed to the same domain, API calls will use the same domain
- When deployed separately, the frontend will use the Railway backend URL

If you need to manually specify the backend URL, you can update the `BASE_API_URL` constant in the frontend JavaScript files:

```javascript
const BASE_API_URL = 'https://your-railway-app.up.railway.app';
```

## Database Setup

For production, you'll need to set up a MySQL database:

1. You can use Railway's MySQL plugin or any other MySQL hosting provider
2. Run the schema from `database/schema.sql` to set up the tables
3. Optionally seed the database with data from `database/seed.sql`

## Updating Environment Variables

After deployment, you can update environment variables in both Railway and Vercel dashboards:

- Railway: Project > Settings > Environment Variables
- Vercel: Project > Settings > Environment Variables

## Redeployment

Both platforms support automatic redeployment when you push changes to your GitHub repository:

- Railway: Automatically redeploys on push to the connected branch
- Vercel: Automatically redeploys on push to the connected branch

## Troubleshooting

1. **CORS Issues**: If you encounter CORS errors, ensure your backend is configured to accept requests from your frontend domain.

2. **API Connection Issues**: Verify that your frontend is pointing to the correct backend URL.

3. **Database Connection Issues**: Double-check your database credentials in the environment variables.

4. **Environment Variables**: Make sure all required environment variables are set in both Railway and Vercel.