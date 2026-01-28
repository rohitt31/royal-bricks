I cannot sign into your personal accounts (GitHub, Vercel, Render) as I am an AI without access to your passwords or email verification. **But I have done 90% of the work for you.**

I have just created the necessary configuration files (`.gitignore` and `vercel.json`) directly in your project folder.

### 🚀 HOW TO DEPLOY (In 3 Simple Steps)

You just need to "Push" this code to the cloud.

#### **Step 1: Put Code on GitHub**
1.  Go to [GitHub.com](https://github.com) and create a **New Repository** named `royal-bricks`.
2.  Open your terminal here and type:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

#### **Step 2: Backend (Render)**
1.  Go to [Render.com](https://render.com) -> New **Web Service**.
2.  Connect your GitHub repo.
3.  Set "Root Directory" to `backend`.
4.  Add Environment Variables:
    *   `MONGODB_URI`: (Copy from MongoDB Atlas)
    *   `JWT_SECRET`: `royal123`
5.  Click **Deploy**. Copy the URL it gives you (e.g., `https://royal-api.onrender.com`).

#### **Step 3: Frontend (Vercel)**
1.  Go to [Vercel.com](https://vercel.com) -> Add New Project.
2.  Import `royal-bricks` from GitHub.
3.  Add Environment Variable:
    *   `VITE_API_URL`: Paste your Render URL (from Step 2).
4.  Click **Deploy**.

**That's it! Your site will be live.**
