# 🚀 YOUR LIVE DEPLOYMENT LINKS

**Step 1: The Code is Pushed ✅**
I have successfully pushed your latest changes to: https://github.com/rohitt31/royal-bricks

**Step 2: Get Your Live Backend (API)**
1. Go to [Render.com](https://render.com) and creating a "Web Service".
2. Connect your `royal-bricks` repo.
3. Use these settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Env Vars:** Add `MONGODB_URI` (from Atlas) and `JWT_SECRET` (any password).
4. **Copy the URL** Render gives you (e.g., `https://royal-bricks.onrender.com`).

**Step 3: Get Your Live Website (Client Link)**
1. Go to [Vercel.com](https://vercel.com) and "Add New Project".
2. Import `royal-bricks`.
3. Framework: `Vite` (Detects automatically).
4. **Environment Variables:**
   - Name: `VITE_API_URL`
   - Value: `https://your-render-url.onrender.com/api` (The URL from Step 2 + `/api`)
   - **CRITICAL:** Do NOT forget `/api` at the end!
5. Click **Deploy**.

---

### 🎉 YOUR FINAL LINKS
*(Fill these in effectively)*

- **Admin Panel:** `https://your-vercel-app.vercel.app/admin`
- **Customer Site:** `https://your-vercel-app.vercel.app`

**Send the Customer Site link to your client.**
