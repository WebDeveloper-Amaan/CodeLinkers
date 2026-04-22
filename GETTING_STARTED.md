# 🚀 Getting Started with CodeQuest

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Windows 10/11
- ✅ Internet connection
- ✅ Administrator access

## 🔧 Installation Steps

### Step 1: Install MongoDB (5 minutes)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Click: Download

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Click "Install"

3. **Verify Installation**
   - Open Command Prompt
   - Type: `mongod --version`
   - You should see version information

### Step 2: Install Node.js (3 minutes)

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Download LTS version (recommended)

2. **Install Node.js**
   - Run the installer
   - Accept all defaults
   - Click "Install"

3. **Verify Installation**
   - Open Command Prompt
   - Type: `node --version`
   - Type: `npm --version`
   - Both should show version numbers

### Step 3: Install Project Dependencies (2 minutes)

1. **Open Command Prompt**
   - Press `Win + R`
   - Type: `cmd`
   - Press Enter

2. **Navigate to Project**
   ```bash
   cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```
   - Wait for installation to complete (1-2 minutes)

### Step 4: Seed Sample Data (1 minute)

1. **Run Seed Script**
   ```bash
   npm run seed
   ```

2. **You should see:**
   ```
   ✅ MongoDB Connected
   🗑️  Cleared existing questions
   👤 Created admin user
      Email: admin@codequest.com
      Password: admin123
   ✅ Added 10 sample questions
   🎉 Database seeded successfully!
   ```

### Step 5: Start the Server (1 minute)

**Option A: Quick Start (Recommended)**
- Double-click `START_SERVER.bat` in the project root folder

**Option B: Manual Start**
```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📁 Frontend: http://localhost:5000
🔌 API: http://localhost:5000/api
```

### Step 6: Access the Application

1. **Open Browser**
   - Chrome, Firefox, or Edge

2. **Go to:**
   ```
   http://localhost:5000
   ```

3. **You should see the CodeQuest homepage!** 🎉

---

## 👤 User Accounts

### Admin Account (Pre-created)
- **Email:** admin@codequest.com
- **Password:** admin123
- **Access:** Admin Panel, Create Questions, Upload Notes

### Create Your Own Account
1. Click "Sign Up" button
2. Fill in your details
3. Click "Create Account"
4. You're logged in!

---

## 🎮 How to Use

### For Students

#### 1. Register/Login
- Click "Sign Up" to create account
- Or "Log In" if you have account

#### 2. Browse Games
- Go to "Games" page
- Choose HTML or CSS
- Select difficulty level

#### 3. Play Challenges
- Click "Start Playing"
- Read the challenge description
- Write your CSS code
- Submit answer

#### 4. Earn Points
- Beginner: +5 points
- Medium: +10 points
- Advanced: +20 points

#### 5. Check Leaderboard
- Go to "Leaderboard" page
- See your rank
- Compete with others

### For Admins

#### 1. Login as Admin
- Use: admin@codequest.com / admin123
- Or login with your admin account

#### 2. Access Admin Panel
- Click "Admin Panel" in footer
- Or go to: http://localhost:5000/admin.html

#### 3. Add Questions
- Click "Add Question" button
- Fill in details:
  - Title
  - Description
  - Topic (HTML/CSS)
  - Difficulty
  - Expected CSS solution
  - Hints (optional)
- Click "Create Question"

#### 4. Upload Notes
- Click "Upload Notes" button
- Fill in details
- Select PDF file
- Click "Upload"

#### 5. Add Videos
- Click "Add Video" button
- Enter YouTube URL
- Fill in details
- Click "Add Video"

---

## 📊 Testing the System

### Test 1: User Registration
1. Go to homepage
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@test.com
   - Password: 123456
   - Confirm: 123456
4. Click "Create Account"
5. ✅ Should show success and reload

### Test 2: User Login
1. Click "Log In"
2. Enter:
   - Email: test@test.com
   - Password: 123456
3. Click "Log In"
4. ✅ Should show success and reload

### Test 3: View Questions
1. Go to "Games" page
2. ✅ Should see HTML and CSS games
3. ✅ Should see 10 sample questions

