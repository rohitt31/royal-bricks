# 🔧 FIX: ADMIN LOGIN FAILED

If you cannot login to the Admin Panel (`/auth`), it is likely one of these 3 reasons.

### 1. CORS Issue (I just fixed this!) ✅
The backend was blocking the Vercel request.
**Action:**
1. **Push the code** to GitHub (I already committed the fix).
2. Wait for Render to redeploy the backend.
3. Try login again.

### 2. Database is Empty (No Admin User) ⚠️
You connected your backend to MongoDB Atlas, but **Atlas is empty**. The admin user (`akuph95@gmail.com`) only exists on your *local* computer.

**Action:**
You need to create the admin user in the Cloud Database.
1. Open your local `.env` file (`backend/.env`).
2. Replace `MONGODB_URI` with your **Atlas Connection String** (temporarily).
3. Run this command in your terminal:
   ```bash
   cd backend
   node scripts/seedAdmin.js
   node scripts/seedProducts.js
   ```
4. Change `MONGODB_URI` back to `mongodb://localhost:27017/royal-bricks`.

### 3. Wrong API URL on Vercel 🔗
If Vercel can't find the backend, login fails.
1. Go to Vercel Project Settings -> Environment Variables.
2. Check `VITE_API_URL`.
3. It MUST be: `https://your-app-name.onrender.com/api`
   (Did you forget the `/api` at the end?)

---

### 🟢 SUMMARY CHECKLIST
- [ ] Push latest code (CORS fix)
- [ ] Run `seedAdmin.js` against Cloud Database
- [ ] Verify `VITE_API_URL` ends with `/api`

Once you do these 3, **Login will work.**
