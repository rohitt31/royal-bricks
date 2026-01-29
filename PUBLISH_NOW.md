# 🚀 PUBLISHING TO GITHUB (Final Step)

I have already initialized your Git repository and saved all your files locally. You are one step away!

## Method 1: Using VS Code's "Source Control" Tab (Easiest)

1.  Look at the **Left Sidebar** in VS Code.
2.  Click the icon that looks like a **Connect/Branch** structure (Source Control).
    *   *It might have a blue number badge.*
3.  You should see a button that says **"Publish Branch"** or **"Publish to GitHub"**.
4.  Click it.
5.  Select **"Publish to GitHub public repository"**.
6.  It will create the repo and push your code automatically!

---

## Method 2: Manual (If Method 1 fails)

1.  Go to [GitHub.com/new](https://github.com/new) and create a repository named `royal-bricks`.
2.  Copy the URL (e.g., `https://github.com/StartUpRohit/royal-bricks.git`).
3.  Run this command in your terminal:

```powershell
& "C:\Program Files\Git\cmd\git.exe" remote add origin <PASTE_URL_HERE>
& "C:\Program Files\Git\cmd\git.exe" push -u origin main
```

*(Note: We are using the full path to git because your terminal hasn't updated its path yet).*

---

## 🟢 AFTER PUSHING

Once your code is on GitHub, follow the `DEPLOYMENT_GUIDE.md` to:
1.  Connect **Render** to your repo (for Backend).
2.  Connect **Vercel** to your repo (for Frontend).
