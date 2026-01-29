# 🏗️ Royal Bricks - Enterprise Management System

![Royal Bricks Banner](https://images.unsplash.com/photo-1588011930968-333406c88b08?q=80&w=1200&h=300&fit=crop)

A full-stack, production-grade MERN application for managing brick manufacturing orders, inventory, and customer queries.

## 🚀 Features

### 🏢 For Business (Admin Panel)
- **Dashboard**: Real-time visualization of bookings, revenue, and order status.
- **Order Workflow**: Manage lifecycle (Pending -> Confirmed -> Production -> Delivered).
- **Inventory Management**: Dynamic products catalogue with stock tracking.
- **Reporting**: ONE-CLICK ITR/GST reports and sales analytics.
- **Query Management**: Track and resolve customer inquiries.

### 🏠 For Customers
- **Product Showcase**: Browse available construction materials (Bricks, Cement, etc.).
- **Instant Booking**: Simple, validated booking form.
- **Real-time Status**: Track order status via booking ID.

---

## 🛠️ Technology Stack

- **Frontend:** React + Vite + TypeScript
- **UI Framework:** Tailwind CSS + Shadcn/UI
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Security:** JWT Auth, Helmet, Rate Limiting, Input Validation

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/royal-bricks.git
cd royal-bricks
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Environment Setup
Create `.env` file in `backend/` folder:
```env
MONGODB_URI=mongodb://localhost:27017/royal-bricks
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
ADMIN_EMAIL=admin@royalbricks.com
ADMIN_PASSWORD=securepassword
```

Create `.env` file in root folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Data (Seeding)
```bash
cd backend
# Create Admin User
node scripts/seedAdmin.js
# Create Initial Products
node scripts/seedProducts.js
```

### 5. Run Application
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
npm run dev
```

---

## 🚢 Deployment

### Backend (Render/Heroku/Railway)
1. Build Command: `npm install`
2. Start Command: `node server.js`
3. Root Directory: `backend`

### Frontend (Vercel/Netlify)
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Root Directory: `/`

---

## 📄 License
© 2026 Royal Bricks. All rights reserved.