### Test 4: Submit Answer (Coming Soon)
1. Click "Start Playing"
2. Write CSS code
3. Click "Submit"
4. ✅ Should validate answer

### Test 5: Admin Panel
1. Login as admin
2. Go to Admin Panel
3. ✅ Should see dashboard
4. ✅ Should see all questions

---

## 🗂️ Project Structure

```
PROgame/
│
├── 📁 backend/              # Server-side code
│   ├── 📁 src/
│   │   ├── 📁 config/      # Database setup
│   │   ├── 📁 controllers/ # Business logic
│   │   ├── 📁 middleware/  # Authentication
│   │   ├── 📁 models/      # Database schemas
│   │   └── 📁 routes/      # API endpoints
│   ├── 📁 uploads/         # File storage
│   ├── 📄 .env            # Configuration
│   ├── 📄 package.json    # Dependencies
│   ├── 📄 server.js       # Main server
│   └── 📄 seed.js         # Sample data
│
├── 📁 frontend/            # Client-side code
│   ├── 📄 index.html      # Homepage
│   ├── 📄 games.html      # Games page
│   ├── 📄 admin.html      # Admin panel
│   ├── 📄 styles.css      # Styles
│   ├── 📄 script.js       # Main JS
│   └── 📄 api.js          # API calls
│
├── 📄 START_SERVER.bat    # Quick start
├── 📄 README.md           # Documentation
├── 📄 SETUP_GUIDE.md      # Setup guide
└── 📄 GETTING_STARTED.md  # This file
```

---

## 🔍 Verify Everything Works

### Checklist
- [ ] MongoDB is running
- [ ] Node.js is installed
- [ ] Dependencies installed (`npm install`)
- [ ] Sample data seeded (`npm run seed`)
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Can see homepage
- [ ] Can register new user
- [ ] Can login
- [ ] Can see games page
- [ ] Can access admin panel (as admin)
- [ ] Can see 10 sample questions

---

## 🐛 Troubleshooting

### Problem: MongoDB Connection Failed
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Open Services (Win + R → services.msc)
2. Find "MongoDB Server"
3. Right-click → Start
4. Try again

### Problem: Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Open `backend/.env`
2. Change `PORT=5000` to `PORT=3000`
3. Restart server
4. Access: http://localhost:3000

### Problem: Cannot Find Module
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### Problem: Page Not Loading
**Solution:**
1. Check if server is running
2. Check console for errors (F12)
3. Try: http://localhost:5000/index.html
4. Clear browser cache (Ctrl + Shift + Delete)

---

## 📞 Need Help?

### Check These Files:
1. **README.md** - Complete documentation
2. **SETUP_GUIDE.md** - Detailed setup
3. **IMPLEMENTATION_SUMMARY.md** - What's implemented

### Check Logs:
1. **Server logs** - In terminal where server is running
2. **Browser console** - Press F12 → Console tab
3. **MongoDB logs** - Check MongoDB Compass

### Common Commands:
```bash
# Check if MongoDB is running
mongosh

# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies
cd backend
npm install

# Seed database
npm run seed

# Start server
npm start

# Start with auto-reload
npm run dev
```

---

## 🎯 Next Steps

### 1. Explore the Platform
- Browse all pages
- Try different features
- Test as both user and admin

### 2. Add More Questions
- Login as admin
- Go to Admin Panel
- Create your own questions

### 3. Customize
- Change colors in styles.css
- Add new features
- Modify existing pages

### 4. Deploy (Optional)
- Use Heroku, Vercel, or AWS
- Set up MongoDB Atlas
- Configure environment variables

---

## 🎉 Congratulations!

You now have a fully functional learning platform with:
- ✅ User authentication
- ✅ Database storage
- ✅ Admin panel
- ✅ Question management
- ✅ Points system
- ✅ Leaderboard
- ✅ File uploads
- ✅ API endpoints

**Start learning and have fun! 🚀**

---

## 📚 Learn More

- **MongoDB:** https://docs.mongodb.com/
- **Node.js:** https://nodejs.org/docs/
- **Express:** https://expressjs.com/
- **JWT:** https://jwt.io/

---

**Made with ❤️ for beginner coders**
