# 🎯 CODELINKERS - SETUP STATUS & RUN GUIDE

## ✅ CURRENT SETUP STATUS

### ✓ COMPLETED SETUP ITEMS

**1. Project Structure** ✅
- Backend folder with complete API structure
- Frontend folder with all HTML/CSS/JS files
- Proper folder organization

**2. Dependencies Installed** ✅
- Node.js packages installed in backend/node_modules
- All required packages present:
  - express (Web framework)
  - mongoose (MongoDB ODM)
  - bcryptjs (Password hashing)
  - jsonwebtoken (JWT authentication)
  - cors (Cross-origin support)
  - dotenv (Environment variables)
  - multer (File uploads)
  - nodemon (Development auto-reload)

**3. MongoDB Database** ✅
- MongoDB is running (Process ID: 7204)
- Database name: codelinkers
- Connection: mongodb://localhost:27017/codelinkers

**4. Environment Configuration** ✅
- .env file exists in backend folder
- Configuration:
  - PORT: 5000
  - MONGODB_URI: mongodb://localhost:27017/codelinkers
  - JWT_SECRET: Configured
  - JWT_EXPIRE: 7 days
  - NODE_ENV: development

**5. Backend API** ✅
- Complete REST API implemented
- All routes configured:
  - Authentication routes
  - Question routes
  - Notes routes
  - Videos routes
  - User routes

**6. Frontend Files** ✅
- All HTML pages created (15+ pages)
- CSS styling complete
- JavaScript functionality implemented
- API integration done

---

## 🚀 HOW TO RUN THE PROJECT

### METHOD 1: Using Command Prompt (Recommended)

#### Step 1: Open Command Prompt
```
Press Windows + R
Type: cmd
Press Enter
```

#### Step 2: Navigate to Backend Folder
```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
```

#### Step 3: Start the Server
```bash
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

#### Step 4: Open Browser
```
Open your browser and go to:
http://localhost:5000
```

---

### METHOD 2: Using the Batch File

#### Step 1: Double-click START_SERVER.bat
```
Location: C:\Users\amaan\OneDrive\Desktop\PROgame\START_SERVER.bat
```

This will automatically:
- Navigate to backend folder
- Start the server
- Open browser to http://localhost:5000

---

### METHOD 3: Development Mode (Auto-reload)

For development with automatic restart on file changes:

```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm run dev
```

This uses nodemon to watch for file changes and restart automatically.

---

## 🌐 ACCESSING THE APPLICATION

### Main URLs

**1. Home Page**
```
http://localhost:5000
or
http://localhost:5000/index.html
```

**2. Games/Challenges Page**
```
http://localhost:5000/games.html
```

**3. Admin Panel**
```
http://localhost:5000/admin.html
```

**4. Notes Page**
```
http://localhost:5000/notes.html
```

**5. Video Learning Page**
```
http://localhost:5000/learn.html
```

**6. Leaderboard**
```
http://localhost:5000/leaderboard.html
```

**7. Play Game**
```
http://localhost:5000/play.html
```

---

## 👤 USER ACCOUNTS

### Creating a Regular User

**Step 1:** Go to http://localhost:5000

**Step 2:** Click "Sign Up" button

**Step 3:** Fill in the form:
- Name: Your Name
- Email: your@email.com
- Password: yourpassword (minimum 6 characters)

**Step 4:** Click "Create Account"

**Step 5:** You'll be automatically logged in

---

### Creating an Admin User

**Method 1: Using MongoDB Shell (mongosh)**

```bash
# Step 1: Open Command Prompt
cmd

# Step 2: Connect to MongoDB
mongosh

# Step 3: Switch to database
use codelinkers

# Step 4: Find your user
db.users.find({ email: "your@email.com" })

# Step 5: Update user role to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

# Step 6: Verify
db.users.findOne({ email: "your@email.com" })

# Step 7: Exit
exit
```

**Method 2: Using MongoDB Compass (GUI)**

1. Open MongoDB Compass
2. Connect to: mongodb://localhost:27017
3. Select database: codelinkers
4. Select collection: users
5. Find your user by email
6. Click Edit
7. Change "role" field from "user" to "admin"
8. Click Update

---

## 🔍 TESTING THE SETUP

### Test 1: Server Running
```bash
# Open browser to:
http://localhost:5000

