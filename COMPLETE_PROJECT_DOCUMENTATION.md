# 🏗️ ROYAL BRICKS - COMPLETE PROJECT DOCUMENTATION

**Project Name:** Royal Bricks - Professional Brick Manufacturing & Sales Platform  
**Version:** 1.0.0  
**Last Updated:** January 29, 2026  
**Status:** ✅ Production Ready

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features Implemented](#features-implemented)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Admin Dashboard](#admin-dashboard)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Security Features](#security-features)
10. [Deployment Guide](#deployment-guide)
11. [Testing & QA](#testing--qa)
12. [Environment Setup](#environment-setup)

---

## 🎯 PROJECT OVERVIEW

Royal Bricks is a full-stack MERN (MongoDB, Express, React, Node.js) web application for a brick manufacturing business. It provides a professional customer-facing website and a comprehensive admin dashboard for managing orders, customer queries, and business analytics.

### Key Objectives:
- ✅ Professional customer booking system
- ✅ Real-time order management
- ✅ Complete CRUD operations for bookings and queries
- ✅ ITR/Taxation reporting with GST calculations
- ✅ Industry-standard security and authentication
- ✅ Responsive design for all devices

---

## 💻 TECHNOLOGY STACK

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.19
- **Routing:** React Router DOM 6.30.1
- **UI Components:** Shadcn UI (Radix UI)
- **Styling:** Tailwind CSS 3.4.17
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** TanStack Query
- **HTTP Client:** Native Fetch API

### Backend
- **Runtime:** Node.js (v24.13.0)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB (Mongoose 8.1.0)
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 2.4.3
- **Security:** Helmet, CORS, Rate Limiting, Mongo Sanitize
- **Logging:** Morgan
- **Compression:** compression middleware

### Database
- **Type:** MongoDB (NoSQL)
- **Local:** mongodb://localhost:27017/royal-bricks
- **Cloud:** MongoDB Atlas (for production)

---

## ✨ FEATURES IMPLEMENTED

### Customer-Facing Features

#### 1. **Homepage**
- Modern, responsive design
- Hero section with CTA
- Product showcase (First Class, Second Class, Fly Ash bricks)
- Features section
- About section
- Contact information
- Dark mode support

#### 2. **Booking System**
- Professional booking form
- Real-time validation
- Auto-generated booking numbers (Format: RB260100001)
- Fields:
  - Customer details (name, phone, email)
  - Brick type selection
  - Quantity (minimum 1000 bricks)
  - Delivery address (full address, area, city, pincode)
  - Special instructions
  - Automatic price calculation
- Form submission saves to MongoDB
- Success/error notifications

#### 3. **Contact/Query System**
- Contact form for customer inquiries
- Fields: name, phone, email, subject, message
- Saves to database for admin review
- Email validation

### Admin Dashboard Features

#### 1. **Authentication**
- Secure login system
- JWT-based authentication
- Protected routes
- Session management
- Admin credentials: `akuph95@gmail.com` / `royal@123`

#### 2. **Dashboard Overview**
- Real-time statistics
- Total bookings count
- Pending orders
- Confirmed orders
- Total revenue
- New queries count
- Recent bookings list
- Top revenue areas

#### 3. **Bookings Management** (`/admin/bookings`)

**Full CRUD Operations:**
- ✅ **Create:** Customers create via website form
- ✅ **Read:** View all bookings with filters
- ✅ **Update:** Edit booking details, status, payments
- ✅ **Delete:** Remove bookings

**Features:**
- Comprehensive booking list
- Search functionality (booking number, name, phone, email)
- Filters:
  - Status (All, Pending, Confirmed, In Production, Ready, Delivered, Cancelled)
  - Brick type
  - Area
- Pagination (10 per page)
- Sort options
- Quick actions:
  - Accept/Decline pending orders
  - Progress through workflow
  - View details
  - Edit booking
  - Delete booking
  - Contact customer (call/email)

**Order Workflow:**
```
PENDING → Accept/Decline
    ↓
CONFIRMED → Start Production
    ↓
IN PRODUCTION → Mark Ready
    ↓
READY FOR DELIVERY → Mark Delivered
    ↓
DELIVERED (Complete)

OR

PENDING → Decline → CANCELLED
```

**Booking Details View:**
- Customer information
- Order details (brick type, quantity, amount)
- Delivery information
- Payment status
- Admin notes
- Timeline (created, updated dates)

**Edit Capabilities:**
- Change status
- Update payment status (Pending/Partial/Paid)
- Track paid amount
- Set delivery date
- Add/edit admin notes

#### 4. **Queries Management** (`/admin/queries`)

**Full CRUD Operations:**
- ✅ View all customer queries
- ✅ Update status and notes
- ✅ Delete spam queries

**Features:**
- Query list with search
- Status filters (New, In Progress, Resolved)
- Quick actions:
  - Start Working (New → In Progress)
  - Mark Resolved
  - Call customer
  - Email customer
- Admin notes for internal tracking
- Pagination

#### 5. **Reports & ITR Filing** (`/admin/reports`)

**Professional Reporting System:**

**A. ITR Filing Report**
- Complete tax filing data
- GST calculations:
  - CGST (9%)
  - SGST (9%)
  - Total GST (18%)
- Revenue breakdown (with & without GST)
- Payment status tracking
- Financial year selection
- Excel-optimized CSV format
- Professional document layout with:
  - Executive summary at top
  - Clear column headers
  - Proper currency formatting
  - Summary totals

**B. Sales Summary Report**
- Month-wise sales breakdown
- Total orders per month
- Revenue trends
- Delivered vs Pending analysis

**C. Customer Database Report**
- Complete customer list
- Purchase history
- Total orders per customer
- Total spent
- Last order date
- Customer lifetime value

**D. Payment Ledger**
- Transaction tracking
- Paid vs Pending amounts
- Payment status
- Accounts receivable
- Cash flow analysis

**Report Features:**
- Financial year selection (Current FY, Previous FY, Custom dates)
- Real-time statistics
- One-click CSV download
- Opens in Excel/Google Sheets
- Ready for CA/Accountant

#### 6. **Professional UI/UX**

**Admin Layout:**
- Sidebar navigation
- User menu dropdown (top-right)
- Easy logout access (no scrolling needed)
- Professional header with page titles
- Responsive design (desktop & mobile)
- Clean, modern interface

**Visual Elements:**
- Color-coded status badges
- Icon-based navigation
- Loading states
- Error handling
- Toast notifications
- Confirmation dialogs

---

## 🏗️ BACKEND ARCHITECTURE

### Server Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── bookingController.js # Booking CRUD & stats
│   └── queryController.js   # Query management
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── errorHandler.js      # Error handling
│   └── validate.js          # Input validation
├── models/
│   ├── User.js              # Admin user schema
│   ├── Booking.js           # Booking schema
│   └── Query.js             # Query schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── bookingRoutes.js     # Booking endpoints
│   ├── queryRoutes.js       # Query endpoints
│   └── productRoutes.js     # Product endpoints
├── scripts/
│   ├── seedAdmin.js         # Create admin user
│   └── createTestBookings.js # Generate test data
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```

### Key Features

**1. Database Connection**
- Mongoose ODM
- Connection pooling
- Error handling
- Graceful shutdown
- Event listeners

**2. Security Middleware**
- Helmet (security headers)
- CORS (cross-origin protection)
- Rate limiting (100 requests/15 min)
- MongoDB injection prevention
- Input sanitization
- Request compression

**3. Authentication**
- JWT token generation
- Password hashing (bcrypt)
- Token verification middleware
- Protected routes
- Role-based access control

**4. Error Handling**
- Centralized error handler
- Custom error classes
- Validation errors
- Database errors
- 404 handling
- Unhandled rejections

**5. Logging**
- Morgan HTTP logger
- Development mode: detailed logs
- Production mode: combined logs
- Error logging

---

## 🎨 FRONTEND ARCHITECTURE

### Project Structure
```
src/
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── admin/
│   │   └── AdminLayout.tsx  # Admin dashboard layout
│   ├── Header.tsx           # Main navigation
│   ├── Footer.tsx           # Footer component
│   ├── BookingForm.tsx      # Customer booking form
│   └── ContactForm.tsx      # Contact/query form
├── pages/
│   ├── Index.tsx            # Homepage
│   ├── Auth.tsx             # Admin login
│   ├── NotFound.tsx         # 404 page
│   └── admin/
│       ├── Dashboard.tsx    # Admin dashboard
│       ├── Bookings.tsx     # Bookings management
│       ├── Queries.tsx      # Queries management
│       └── Reports.tsx      # Reports & ITR
├── hooks/
│   ├── useAuth.tsx          # Authentication hook
│   └── use-toast.ts         # Toast notifications
├── lib/
│   ├── api.ts               # API client
│   └── utils.ts             # Utility functions
├── App.tsx                  # Main app component
└── main.tsx                 # Entry point
```

### Key Components

**1. API Client (`src/lib/api.ts`)**
- Centralized API requests
- Token management
- Error handling
- Request/response interceptors
- Endpoints:
  - `authAPI`: login, getCurrentUser, logout
  - `bookingsAPI`: CRUD, stats, analytics
  - `queriesAPI`: CRUD, stats

**2. Authentication Hook (`src/hooks/useAuth.tsx`)**
- User state management
- Login/logout functions
- Admin role verification
- Token persistence
- Protected route logic

**3. Forms**
- React Hook Form integration
- Zod schema validation
- Real-time error display
- Success/error notifications
- Loading states

**4. Routing**
- React Router DOM
- Protected admin routes
- 404 handling
- Redirect logic

---

## 📊 DATABASE SCHEMA

### 1. User Model
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Booking Model
```javascript
{
  bookingNumber: String (auto-generated, unique, format: RB260100001),
  customerName: String (required),
  phone: String (required),
  email: String (optional),
  brickType: String (enum: first-class, second-class, fly-ash),
  quantity: Number (min: 1000),
  deliveryAddress: String (required),
  area: String (indexed),
  city: String (indexed),
  state: String (default: 'Bihar'),
  pincode: String,
  deliveryDate: Date,
  specialInstructions: String,
  status: String (enum: pending, confirmed, in_production, ready, delivered, cancelled),
  totalAmount: Number,
  paymentStatus: String (enum: pending, partial, paid),
  paidAmount: Number (default: 0),
  adminNotes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- bookingNumber (unique)
- status + createdAt
- area + createdAt
- brickType + createdAt

### 3. Query Model
```javascript
{
  name: String (required),
  email: String (optional),
  phone: String (required),
  subject: String (required),
  message: String (required),
  status: String (enum: new, in_progress, resolved, default: new),
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- status + createdAt

---

## 🔌 API DOCUMENTATION

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

#### POST `/api/auth/login`
Login admin user
```json
Request:
{
  "email": "akuph95@gmail.com",
  "password": "royal@123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "akuph95@gmail.com",
      "role": "admin"
    }
  }
}
```

#### GET `/api/auth/me`
Get current user (requires auth)
```json
Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "akuph95@gmail.com",
      "role": "admin"
    }
  }
}
```

### Booking Endpoints

#### GET `/api/bookings`
Get all bookings (requires auth)
```
Query Parameters:
- status: filter by status
- area: filter by area
- search: search by booking number, name, phone
- page: page number (default: 1)
- limit: items per page (default: 10)
- fromDate: filter from date
- toDate: filter to date
- sortBy: sort field (default: -createdAt)

