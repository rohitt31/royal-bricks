# 🚀 ROYAL BRICKS - MASTER DEPLOYMENT MANUAL

**Goal:** Fully deploy the Royal Bricks application (Frontend + Backend + Database) to the cloud for client handover.
**Cost:** $0 (Free Tiers used).
**Time:** ~15 Minutes.

---

## 🛠️ PHASE 1: DATABASE (MongoDB Atlas)
*We need a cloud database to store bookings, products, and users.*

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** and Sign Up (Free).
2. **Create a Cluster:**
   - Choose **Shared (Free)**.
   - Provider: **AWS**.
   - Region: **Mumbai (ap-south-1)** (Best for Indian clients).
   - Click **Create Cluster**.
3. **Create Database User:**
   - Username: `admin`
   - Password: `securepassword123` (Remember this!).
   - Click **Create User**.
4. **Network Access (Whitelist):**
   - Go to "Network Access" (left menu).
   - Click **Add IP Address**.
   - Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   - Click **Confirm**. (Crucial for Render connection).
5. **Get Connection String:**
   - Click **Connect** (on your cluster).
   - Choose **Drivers**.
   - Copy the string: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>`** with your actual password.
   - **Save this URL.** You will need it in Phase 2.

---

## ⚙️ PHASE 2: BACKEND (Render.com)
*Hosting the API server that processes logic and connects to MongoDB.*

1. **Go to [Render.com](https://render.com)** and Sign Up with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your repository: `rohitt31/royal-bricks`.
4. **Configure Settings:**
   - **Name:** `royal-bricks-api`
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free.
5. **Environment Variables (Advanced Section):**
   - Click "Add Environment Variable".
   - `Key`: `MONGODB_URI` | `Value`: (Your Atlas Connection String from Phase 1).
   - `Key`: `JWT_SECRET` | `Value`: `some_long_random_secret_string`.
   - `Key`: `PORT` | `Value`: `10000` (Optional, Render does this auto, but good to have).
6. Click **Create Web Service**.
7. **Wait 2-3 minutes.** It will deploy.
8. **Copy the Backend URL** from the top left (e.g., `https://royal-bricks-api.onrender.com`).

---

## 🌐 PHASE 3: FRONTEND (Vercel)
*Hosting the React website that the client sees.*

1. **Go to [Vercel.com](https://vercel.com)** and login with GitHub.
2. Click **Add New** -> **Project**.
3. Import `royal-bricks`.
4. **Project Settings:**
   - **Framework Preset:** Vite (should be auto-detected).
   - **Root Directory:** `./` (Default).
5. **Environment Variables:**
   - **CRITICAL STEP:** Expanding the "Environment Variables" section.
   - `Key`: `VITE_API_URL`
   - `Value`: `https://royal-bricks-api.onrender.com/api`
   - **NOTE:** You MUST paste your Render URL from Phase 2 and ADD `/api` at the end.
6. Click **Deploy**.

---

## 🔌 PHASE 4: INITIALIZE DATA (The "Missing Link")
*Your cloud database is currently empty. The admin user does not exist yet. You cannot login until you do this.*

1. Open your **Local Terminal** (VS Code).
2. Create a temporary `.env.production` file in `backend/` folder (or just edit `.env`).
3. Set `MONGODB_URI` to your **Atlas Connection String**.
4. Run the seed scripts locally, but pointing to the cloud:
   ```bash
   cd backend
   node scripts/seedAdmin.js
   node scripts/seedProducts.js
   ```
5. You should see "✅ Admin user created" and "✅ Products seeded".
6. (Optional) Revert your local `.env` to localhost if you want.

---

## ✅ PHASE 5: VERIFICATION
1. Open your Vercel Link (e.g., `https://royal-bricks.vercel.app`).
2. Go to `/admin`.
3. Login with `akuph95@gmail.com` / `royal@123`.
4. **Success!** You are now running a fully deployed, production-ready system.

---

## 🎁 HANDOVER TO CLIENT
Provide the client with:
1. **Website URL:** (Your Vercel Link)
2. **Admin URL:** (Your Vercel Link + `/admin`)
3. **Admin Credentials** (Email/Password)
4. **Documentation:** (The README.md and PDF guides if you export them).

**DONE.** 🚀
