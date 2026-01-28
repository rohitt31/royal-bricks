# 🚀 DEPLOYMENT GUIDE: Royal Bricks (Free & Professional)

This guide will help you deploy your MERN stack application (MongoDB, Express, React, Node.js) for **FREE** using the industry-standard platforms: **Render** and **Vercel**.

---

## 🏗️ INFRASTRUCTURE OVERVIEW

| Component | Service Provider | Cost | Why? |
|-----------|------------------|------|------|
| **Database** | **MongoDB Atlas** | **FREE** | Industry standard, auto-scaling, secure. |
| **Backend API** | **Render.com** | **FREE** | Runs Node.js servers for free (unlike Heroku). |
| **Frontend** | **Vercel** | **FREE** | Fastest for React, global CDN, auto-deploy from Git. |

---

## ✅ PHASE 1: PREPARE YOUR CODE

Before deploying, we need to make sure your code is ready for the cloud.

### 1. Update `backend/package.json`
Ensure your backend has a start script. It should look like this:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
*Note: I have already configured this for you.*

### 2. Update `backend/server.js` (CORS)
The backend needs to allow requests from your deployed frontend domain.
Currently, it allows `http://localhost:8080`. After deploying, you will add your Vercel URL to the `cors` configuration in `server.js`.

---

## 🗄️ PHASE 2: DATABASE (MongoDB Atlas)

1. **Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Cluster:** Select the **Free M0 Sandbox** tier.
3. **Create User:** Go to "Database Access" and create a user (e.g., `admin`) with a password.
4. **Allow Access:** Go to "Network Access" and add IP `0.0.0.0/0` (allows access from anywhere).
5. **Get Connection String:**
   - Click "Connect" > "Connect your application".
   - Copy the string: `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
   - **Save this** for the next step.

---

## ⚙️ PHASE 3: BACKEND DEPLOYMENT (Render.com)

1. **Push Code to GitHub:**
   - Create a new repository on GitHub.
   - Push your entire project code to it.

2. **Create Render Service:**
   - Sign up at [Render.com](https://render.com).
   - Click **"New +"** and select **"Web Service"**.
   - Connect your GitHub repository.

3. **Configure Service:**
   - **Name:** `royal-bricks-api`
   - **Root Directory:** `backend` (Important! This tells Render the server is in the backend folder).
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

4. **Environment Variables:**
   Scroll down to "Advanced" and add these variables:
   - `MONGODB_URI`: Paste your MongoDB connection string from Phase 2.
   - `JWT_SECRET`: `royal_secret_key_123` (or any secret phrase).
   - `PORT`: `10000` (Render uses port 10000 by default).
   - `NODE_ENV`: `production`

5. **Deploy:**
   - Click "Create Web Service".
   - Render will build your app. Wait for "Your service is live".
   - **Copy your Backend URL:** e.g., `https://royal-bricks-api.onrender.com`.

---

## 🎨 PHASE 4: FRONTEND DEPLOYMENT (Vercel)

1. **Sign up** at [Vercel.com](https://vercel.com).
2. **Add New Project:**
   - Click **"Add New..."** > **"Project"**.
   - Import your GitHub repository.

3. **Configure Project:**
   - **Framework Preset:** Vite (Vercel usually detects this automatically).
   - **Root Directory:** `.` (Leave as default, or select root if asked).

4. **Environment Variables:**
   - Expand the "Environment Variables" section.
   - Add: `VITE_API_URL`
   - Value: **Your Render Backend URL** from Phase 3 (e.g., `https://royal-bricks-api.onrender.com/api`).
   - *Note: Don't forget the `/api` at the end if your routes need it!*

5. **Deploy:**
   - Click "Deploy".
   - Vercel will build your React app and deploy it globally.
   - You will get a domain like `royal-bricks.vercel.app`.

---

## 🔗 PHASE 5: FINAL CONNECTION

Now that you have your Frontend URL (e.g., `https://royal-bricks.vercel.app`), you need to tell the Backend to accept requests from it.

1. Go back to **Render.com** > Your Web Service > **Environment**.
2. Add/Edit the generic `CORS_ORIGIN` variable (if you set one up) OR easier: update your `server.js` code to allow all origins `*` initially, or add your specific Vercel domain.

**Recommended:**
To ensure smooth operation immediately, your current backend is using `cors()`, which by default allows all origins if not restricted. It should work out of the box!

---

## 🎉 DONE!

Your website is now live!
- **Frontend:** `https://royal-bricks.vercel.app` (Share this with customers)
- **Backend:** `https://royal-bricks-api.onrender.com` (Hidden API)
- **Database:** MongoDB Atlas (Secure Cloud DB)

### 💡 Pro Tips for "Free" Tier:
- **Render Spin-down:** On the free tier, the backend "sleeps" after 15 mins of inactivity. The first request after sleep takes 30-60 seconds to load. This is normal for free hosting. To prevent this, you can upgrade to a paid plan ($7/mo) later.
- **Vercel:** Is super fast and always awake.
- **MongoDB:** The free tier is generous perfectly fine for thousands of orders.