Response:
{
  "success": true,
  "data": {
    "bookings": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 10
    }
  }
}
```

#### POST `/api/bookings`
Create booking (public)
```json
Request:
{
  "customerName": "John Doe",
  "phone": "+91 9876543210",
  "email": "john@example.com",
  "brickType": "first-class",
  "quantity": 5000,
  "deliveryAddress": "123 Main St",
  "area": "Patna",
  "city": "Patna",
  "pincode": "800001",
  "totalAmount": 50000
}

Response:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "bookingNumber": "RB260100001",
      ...
    }
  }
}
```

#### GET `/api/bookings/:id`
Get single booking (requires auth)

#### PUT `/api/bookings/:id`
Update booking (requires auth)
```json
Request:
{
  "status": "confirmed",
  "paymentStatus": "partial",
  "paidAmount": 25000,
  "deliveryDate": "2026-02-15",
  "adminNotes": "Customer requested early delivery"
}
```

#### DELETE `/api/bookings/:id`
Delete booking (requires auth)

#### GET `/api/bookings/stats/overview`
Get booking statistics (requires auth)
```json
Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 100,
      "totalRevenue": 5000000
    },
    "statusBreakdown": [
      { "_id": "pending", "count": 10 },
      { "_id": "confirmed", "count": 50 }
    ],
    "paymentStats": [...]
  }
}
```

#### GET `/api/bookings/stats/revenue-by-area`
Get revenue by area (requires auth)

### Query Endpoints

#### GET `/api/queries`
Get all queries (requires auth)

#### POST `/api/queries`
Create query (public)
```json
Request:
{
  "name": "Jane Smith",
  "phone": "+91 9876543210",
  "email": "jane@example.com",
  "subject": "Bulk order inquiry",
  "message": "I need 50,000 bricks..."
}
```

#### PUT `/api/queries/:id`
Update query (requires auth)

#### DELETE `/api/queries/:id`
Delete query (requires auth)

#### GET `/api/queries/stats/overview`
Get query statistics (requires auth)

---

## 🔐 SECURITY FEATURES

### 1. Authentication & Authorization
- JWT-based authentication
- Secure password hashing (bcrypt, 10 rounds)
- Token expiration (7 days)
- Protected routes
- Role-based access control

### 2. Input Validation
- Express Validator
- Zod schema validation (frontend)
- Required field checks
- Email format validation
- Phone number validation
- Minimum/maximum constraints

### 3. Security Middleware
- **Helmet:** Sets security headers
- **CORS:** Prevents unauthorized cross-origin requests
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Mongo Sanitize:** Prevents NoSQL injection
- **Input Sanitization:** Removes malicious code

### 4. Error Handling
- No sensitive data in error messages
- Centralized error handling
- Proper HTTP status codes
- Logging for debugging

### 5. Environment Variables
- Sensitive data in .env files
- .env files in .gitignore
- Different configs for dev/prod

---

## 🚀 DEPLOYMENT GUIDE

### Prerequisites
1. GitHub account
2. MongoDB Atlas account (free tier)
3. Render.com account (free tier)
4. Vercel account (free tier)

### Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user:
   - Username: `admin`
   - Password: (choose strong password)
4. Network Access: Add `0.0.0.0/0` (allow from anywhere)
5. Get connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub

1. Create repository on GitHub: `royal-bricks`
2. Initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/royal-bricks.git
   git push -u origin main
   ```

