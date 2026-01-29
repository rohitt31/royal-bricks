# 🚀 ROYAL BRICKS - QUICK START GUIDE

**Last Updated:** January 29, 2026

---

## ⚡ QUICK COMMANDS

### Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Access Points
- **Website:** http://localhost:8080
- **Admin:** http://localhost:8080/admin
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 🔑 CREDENTIALS

### Admin Login
- **Email:** akuph95@gmail.com
- **Password:** royal@123

---

## 📁 PROJECT STRUCTURE

```
royal-bricks/
├── backend/              # Node.js API
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   └── server.js        # Main server
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks
│   └── lib/            # API client
└── public/             # Static assets
```

---

## 🎯 KEY FEATURES

### Customer Side
✅ Book bricks online  
✅ Contact form  
✅ View products  
✅ Responsive design  

### Admin Side
✅ Manage bookings (CRUD)  
✅ Track orders (workflow)  
✅ Handle queries  
✅ Download ITR reports  
✅ View analytics  

---

## 🔌 API ENDPOINTS

### Public
- `POST /api/bookings` - Create booking
- `POST /api/queries` - Submit query

### Protected (Requires Auth)
- `POST /api/auth/login` - Admin login
- `GET /api/bookings` - List bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/stats/overview` - Statistics
- `GET /api/queries` - List queries

---

## 📊 DATABASE COLLECTIONS

### bookings
- Customer details
- Order information
- Status tracking
- Payment tracking
- Auto-generated booking numbers

### queries
- Customer inquiries
- Status (new/in_progress/resolved)
- Admin notes

### users
- Admin accounts
- Hashed passwords
- JWT authentication

---

## 🛠️ COMMON TASKS

### Create Admin User
```bash
cd backend
node scripts/seedAdmin.js
```

### Create Test Bookings
```bash
cd backend
node scripts/createTestBookings.js
```

### Build for Production
```bash
# Frontend
npm run build

# Backend (no build needed, runs directly)
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploying
- [ ] Push code to GitHub
- [ ] Create MongoDB Atlas cluster
- [ ] Get MongoDB connection string
- [ ] Update environment variables

### Render (Backend)
- [ ] Create Web Service
- [ ] Set root directory: `backend`
- [ ] Add environment variables
- [ ] Deploy

### Vercel (Frontend)
- [ ] Import GitHub repo
- [ ] Add `VITE_API_URL` env variable
- [ ] Deploy

---

## 🔧 TROUBLESHOOTING

### Backend won't start
- Check MongoDB is running
- Verify .env file exists
- Check port 5000 is free

### Frontend can't connect to API
- Verify backend is running
- Check VITE_API_URL in .env
- Check CORS settings

### Login not working
- Run seedAdmin.js script
- Check credentials
- Verify JWT_SECRET in .env

### Bookings not saving
- Check MongoDB connection
- Verify booking model
- Check validation errors

---

## 📝 ENVIRONMENT VARIABLES

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/royal-bricks
JWT_SECRET=your_secret_key
ADMIN_EMAIL=akuph95@gmail.com
ADMIN_PASSWORD=royal@123
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎨 ADMIN ROUTES

- `/admin` - Dashboard
- `/admin/bookings` - Manage bookings
- `/admin/queries` - Manage queries
- `/admin/reports` - ITR & reports

---

## 📞 QUICK REFERENCE

### Booking Statuses
- `pending` - New order
- `confirmed` - Accepted
- `in_production` - Manufacturing
- `ready` - Ready for delivery
- `delivered` - Complete
- `cancelled` - Declined

### Payment Statuses
- `pending` - Not paid
- `partial` - Partially paid
- `paid` - Fully paid

### Query Statuses
- `new` - Just received
- `in_progress` - Being handled
- `resolved` - Completed

---

## 🔐 SECURITY NOTES

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt
- Rate limit: 100 requests/15 min
- Protected routes require authentication
- Input validation on all forms

---

## 📚 DOCUMENTATION FILES

1. `COMPLETE_PROJECT_DOCUMENTATION.md` - Full documentation
2. `BACKEND_VERIFICATION_REPORT.md` - Backend status
3. `STEP_BY_STEP_DEPLOY.md` - Deployment guide
4. `QUICK_START_GUIDE.md` - This file

---

## ✅ STATUS

**Backend:** ✅ Running  
**Frontend:** ✅ Running  
**Database:** ✅ Connected  
**Authentication:** ✅ Working  
**All Features:** ✅ Operational  

**Ready for:** 🚀 Production Deployment

---

**Need help?** Check the complete documentation or deployment guides!
