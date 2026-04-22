# 🔧 QUICK FIX GUIDE - Port 5000 Already in Use

## ✅ PROBLEM SOLVED!

The error `EADDRINUSE: address already in use :::5000` means another process is already using port 5000.

**I've killed the process (PID: 16452) for you!**

---

## 🚀 HOW TO START THE SERVER NOW

### Option 1: Use the New Batch File (EASIEST)

**Double-click this file:**
```
START_SERVER_CLEAN.bat
```

This will:
- ✅ Automatically kill any process using port 5000
- ✅ Start the server
- ✅ Open in your default browser

---

### Option 2: Use Development Mode (For Coding)

**Double-click this file:**
```
START_DEV_MODE.bat
```

This will:
- ✅ Kill port 5000 process
- ✅ Start server with auto-reload (nodemon)
- ✅ Restart automatically when you save files

---

### Option 3: Manual Command (PowerShell/CMD)

```bash
# Step 1: Go to backend folder
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend

# Step 2: Start server
npm start
```

---

## 🛑 IF PORT 5000 IS BLOCKED AGAIN

### Quick Fix - Use the Kill Script

**Double-click:**
```
KILL_PORT_5000.bat
```

This will kill any process using port 5000.

---

### Manual Fix - PowerShell Commands

```powershell
# Step 1: Find process using port 5000
netstat -ano | findstr :5000

# Step 2: Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Example:
taskkill /PID 16452 /F
```

---

## 🔍 WHY THIS HAPPENS

**Common Reasons:**

1. **Previous server still running**
   - You started the server before and didn't stop it
   - Solution: Kill the process

2. **Another application using port 5000**
   - Some other app is using the same port
   - Solution: Kill it or change port

3. **Crashed server process**
   - Server crashed but process didn't close
   - Solution: Kill the process

---

## 🎯 RECOMMENDED WORKFLOW

### For Development:

1. **Use START_DEV_MODE.bat**
   - Double-click to start
   - Auto-reloads on file changes
   - Press Ctrl+C to stop

2. **When Done:**
   - Press Ctrl+C in terminal
   - Close terminal window

3. **Next Time:**
   - Just double-click START_DEV_MODE.bat again

---

### For Testing/Production:

1. **Use START_SERVER_CLEAN.bat**
   - Double-click to start
   - Stable server mode
   - Press Ctrl+C to stop

---

## 📝 ALTERNATIVE: CHANGE PORT

If you want to use a different port:

### Step 1: Edit .env file
```
Location: backend\.env

Change:
PORT=5000

To:
PORT=3000
(or any other port like 8080, 4000, etc.)
```

### Step 2: Update frontend API URL
```
Location: frontend\api.js

Change:
const API_URL = 'http://localhost:5000/api';

To:
const API_URL = 'http://localhost:3000/api';
```

### Step 3: Restart server
```bash
npm start
```

---

## ✅ VERIFICATION

### Check if Server is Running:

**Method 1: Browser**
```
Open: http://localhost:5000
Expected: CodeLinkers home page loads
```

**Method 2: Command**
```powershell
netstat -ano | findstr :5000
Expected: Shows process listening on port 5000
```

**Method 3: API Test**
```
Open: http://localhost:5000/api/questions
Expected: JSON data or empty array
```

---

## 🎮 COMPLETE STARTUP SEQUENCE

### Fresh Start (Recommended):

```bash
# 1. Kill any existing process
Double-click: KILL_PORT_5000.bat

# 2. Start server
Double-click: START_DEV_MODE.bat

# 3. Open browser
http://localhost:5000

# 4. Register/Login
Create account or login

# 5. Start using!
Browse games, solve challenges, etc.
```

---

## 🔄 RESTART SERVER

### If Server is Running:

**Method 1: In Terminal**
```
Press: Ctrl + C
Then: npm start (or npm run dev)
```

**Method 2: Close and Restart**
```
1. Close terminal window
2. Double-click START_DEV_MODE.bat
```

**Method 3: Kill and Restart**
```
1. Double-click KILL_PORT_5000.bat
2. Double-click START_DEV_MODE.bat
```

---

## 🐛 TROUBLESHOOTING OTHER ISSUES

### Issue: MongoDB Connection Error

