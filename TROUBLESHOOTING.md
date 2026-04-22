# 🔧 TROUBLESHOOTING - Login/Signup Not Working

## ✅ QUICK FIX CHECKLIST

### 1. Is the Server Running?
Open Command Prompt and check:
```bash
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend
npm start
```

**You MUST see:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

**If you see errors, the server is NOT running!**

---

### 2. Check Browser Console
1. Open your website: http://localhost:5000
2. Press **F12** (Developer Tools)
3. Click **Console** tab
4. Try to login/signup
5. Look for RED errors

**Common Errors:**

#### Error: "Failed to fetch"
**Problem:** Server is not running  
**Solution:** Start the server (see step 1)

#### Error: "API is not defined"
**Problem:** api.js not loaded  
**Solution:** I just fixed this! Refresh your browser (Ctrl + F5)

#### Error: "CORS policy"
**Problem:** Wrong API URL  
**Solution:** Check backend/.env file

---

### 3. Test API Directly

Open browser console (F12) and paste:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**If this works, your backend is fine!**

---

## 🎯 STEP-BY-STEP FIX

### Step 1: Stop Everything
- Close all browser tabs
- Stop the server (Ctrl + C in terminal)
- Close MongoDB Compass

### Step 2: Start Fresh
```bash
# 1. Navigate to backend
cd C:\Users\amaan\OneDrive\Desktop\PROgame\backend

# 2. Make sure dependencies are installed
npm install

# 3. Seed the database (if not done)
npm run seed

# 4. Start server
npm start
```

### Step 3: Open Browser
1. Open **NEW** browser window
2. Go to: http://localhost:5000
3. Press **Ctrl + Shift + Delete** (Clear cache)
4. Select "Cached images and files"
5. Click "Clear data"
6. Refresh page (F5)

### Step 4: Test Login
1. Click "Sign Up"
2. Fill in details:
   - Name: Test User
   - Email: test@test.com
   - Password: 123456
   - Confirm: 123456
3. Click "Create Account"

**Expected Result:**
- Alert: "Account created successfully!"
- Page reloads
- You're logged in

**If you see error:**
- Open Console (F12)
- Tell me the exact error message

---

## 🐛 COMMON ISSUES

### Issue 1: "Cannot POST /api/auth/register"
**Problem:** Server routes not loaded  
**Solution:**
```bash
cd backend
npm install
npm start
```

### Issue 2: "MongoServerError"
**Problem:** MongoDB not running  
**Solution:**
1. Open Services (Win + R → services.msc)
2. Find "MongoDB Server"
3. Right-click → Start

### Issue 3: "Port 5000 already in use"
**Problem:** Another app using port 5000  
**Solution:**
1. Open `backend/.env`
2. Change: `PORT=5000` to `PORT=3000`
3. Restart server
4. Use: http://localhost:3000

### Issue 4: Popup shows but nothing happens
**Problem:** API not connected  
**Solution:**
1. Check if api.js is loaded (F12 → Sources tab)
2. Refresh browser (Ctrl + F5)
3. Check console for errors

---

## ✅ VERIFICATION

### Test 1: Server Health
Open browser: http://localhost:5000/api/health

**Should see:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test 2: Get Questions
Open browser: http://localhost:5000/api/questions

**Should see:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Test 3: Registration
1. Open http://localhost:5000
2. Click "Sign Up"
3. Fill form
4. Submit
5. Check MongoDB Compass → codequest → users
6. Your user should be there!

---

## 📞 STILL NOT WORKING?

### Send me these details:

1. **Server Output:**
   - Copy everything from terminal where server is running

2. **Browser Console Errors:**
   - Press F12 → Console tab
   - Copy all RED errors

3. **What happens when you click Sign Up:**
   - Does modal open?
   - Does form submit?
   - Any error messages?
   - Does page reload?

4. **MongoDB Status:**
   - Open MongoDB Compass
   - Can you connect?
   - Do you see `codequest` database?
   - Are there any collections?

---

## 🚀 QUICK TEST SCRIPT

Save this as `test.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <h1>CodeQuest API Test</h1>
    <button onclick="testAPI()">Test Registration</button>
    <pre id="result"></pre>

    <script>
        async function testAPI() {
            const result = document.getElementById('result');
            result.textContent = 'Testing...';

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test' + Date.now() + '@test.com',
                        password: '123456'
                    })
                });

                const data = await response.json();
                result.textContent = JSON.stringify(data, null, 2);

                if (data.success) {
                    result.style.color = 'green';
                    alert('✅ API WORKS! Your backend is fine!');
                } else {
                    result.style.color = 'red';
                }
            } catch (error) {
                result.textContent = 'ERROR: ' + error.message;
                result.style.color = 'red';
                alert('❌ Server not running or wrong URL!');
            }
        }
    </script>
</body>
</html>
```

---

**If test.html works but website doesn't, the issue is in the frontend integration!**
