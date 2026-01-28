# 🚀 COMPLETE DEPLOYMENT WALKTHROUGH (Zero to Live)

Follow these steps exactly. Do not skip anything.

---

## 🟢 PART 1: GITHUB (Put your code online)

**1. Create the Repository**
*   Go to [GitHub.com](https://github.com) and sign in.
*   Click the **+** icon (top right) -> **New repository**.
*   Repository Name: `royal-bricks`
*   Visibility: **Public**
*   **Do NOT** check "Add a README" or ".gitignore".
*   Click **Create repository**.

**2. Push Your Code**
*   Copy the URL of your new repo (e.g., `https://github.com/YOUR_USERNAME/royal-bricks.git`).
*   Open your terminal (Command Prompt or Git Bash) in your project folder `c:\Users\ROHIT SINGH\Desktop\royal-bricks`.
*   Run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin <PASTE_YOUR_GITHUB_URL_HERE>
git push -u origin main
```
*(If you get an error saying 'git is not recognized', download and install [Git for Windows](https://git-scm.com/download/win) first).*

---

## 🟢 PART 2: MONGODB (The Database)

**1. Create Cluster**
*   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
*   Sign up (free).
*   Create a deployment: Select **M0 (Free)**.
*   Provider: AWS -> Region: N. Virginia (or closest to you).
*   Click **Create**.

**2. Database User**
*   Go to **Database Access** (sidebar).
*   Click **Add New Database User**.
*   Username: `admin`
*   Password: `royalpassword123` (Write this down!).
*   Role: "Read and write to any database".
*   Click **Add User**.

**3. Network Access**
*   Go to **Network Access** (sidebar).
*   Click **Add IP Address**.
*   Click **Allow Access From Anywhere** (`0.0.0.0/0`).
*   Click **Confirm**.

**4. Get Connection String**
*   Go to **Database** (sidebar) -> Click **Connect**.
*   Select **Drivers**.
*   Copy the connection string. It looks like:
    `const uri = "mongodb+srv://admin:<password>@cluster0.p8q8a.mongodb.net/?retryWrites=true&w=majority";`
*   **Replace `<password>`** with `royalpassword123`.
*   **KEEP THIS STRING SAFE.** You will need it in Part 3.

---

## 🟢 PART 3: RENDER (The Backend)

**1. Create Service**
*   Go to [Render.com](https://render.com) and sign up/login with GitHub.
*   Click **New +** -> **Web Service**.
*   Select "Build and deploy from a Git repository".
*   Connect your `royal-bricks` repo.

**2. Configure**
*   **Name:** `royal-bricks-api`
*   **Region:** Singapore (closest to India) or US East.
*   **Branch:** `main`
*   **Root Directory:** `backend` (⚠️ VERY IMPORTANT: Type `backend` here)
*   **Runtime:** Node
*   **Build Command:** `npm install`
*   **Start Command:** `node server.js`
*   **Instance Type:** Free

**3. Environment Variables** (Scroll down to "Advanced")
*   Click **Add Environment Variable**:
    *   Key: `MONGODB_URI`
    *   Value: (Paste your MongoDB connection string from Part 2)
*   Click **Add Environment Variable**:
    *   Key: `JWT_SECRET`
    *   Value: `royalbrickssupersecretkey`
*   Click **Add Environment Variable**:
    *   Key: `NODE_ENV`
    *   Value: `production`

**4. Deploy**
*   Click **Create Web Service**.
*   Wait for it to say "Live".
*   **Copy the URL** at the top left (e.g., `https://royal-bricks-api.onrender.com`).
*   **KEEP THIS URL.** You will need it in Part 4.

---

## 🟢 PART 4: VERCEL (The Website)

**1. Create Project**
*   Go to [Vercel.com](https://vercel.com) and login with GitHub.
*   Click **Add New...** -> **Project**.
*   Import `royal-bricks`.

**2. Configure**
*   **Framework Preset:** Vite (should be auto-detected).
*   **Root Directory:** `./` (Leave as default).

**3. Environment Variables**
*   Click **Environment Variables**.
*   Key: `VITE_API_URL`
*   Value: (Paste your Render Backend URL from Part 3).
    *   *Example:* `https://royal-bricks-api.onrender.com/api`
    *   ⚠️ **IMPORTANT:** You MUST add `/api` at the end if your backend uses it (which it does).

**4. Deploy**
*   Click **Deploy**.
*   Wait for confetti! 🎉

---

## 🟢 PART 5: FINISH

**1. Connect Backend to Frontend**
*   Go back to **Render.com**.
*   Go to Environment Variables.
*   Add `CORS_ORIGIN` = (Your new Vercel URL, e.g., `https://royal-bricks.vercel.app`).
*   *Note: Your current code allows all origins, so this is optional but good for security later.*

**2. Test It**
*   Open your Vercel URL.
*   Try to login.
*   Try to create a booking.
*   **IT WORKS!**

---