**Error Message:**
```
MongoDB connection failed
```

**Solution:**
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# If not running, start it
net start MongoDB
```

---

### Issue: Cannot Access Admin Panel

**Error Message:**
```
Access denied
```

**Solution:**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use codelinkers

# Update user role
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

# Exit
exit
```

---

### Issue: Page Not Loading

**Symptoms:**
- Blank page
- 404 error
- Loading forever

**Solutions:**

1. **Check server is running**
   ```
   Look at terminal - should show "Server running on port 5000"
   ```

2. **Check browser console**
   ```
   Press F12
   Look for red error messages
   ```

3. **Clear browser cache**
   ```
   Press Ctrl + Shift + Delete
   Clear cached images and files
   ```

4. **Try different browser**
   ```
   Chrome, Firefox, Edge
   ```

---

### Issue: Login Not Working

**Symptoms:**
- Can't login with correct password
- "Invalid credentials" error

**Solutions:**

1. **Clear localStorage**
   ```javascript
   // Open browser console (F12)
   localStorage.clear()
   // Refresh page
   ```

2. **Check backend logs**
   ```
   Look at terminal for error messages
   ```

3. **Verify user exists**
   ```bash
   mongosh
   use codelinkers
   db.users.find({ email: "your@email.com" })
   ```

---

## 📊 PROCESS MANAGEMENT

### View All Node Processes:
```powershell
tasklist | findstr node
```

### Kill All Node Processes:
```powershell
taskkill /IM node.exe /F
```

### View Port Usage:
```powershell
netstat -ano | findstr LISTENING
```

---

## 🎯 BEST PRACTICES

### Do's ✅

1. **Always use batch files to start server**
   - They handle port conflicts automatically

2. **Use development mode when coding**
   - Auto-reload saves time

3. **Stop server properly**
   - Press Ctrl+C before closing terminal

4. **Check terminal for errors**
   - Read error messages carefully

5. **Keep MongoDB running**
   - Server needs database connection

### Don'ts ❌

1. **Don't close terminal without stopping server**
   - Leaves process running

2. **Don't start multiple servers**
   - Causes port conflicts

3. **Don't ignore error messages**
   - They tell you what's wrong

4. **Don't forget to save files**
   - Changes won't apply until saved

---

## 🚀 QUICK COMMANDS CHEAT SHEET

```powershell
# Kill port 5000
netstat -ano | findstr :5000
taskkill /PID XXXX /F

# Start server (normal)
cd backend
npm start

# Start server (dev mode)
cd backend
npm run dev

# Stop server
Ctrl + C

# Check MongoDB
tasklist | findstr mongod

# Start MongoDB
net start MongoDB

# Connect to MongoDB
mongosh

# View logs
(Check terminal output)
```

---

## 📞 NEED MORE HELP?

### Check These Files:

1. **SETUP_STATUS_AND_RUN_GUIDE.md**
   - Complete setup instructions
   - Detailed troubleshooting

2. **README.md**
   - Project overview
   - API documentation

3. **START_HERE.md**
   - Quick start guide
   - Feature overview

---

## ✅ CURRENT STATUS

**Port 5000:** ✅ FREE (Process killed)  
**MongoDB:** ✅ RUNNING  
**Dependencies:** ✅ INSTALLED  
**Configuration:** ✅ READY  

**You can now start the server!**

---

## 🎉 READY TO GO!

### Start Now:

**Option 1 (Easiest):**
```
Double-click: START_DEV_MODE.bat
```

**Option 2 (Manual):**
```powershell
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm run dev
```

**Then open browser:**
```
http://localhost:5000
```

---

**Happy Coding! 🚀**

---

## 📋 FILES CREATED FOR YOU

1. **START_SERVER_CLEAN.bat**
   - Kills port 5000 process
   - Starts server in normal mode

2. **START_DEV_MODE.bat**
   - Kills port 5000 process
   - Starts server with auto-reload

3. **KILL_PORT_5000.bat**
   - Just kills the port 5000 process
   - Use when you need to free the port

4. **QUICK_FIX_GUIDE.md** (this file)
   - Complete troubleshooting guide
   - Quick reference

---

**All files are in:** `C:\Users\amaan\OneDrive\Desktop\PROgame\`

---