# Expected: Home page loads with CodeLinkers branding
```

### Test 2: User Registration
```bash
# Go to home page
# Click "Sign Up"
# Fill form and submit
# Expected: Redirected to games page, logged in
```

### Test 3: User Login
```bash
# Go to home page
# Click "Login"
# Enter credentials
# Expected: Logged in successfully
```

### Test 4: View Games
```bash
# Go to: http://localhost:5000/games.html
# Expected: See list of coding challenges
```

### Test 5: Admin Panel (After creating admin)
```bash
# Go to: http://localhost:5000/admin.html
# Expected: Admin dashboard loads
```

### Test 6: API Endpoints
```bash
# Test in browser or Postman:
http://localhost:5000/api/questions
http://localhost:5000/api/notes
http://localhost:5000/api/videos
http://localhost:5000/api/users/leaderboard

# Expected: JSON data returned
```

---

## 📊 DATABASE VERIFICATION

### Check Database Connection

**Step 1: Open MongoDB Shell**
```bash
mongosh
```

**Step 2: List Databases**
```bash
show dbs
```
Expected: You should see "codelinkers" in the list

**Step 3: Switch to Database**
```bash
use codelinkers
```

**Step 4: Check Collections**
```bash
show collections
```
Expected collections:
- users
- questions
- notes
- videos

**Step 5: Count Documents**
```bash
db.users.countDocuments()
db.questions.countDocuments()
db.notes.countDocuments()
db.videos.countDocuments()
```

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Server Won't Start

**Problem:** Error when running `npm start`

**Solution:**
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# If port is in use, kill the process
taskkill /PID <process_id> /F

# Or change port in .env file
PORT=3000
```

---

### Issue 2: MongoDB Connection Error

**Problem:** "MongoDB connection failed"

**Solution:**
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# If not running, start MongoDB
# Method 1: As Windows Service
net start MongoDB

# Method 2: Manual start
mongod --dbpath "C:\data\db"
```

---

### Issue 3: Cannot Access Admin Panel

**Problem:** "Access denied" when opening admin.html

**Solution:**
```bash
# You need to set user role to admin
mongosh
use codelinkers
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

### Issue 4: Page Not Loading

**Problem:** Blank page or 404 error

**Solution:**
1. Check if server is running
2. Check browser console for errors (F12)
3. Verify URL is correct
4. Clear browser cache (Ctrl + Shift + Delete)
5. Try different browser

---

### Issue 5: Login Not Working

**Problem:** Cannot login with correct credentials

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check MongoDB is running
4. Clear localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   ```
5. Try registering new account

---

## 📝 QUICK COMMANDS REFERENCE

### Start Server
```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm start
```

### Start Server (Development Mode)
```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm run dev
```

### Stop Server
```
Press Ctrl + C in the terminal
```

### Check MongoDB Status
```bash
tasklist | findstr mongod
```

### Start MongoDB
```bash
net start MongoDB
```

### Stop MongoDB
```bash
net stop MongoDB
```

### Connect to MongoDB Shell
```bash
mongosh
```

### View Server Logs
```
Logs appear in the terminal where you ran npm start
```

---

## 🎯 COMPLETE STARTUP CHECKLIST

### Before Starting:
- [ ] MongoDB is installed
- [ ] Node.js is installed
- [ ] Dependencies are installed (npm install)
- [ ] .env file is configured

### To Start Application:
1. [ ] Open Command Prompt
2. [ ] Navigate to backend folder
3. [ ] Run `npm start`
4. [ ] Wait for "Server running" message
5. [ ] Open browser to http://localhost:5000
6. [ ] Register/Login as user
7. [ ] (Optional) Create admin user via MongoDB

### To Use Application:
1. [ ] Register new account
2. [ ] Browse coding challenges
3. [ ] Solve challenges and earn points
4. [ ] Check leaderboard
5. [ ] Access study notes
6. [ ] Watch video tutorials

### To Use Admin Panel:
1. [ ] Create admin user (via MongoDB)
2. [ ] Login with admin account
3. [ ] Go to admin.html
4. [ ] Create/Edit/Delete questions
5. [ ] Upload notes
6. [ ] Add videos
7. [ ] Manage users

---

## 📂 PROJECT STRUCTURE OVERVIEW

```
PROgame/
│
├── backend/                    # Server-side code
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & validation
│   │   ├── models/            # Database schemas
│   │   └── routes/            # API endpoints
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json           # Dependencies
│
├── frontend/                   # Client-side code
│   ├── index.html             # Home page
│   ├── games.html             # Challenges list
│   ├── play.html              # Game interface
│   ├── admin.html             # Admin panel
│   ├── notes.html             # Study materials
│   ├── learn.html             # Video tutorials
│   ├── leaderboard.html       # Rankings
│   ├── styles.css             # Main styles
│   ├── script.js              # Main JavaScript
│   └── api.js                 # API calls
│
└── Documentation/              # Project docs
    ├── README.md
    ├── PROJECT_REPORT_CHAPTER_1.md
    ├── PROJECT_REPORT_CHAPTER_2.md
    └── Various guides...
