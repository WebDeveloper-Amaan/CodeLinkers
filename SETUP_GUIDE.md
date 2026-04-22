# 🚀 Quick Setup Guide

## Step 1: Install MongoDB

### Option A: Local MongoDB (Recommended for Development)
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically on port 27017

### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env` with your connection string

## Step 2: Install Node.js
1. Download from: https://nodejs.org/ (LTS version)
2. Install with default settings
3. Verify: Open CMD and type `node --version`

## Step 3: Install Dependencies
```bash
cd backend
npm install
```

## Step 4: Start the Server

### Method 1: Double-click START_SERVER.bat
Just double-click the `START_SERVER.bat` file in the project root

### Method 2: Manual Start
```bash
cd backend
npm start
```

## Step 5: Access the Application
Open browser and go to: **http://localhost:5000**

---

## 🎯 First Time Setup

### Create Your First User
1. Go to http://localhost:5000
2. Click "Sign Up"
3. Fill in details and create account

### Create Admin User
After creating a regular user, make them admin:

1. Open MongoDB Compass or mongosh
2. Connect to: `mongodb://localhost:27017`
3. Select database: `codequest`
4. Select collection: `users`
5. Find your user and edit
6. Change `role` from `"user"` to `"admin"`
7. Save

OR use mongosh command:
```bash
mongosh
use codequest
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Add Sample Questions (Optional)
Login as admin and go to Admin Panel to add questions.

---

## 📁 Project Structure

```
PROgame/
├── backend/              # Server-side code
│   ├── src/
│   │   ├── models/      # Database schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & validation
│   │   └── config/      # Database config
│   ├── uploads/         # File storage
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
└── frontend/           # Client-side code
    ├── *.html         # Pages
    ├── *.css          # Styles
    ├── *.js           # Scripts
    └── api.js         # API service
```

---

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codequest
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random string before production!

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- **Error:** `MongoServerError: connect ECONNREFUSED`
- **Solution:** Make sure MongoDB is running
  - Windows: Check Services for "MongoDB Server"
  - Or start manually: `mongod`

### Port 5000 Already in Use
- **Error:** `EADDRINUSE: address already in use :::5000`
- **Solution:** 
  - Change PORT in `.env` to 3000 or 8000
  - Or kill the process using port 5000

### Cannot find module 'express'
- **Error:** `Cannot find module 'express'`
- **Solution:** Run `npm install` in backend folder

### CORS Error in Browser
- **Error:** `Access to fetch blocked by CORS policy`
- **Solution:** Backend already has CORS enabled. Check if server is running.

---

## 📝 API Testing

### Using Browser Console
```javascript
// Test registration
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    password: '123456'
  })
}).then(r => r.json()).then(console.log)

// Test login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: '123456'
  })
}).then(r => r.json()).then(console.log)
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Can register new user
- [ ] Can login
- [ ] Admin user created
- [ ] Can access admin panel

---

## 🎮 Next Steps

1. **Add Questions:** Login as admin → Admin Panel → Add Question
2. **Test Game:** Go to Games page → Start Playing
3. **Submit Answer:** Write CSS code → Submit
4. **Check Leaderboard:** View your rank and points

---

## 📞 Need Help?

- Check README.md for detailed documentation
- Review backend logs in terminal
- Check browser console (F12) for frontend errors
- Verify MongoDB connection in MongoDB Compass

---

## 🚀 Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas instead of local MongoDB
4. Enable HTTPS
5. Set up proper error logging
6. Configure file upload limits
7. Add rate limiting
8. Set up backups

---

**Happy Coding! 🎉**
