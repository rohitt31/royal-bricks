# Royal Bricks Backend API

Complete Node.js + Express + MongoDB backend with JWT authentication, admin dashboard, and comprehensive business analytics.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Admin and User roles
- ✅ **MongoDB Database** - Scalable NoSQL database
- ✅ **Comprehensive Analytics** - Revenue tracking, area-wise statistics, trends
- ✅ **Security Features** - Helmet, rate limiting, input sanitization
- ✅ **Input Validation** - Express-validator for all endpoints
- ✅ **Error Handling** - Centralized error handling
- ✅ **Auto-Generated Booking Numbers** - Format: RB2601XXXX
- ✅ **Area-wise Revenue Tracking** - Identify high-revenue areas
- ✅ **Payment Tracking** - Track payments and pending amounts

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/royal-bricks
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/royal-bricks

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@royalbricks.com
ADMIN_PASSWORD=Admin@123456

# CORS
CORS_ORIGIN=http://localhost:8080
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Seed Admin User

```bash
npm run seed
```

This creates an admin user with credentials from `.env` file.

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "fullName": "John Doe",
  "phone": "+91 9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@royalbricks.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@royalbricks.com",
      "fullName": "Royal Bricks Admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

### Booking Endpoints

#### Create Booking (Public)
```http
POST /api/bookings
Content-Type: application/json

{
  "customerName": "Rajesh Kumar",
  "phone": "+91 9876543210",
  "email": "rajesh@example.com",
  "brickType": "first-class",
  "quantity": 5000,
  "deliveryAddress": "123 Main Street, Patna",
  "area": "Patna City",
  "city": "Patna",
  "state": "Bihar",
  "pincode": "800001",
  "specialInstructions": "Deliver before 5 PM"
}
```

#### Get All Bookings (Admin)
```http
GET /api/bookings?status=pending&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, in_production, ready, delivered, cancelled)
- `brickType` - Filter by brick type
- `area` - Filter by area
- `city` - Filter by city
- `fromDate` - Start date (YYYY-MM-DD)
- `toDate` - End date (YYYY-MM-DD)
- `search` - Search in booking number, customer name, phone, email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: -createdAt)

#### Get Single Booking (Admin)
```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

#### Update Booking (Admin)
```http
PUT /api/bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "totalAmount": 50000,
  "deliveryDate": "2026-02-15",
  "adminNotes": "Priority order"
}
```

#### Delete Booking (Admin)
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

#### Get Booking Statistics (Admin)
```http
GET /api/bookings/stats/overview?fromDate=2026-01-01&toDate=2026-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "totalRevenue": 7500000,
      "averageOrderValue": 50000
    },
    "statusBreakdown": [
      { "_id": "pending", "count": 20 },
      { "_id": "confirmed", "count": 50 },
      { "_id": "delivered", "count": 80 }
    ],
    "brickTypeBreakdown": [
      {
        "_id": "first-class",
        "count": 80,
        "quantity": 400000,
        "revenue": 4000000
      }
    ],
    "areaBreakdown": [
      {
        "_id": "Patna City",
        "count": 45,
        "quantity": 225000,
        "revenue": 2250000
      }
    ],
    "cityBreakdown": [...],
    "monthlyTrend": [...],
    "paymentStats": [...]
  }
}
```

#### Get Revenue by Area (Admin)
```http
GET /api/bookings/stats/revenue-by-area?limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenueByArea": [
      {
        "_id": "Patna City",
        "totalRevenue": 2250000,
        "totalOrders": 45,
        "totalQuantity": 225000,
        "averageOrderValue": 50000
      },
      {
        "_id": "Boring Road",
        "totalRevenue": 1800000,
        "totalOrders": 36,
        "totalQuantity": 180000,
        "averageOrderValue": 50000
      }
    ]
  }
}
```

### Contact Query Endpoints

#### Create Query (Public)
```http
POST /api/queries
Content-Type: application/json

{
  "name": "Amit Singh",
  "email": "amit@example.com",
  "phone": "+91 9876543210",
  "subject": "Bulk Order Inquiry",
  "message": "I need 50,000 bricks for a construction project"
}
```

#### Get All Queries (Admin)
```http
GET /api/queries?status=new&page=1&limit=20
Authorization: Bearer <token>
```

#### Get Single Query (Admin)
```http
GET /api/queries/:id
Authorization: Bearer <token>
```

#### Update Query (Admin)
```http
PUT /api/queries/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved",
  "adminNotes": "Called customer and provided quote"
}
```

#### Delete Query (Admin)
```http
DELETE /api/queries/:id
Authorization: Bearer <token>
```

#### Get Query Statistics (Admin)
```http
GET /api/queries/stats/overview
Authorization: Bearer <token>
```

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with configurable rounds
3. **Helmet** - Security headers
4. **Rate Limiting** - Prevent brute force attacks
5. **Input Sanitization** - Prevent NoSQL injection
6. **Input Validation** - Express-validator
7. **CORS** - Configurable cross-origin requests
8. **Password Requirements** - Min 8 chars, uppercase, lowercase, number, special char

## 📊 Analytics Features

### Dashboard Statistics

1. **Revenue Analytics**
   - Total revenue
   - Revenue by area
   - Revenue by brick type
   - Monthly trends

2. **Order Analytics**
   - Total orders
   - Orders by status
   - Orders by area
   - Average order value

3. **Area-wise Performance**
   - Top performing areas
   - Order count by area
   - Revenue by area
   - Quantity sold by area

4. **Trend Analysis**
   - Monthly revenue trends
   - Daily order trends
   - Seasonal patterns

5. **Payment Tracking**
   - Payment status breakdown
   - Pending payments
   - Collected amounts

## 🗂️ Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  role: String (admin/user),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  bookingNumber: String (auto-generated, unique),
  customerName: String,
  phone: String,
  email: String,
  brickType: String (first-class/second-class/fly-ash),
  quantity: Number,
  deliveryAddress: String,
  area: String,
  city: String,
  state: String,
  pincode: String,
  deliveryDate: Date,
  specialInstructions: String,
  status: String (pending/confirmed/in_production/ready/delivered/cancelled),
  totalAmount: Number,
  paymentStatus: String (pending/partial/paid),
  paidAmount: Number,
  adminNotes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Queries Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String (new/in_progress/resolved),
  adminNotes: String,
  assignedTo: ObjectId (ref: User),
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚦 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/royal-bricks |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |
| ADMIN_EMAIL | Admin email | admin@royalbricks.com |
| ADMIN_PASSWORD | Admin password | Admin@123456 |
| BCRYPT_ROUNDS | Password hash rounds | 10 |
| CORS_ORIGIN | Allowed origin | http://localhost:8080 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 🧪 Testing

Use tools like Postman or Thunder Client to test the API endpoints.

### Sample Postman Collection

Import this collection to get started quickly:
- Authentication endpoints
- Booking CRUD operations
- Query management
- Analytics endpoints

## 🔄 Deployment

### Production Checklist

1. ✅ Change `JWT_SECRET` to a strong random string
2. ✅ Change admin password after first login
3. ✅ Set `NODE_ENV=production`
4. ✅ Use MongoDB Atlas for database
5. ✅ Configure proper CORS origins
6. ✅ Set up SSL/TLS
7. ✅ Configure rate limiting appropriately
8. ✅ Set up logging and monitoring
9. ✅ Regular database backups

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create royal-bricks-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main

# Seed admin
heroku run npm run seed
```

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

ISC
