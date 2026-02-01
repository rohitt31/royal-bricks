# 🚀 Royal Bricks - Quick Start Guide

## Starting the Application

### Option 1: PowerShell Script (Recommended for Windows)
Double-click `dev-start.ps1` or run in PowerShell:

```powershell
.\dev-start.ps1
```

This will:
- Open a new window for the backend server
- Start the frontend in your current window
- Both servers run independently

### Option 2: Unified Command
Start both frontend and backend with one command:

```bash
npm run dev:all
```

**Note:** If you get `spawn cmd.exe ENOENT` error, use Option 1 (PowerShell script) instead.

### Option 3: Manual Start (Two Terminals)
If you prefer to start servers separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## ⚠️ Important Notes

### "Failed to fetch" Error?
This means the **backend server is not running**. 

**Quick Fix:**
1. Make sure you started BOTH servers (use `npm run dev:all`)
2. Check that backend is running on port 5000
3. Look for the connection status indicator in the bottom-right corner

### First Time Setup
If this is your first time running the app:

1. **Install Dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure Environment:**
   - Copy `backend/.env.example` to `backend/.env` (if exists)
   - Update MongoDB connection string if needed

3. **Start the App:**
   ```bash
   npm run dev:all
   ```

## 🔍 Troubleshooting

### Backend Won't Start
- Check if port 5000 is already in use
- Verify MongoDB is running (local or Atlas)
- Check `backend/.env` file exists and is configured

### Frontend Won't Start
- Check if port 8080 is already in use
- Clear browser cache and reload
- Check `.env` file has `VITE_API_URL` set

### Connection Status Shows "Disconnected"
- Backend server is not running - start it with `cd backend && npm run dev`
- Backend crashed - check terminal for error messages
- Wrong port - verify backend is on port 5000

## 📚 Additional Resources

- **Full Documentation:** See `MASTER_DEPLOYMENT_MANUAL.md`
- **Troubleshooting Login:** See `TROUBLESHOOT_LOGIN.md`
- **Production Deployment:** See `GO_LIVE_NOW.md`

## 🎯 Quick Links

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Admin Dashboard: http://localhost:8080/admin

---

**Need Help?** Check the connection status indicator in the bottom-right corner of the website. It will tell you if the backend is disconnected and how to fix it.
