# 🔒 Authentication System - Admin Only

## ✅ **Single Admin Account**

This backend uses a **single pre-created admin account** for security. User registration is **disabled**.

---

## 🔐 **Admin Credentials**

```
Email:    akuph95@gmail.com
Password: royal@123
```

---

## 🚫 **Registration Disabled**

**Why?**
- Only authorized admin should have access
- No public user signups
- Enhanced security
- Single point of control

The `/api/auth/register` endpoint is **disabled** and will not accept requests.

---

## ✅ **Available Authentication Endpoints**

### **1. Login (POST /api/auth/login)**

Login with admin credentials to get JWT token.

**Request:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "akuph95@gmail.com",
  "password": "royal@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "679a1b2c3d4e5f6g7h8i9j0k",
      "email": "akuph95@gmail.com",
      "fullName": "Royal Bricks Admin",
      "role": "admin",
      "lastLogin": "2026-01-28T17:13:42.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **2. Get Current User (GET /api/auth/me)**

Get currently logged in user details.

**Request:**
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "679a1b2c3d4e5f6g7h8i9j0k",
      "email": "akuph95@gmail.com",
      "fullName": "Royal Bricks Admin",
      "phone": "+91 8298344803",
      "role": "admin",
      "lastLogin": "2026-01-28T17:13:42.000Z",
      "createdAt": "2026-01-28T16:30:00.000Z"
    }
  }
}
```

### **3. Update Password (PUT /api/auth/update-password)**

Change admin password.

**Request:**
```bash
PUT http://localhost:5000/api/auth/update-password
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "currentPassword": "royal@123",
  "newPassword": "NewSecurePassword@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔄 **How to Reset Admin Account**

If you need to reset the admin account or password:

```bash
cd backend
npm run seed
```

This will recreate the admin user with the default credentials from `.env` file.

---

## 🛡️ **Security Features**

1. ✅ **No Public Registration** - Only pre-created admin
2. ✅ **JWT Authentication** - Secure token-based auth
3. ✅ **Password Hashing** - bcrypt encryption
4. ✅ **Token Expiration** - 7 days by default
5. ✅ **Password Requirements** - Strong password validation
6. ✅ **Rate Limiting** - Prevent brute force attacks
7. ✅ **Secure Headers** - Helmet middleware

---

## 📝 **Password Requirements**

When changing password, new password must have:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

---

## 🔑 **JWT Token Usage**

After login, use the token in all protected endpoints:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is valid for **7 days** (configurable in `.env`).

---

## ⚠️ **Important Notes**

1. **Keep credentials secure** - Don't share admin password
2. **Change default password** - Use Update Password endpoint
3. **Token expiry** - Login again after 7 days
4. **No user creation** - Registration endpoint is disabled
5. **Single admin only** - One account for all admin operations

---

## 🆘 **Troubleshooting**

### **Forgot Password?**

Run the seed script to reset:
```bash
cd backend
npm run seed
```

This resets password to the value in `.env` file.

### **Token Expired?**

Login again to get a new token:
```bash
POST /api/auth/login
```

### **Invalid Credentials?**

Check:
1. Email is correct: `akuph95@gmail.com`
2. Password is correct: `royal@123`
3. Admin account exists (run `npm run seed`)

---

## 📊 **Admin Capabilities**

With admin login, you can:

- ✅ View all bookings
- ✅ Create/Update/Delete bookings
- ✅ View analytics and statistics
- ✅ See revenue by area
- ✅ Manage customer queries
- ✅ Track payments
- ✅ Access all admin endpoints

---

**🔒 Your admin account is secure and ready to use!**