### Step 3: Backend Deployment (Render)

1. Go to [Render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Configuration:
   - **Name:** `royal-bricks-api`
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

4. Environment Variables:
   ```
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=your_super_secret_key_change_in_production
   NODE_ENV=production
   ADMIN_EMAIL=akuph95@gmail.com
   ADMIN_PASSWORD=royal@123
   ```

5. Deploy and copy the URL (e.g., `https://royal-bricks-api.onrender.com`)

### Step 4: Frontend Deployment (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configuration:
   - **Framework:** Vite (auto-detected)
   - **Root Directory:** `./`

4. Environment Variables:
   ```
   VITE_API_URL=https://royal-bricks-api.onrender.com/api
   ```

5. Deploy

### Step 5: Seed Admin User

After backend is deployed, run the seed script:
```bash
# SSH into Render or use their shell
cd backend
node scripts/seedAdmin.js
```

### Step 6: Test

1. Visit your Vercel URL
2. Try creating a booking
3. Login to admin: `/admin`
4. Verify all features work

---

## 🧪 TESTING & QA

### Manual Testing Completed

#### Backend API Tests
- ✅ Health check endpoint
- ✅ Authentication (login, token verification)
- ✅ Booking creation (with validation)
- ✅ Booking retrieval (with filters)
- ✅ Booking update
- ✅ Booking deletion
- ✅ Query creation
- ✅ Query management
- ✅ Statistics endpoints

#### Frontend Tests
- ✅ Homepage loads correctly
- ✅ Booking form validation
- ✅ Booking form submission
- ✅ Contact form submission
- ✅ Admin login
- ✅ Dashboard statistics
- ✅ Bookings CRUD operations
- ✅ Queries management
- ✅ Reports download
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode

#### Security Tests
- ✅ Protected routes require authentication
- ✅ Invalid tokens rejected
- ✅ Rate limiting works
- ✅ Input validation prevents injection
- ✅ CORS prevents unauthorized access

### Test Data Created
- 5 test bookings
- 2 test queries
- 1 admin user

---

## ⚙️ ENVIRONMENT SETUP

### Local Development

#### Prerequisites
- Node.js v18+ (tested on v24.13.0)
- MongoDB (local or Atlas)
- Git

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit with your values
npm run dev  # Starts on port 5000
```

#### Frontend Setup
```bash
npm install
npm run dev  # Starts on port 8080
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/royal-bricks
JWT_SECRET=royal-bricks-super-secret-jwt-key-2026
JWT_EXPIRE=7d
ADMIN_EMAIL=akuph95@gmail.com
ADMIN_PASSWORD=royal@123
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📈 FEATURES SUMMARY

### ✅ Completed Features

**Customer Features:**
- Professional homepage
- Booking system with validation
- Contact/query form
- Responsive design
- Dark mode support

**Admin Features:**
- Secure authentication
- Dashboard with real-time stats
- Full CRUD for bookings
- Order workflow management
- Query management
- ITR/Tax reports with GST
- Sales analytics
- Customer database
- Payment tracking
- CSV exports

**Technical Features:**
- RESTful API
- JWT authentication
- MongoDB database
- Input validation
- Error handling
- Security middleware
- Rate limiting
- Logging
- Compression
- CORS protection

---

## 🎯 PRODUCTION READINESS

### ✅ Checklist

**Code Quality:**
- ✅ Clean, organized code structure
- ✅ Proper error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Environment variables
- ✅ .gitignore configured

**Functionality:**
- ✅ All CRUD operations working
- ✅ Authentication system
- ✅ Real database integration
- ✅ Form validations
- ✅ API endpoints tested
- ✅ Reports generation

**Security:**
- ✅ Password hashing
- ✅ JWT tokens
- ✅ Protected routes
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CORS configured

**Deployment:**
- ✅ .gitignore configured
- ✅ vercel.json created
- ✅ Environment variables documented
- ✅ Database connection configurable
- ✅ Build scripts ready

---

## 📞 SUPPORT & MAINTENANCE

### Admin Credentials
- Email: `akuph95@gmail.com`
- Password: `royal@123`
- **⚠️ Change password after first login in production**

### Database
- Local: `mongodb://localhost:27017/royal-bricks`
- Production: MongoDB Atlas connection string

### API Endpoints
- Local: `http://localhost:5000/api`
- Production: Your Render URL

### Frontend
- Local: `http://localhost:8080`
- Production: Your Vercel URL

---

## 🎉 PROJECT STATUS

**Status:** ✅ **PRODUCTION READY**

**All systems operational:**
- ✅ Backend API running
- ✅ Frontend application running
- ✅ Database connected
- ✅ Authentication working
- ✅ All features tested
- ✅ Security implemented
- ✅ Ready for deployment

**Next Steps:**
1. Deploy to MongoDB Atlas
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Test production environment
5. Go live! 🚀

---

**Documentation Generated:** January 29, 2026  
**Version:** 1.0.0  
**Project:** Royal Bricks  
**Status:** Complete & Production Ready ✅
