# Stock Ticker Frontend - Deployment Guide

This frontend application is built with Vite, React, and TypeScript. It displays live stock prices fetched from the Spring Boot backend service.

## Deploying to Vercel

Vercel is the recommended hosting platform for Vite + React applications.

1. **Create a New Project on Vercel**:
   - Go to your Vercel Dashboard and click **Add New > Project**.
   - Import your GitHub repository.

2. **Configure Build Settings**:
   - **Framework Preset**: **Vite**.
   - **Root Directory**: `frontend` (since the frontend lives inside the `/frontend` subfolder in this monorepo).
   - **Build Command**: `npm run build` or `vite build`.
   - **Output Directory**: `dist` or `frontend/dist`.

3. **Configure Environment Variables**:
   Under **Environment Variables**, add the API base URL variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://stock-backend-api-jkve.onrender.com/api` (The deployed URL of your Spring Boot backend, appended with `/api`).

4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend and serve it globally with auto-HTTPS and Edge caching.

---

## Deploying to Netlify

1. **Create a New Site**:
   - Go to Netlify and click **Add new site > Import an existing project**.
   - Authorize Git and select your repository.

2. **Configure Site Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Configure Environment Variables**:
   - Go to **Site settings > Environment variables** and click **Add a variable**.
   - **Key**: `VITE_API_URL`
   - **Value**: `https://stock-backend-api-jkve.onrender.com/api`

4. **Deploy**:
   - Click **Deploy site**.

---

## Local Development

To run the frontend locally:
1. Ensure you have created a `.env` file in the root of the `/frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
2. Run development server:
   ```bash
   npm install
   npm run dev
   ```
The frontend will start at `http://localhost:5173`.
- Public Ticker Page: `http://localhost:5173/stocks`
- Login Page: `http://localhost:5173/login`