```

---

## 🔐 SECURITY NOTES

### Important Security Considerations:

1. **JWT Secret**
   - Change JWT_SECRET in .env to a strong random string
   - Never commit .env file to Git

2. **Admin Access**
   - Only grant admin role to trusted users
   - Admin can modify all content

3. **Password Security**
   - Passwords are hashed with bcrypt
   - Minimum 6 characters required
   - Never stored in plain text

4. **CORS**
   - Currently allows all origins (development)
   - Restrict in production

---

## 📈 PERFORMANCE TIPS

### For Better Performance:

1. **Use Development Mode**
   ```bash
   npm run dev  # Auto-reload on changes
   ```

2. **Clear Browser Cache**
   - Press Ctrl + Shift + Delete
   - Clear cached images and files

3. **Monitor Server Logs**
   - Watch terminal for errors
   - Check MongoDB logs

4. **Database Indexing**
   - MongoDB automatically indexes _id
   - Add custom indexes for frequently queried fields

---

## 🎓 LEARNING RESOURCES

### Understanding the Code:

**Backend (Node.js + Express):**
- `server.js` - Main server file
- `src/routes/` - API endpoint definitions
- `src/controllers/` - Request handling logic
- `src/models/` - Database schemas

**Frontend (HTML/CSS/JS):**
- `index.html` - Landing page
- `games.html` - Challenge browser
- `play.html` - Game interface
- `admin.html` - Admin dashboard

**Database (MongoDB):**
- Collections: users, questions, notes, videos
- Documents: JSON-like data structure
- Queries: Find, insert, update, delete

---

## 🚀 NEXT STEPS

### After Setup:

1. **Create Content**
   - Add coding questions via admin panel
   - Upload study notes
   - Add video tutorials

2. **Test Thoroughly**
   - Register multiple users
   - Solve challenges
   - Check leaderboard
   - Test admin functions

3. **Customize**
   - Update branding/colors
   - Add more features
   - Improve UI/UX

4. **Deploy (Optional)**
   - Host on Heroku/Vercel
   - Use MongoDB Atlas
   - Get custom domain

---

## 📞 SUPPORT & HELP

### If You Need Help:

1. **Check Documentation**
   - README.md
   - START_HERE.md
   - QUICK_REFERENCE.md

2. **Check Browser Console**
   - Press F12
   - Look for error messages
   - Check Network tab

3. **Check Server Logs**
   - Look at terminal output
   - Check for error messages

4. **Check MongoDB**
   - Verify connection
   - Check data exists
   - Verify collections

---

## ✅ FINAL VERIFICATION

### Everything Should Work If:

- [x] MongoDB is running (Process: mongod.exe)
- [x] Dependencies installed (node_modules exists)
- [x] .env file configured
- [x] Server starts without errors
- [x] Browser can access http://localhost:5000
- [x] Can register/login users
- [x] Can view games page
- [x] Admin panel accessible (after setting role)

---

## 🎉 YOU'RE READY!

### Your Setup is Complete! ✅

**What You Have:**
- ✅ Fully functional backend API
- ✅ Complete frontend interface
- ✅ MongoDB database running
- ✅ All dependencies installed
- ✅ Environment configured

**What You Can Do:**
- ✅ Register users
- ✅ Create coding challenges
- ✅ Solve challenges and earn points
- ✅ View leaderboard
- ✅ Access study materials
- ✅ Watch video tutorials
- ✅ Manage content via admin panel

**To Start Right Now:**
```bash
1. Open Command Prompt
2. cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
3. npm start
4. Open browser: http://localhost:5000
5. Start learning! 🚀
```

---

## 📊 SYSTEM STATUS SUMMARY

| Component | Status | Details |
|-----------|--------|---------|
| Node.js | ✅ Installed | Dependencies in node_modules |
| MongoDB | ✅ Running | Process ID: 7204 |
| Backend | ✅ Ready | All routes configured |
| Frontend | ✅ Ready | All pages created |
| Database | ✅ Connected | codelinkers database |
| Environment | ✅ Configured | .env file present |

**Overall Status: 🟢 READY TO RUN**

---

**Last Updated:** January 2026  
**Project:** CodeLinkers - Gamified Learning Platform  
**Version:** 1.0.0

---

## 🎯 QUICK START (TL;DR)

```bash
# 1. Open Command Prompt
cmd

# 2. Go to backend folder
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend

# 3. Start server
npm start

# 4. Open browser
http://localhost:5000

# 5. Register and start learning!
```

**That's it! You're ready to go! 🚀**

---
