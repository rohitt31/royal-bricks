# 🔐 Admin Login Credentials

## ✅ **Your Admin Account**

```
Email:    akuph95@gmail.com
Password: royal@123
```

---

## 🚀 **How to Login**

### **Option 1: Using Postman (Recommended)**

1. Import `postman_collection.json`
2. Open **"Authentication"** → **"Login"** request
3. Click **Send** (credentials are already filled)
4. Token will be automatically saved ✅

### **Option 2: Using curl**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "akuph95@gmail.com",
    "password": "royal@123"
  }'
```

### **Option 3: Using Frontend/Browser**

```javascript
POST http://localhost:5000/api/auth/login

Headers:
Content-Type: application/json

Body:
{
  "email": "akuph95@gmail.com",
  "password": "royal@123"
}
```

---

## 📋 **Admin Account Details**

| Field | Value |
|-------|-------|
| **Email** | `akuph95@gmail.com` |
| **Password** | `royal@123` |
| **Role** | `admin` |
| **Full Name** | Royal Bricks Admin |
| **Phone** | +91 8298344803 |

---

## 🔄 **Account Created**

The admin account has been created with these credentials. You can now:

1. ✅ Login to the admin dashboard
2. ✅ Access all admin-only endpoints
3. ✅ View analytics and statistics
4. ✅ Manage bookings and queries

---

## 🔒 **Security Note**

This password is stored securely:
- ✅ Hashed with bcrypt
- ✅ Never stored in plain text
- ✅ Protected by JWT authentication

---

## 📞 **Need Help?**

If you need to reset the admin account, run:
```bash
cd backend
npm run seed
```

This will recreate the admin user with the credentials above.
