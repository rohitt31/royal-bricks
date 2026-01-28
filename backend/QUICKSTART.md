# 🚀 Quick Start Guide - Royal Bricks Backend

## Step-by-Step Setup (5 minutes)

### 1. Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install and run MongoDB as a service
3. MongoDB will run on `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### 2. Start the Backend

```bash
# Navigate to backend folder
cd backend

# Dependencies are already installed!

# Start MongoDB (if using local)
# Windows: MongoDB should be running as a service
# macOS/Linux: brew services start mongodb-community

# Seed admin user
npm run seed

# Start development server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
📍 API URL: http://localhost:5000
🏥 Health Check: http://localhost:5000/health
```

### 3. Test the API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Login as Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@royalbricks.com",
    "password": "Admin@123456"
  }'
```

Save the `token` from the response!

### 4. Test Analytics Endpoint

```bash
curl http://localhost:5000/api/bookings/stats/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 Default Admin Credentials

```
Email: admin@royalbricks.com
Password: Admin@123456
```

**⚠️ IMPORTANT:** Change the password after first login!

## 📊 Testing the Dashboard

### Create Sample Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "phone": "+91 9876543210",
    "email": "test@example.com",
    "brickType": "first-class",
    "quantity": 5000,
    "deliveryAddress": "123 Test Street, Patna",
    "area": "Patna City",
    "city": "Patna",
    "state": "Bihar",
    "totalAmount": 50000
  }'
```

### View All Bookings (Admin)

```bash
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Revenue by Area

```bash
curl http://localhost:5000/api/bookings/stats/revenue-by-area \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Common Issues

### MongoDB Connection Error

**Error:** `Error connecting to MongoDB`

**Solution:**
1. Make sure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. For local: `mongodb://localhost:27017/royal-bricks`
4. For Atlas: Use the connection string from MongoDB Atlas

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. Change `PORT` in `.env` to another port (e.g., 5001)
2. Or kill the process using port 5000

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:5000 | xargs kill
```

## 📱 Connect Frontend

Update your frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Postman Collection

Import the Postman collection from `postman_collection.json` for easy testing!

## 📈 Next Steps

1. ✅ Backend is running
2. ✅ Admin user created
3. ✅ Test API endpoints
4. 🔄 Connect frontend
5. 🎨 Customize as needed

## 🆘 Need Help?

Check the full documentation in `README.md`

## 🎉 You're All Set!

Your backend is now running with:
- ✅ JWT Authentication
- ✅ Admin Dashboard API
- ✅ Revenue Analytics
- ✅ Area-wise Statistics
- ✅ Booking Management
- ✅ Query Management
- ✅ All Security Features
