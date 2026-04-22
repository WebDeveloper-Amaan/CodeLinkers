# 🔒 PRE-PRODUCTION SECURITY CHECKLIST

## ⏰ **When to Use This:**
Run this checklist **1 week before deploying to production**

---

## ✅ **Quick Security Setup (1-2 hours)**

### Step 1: Install Security Packages (5 minutes)
```bash
cd backend
npm install helmet express-rate-limit express-mongo-sanitize xss-clean cors
```

### Step 2: Generate Strong JWT Secret (1 minute)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update `backend/.env`:
```env
JWT_SECRET=<paste-the-long-random-string-here>
```

### Step 3: Update server.js (10 minutes)

Add these imports at the top:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
```

Add these middlewares (after `app.use(cors())`):
```javascript
// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
```

### Step 4: Update CORS (5 minutes)

Replace:
```javascript
app.use(cors());
```

With:
```javascript
app.use(cors({
  origin: 'https://your-domain.com', // Your production domain
  credentials: true
}));
```

### Step 5: Update .env for Production (2 minutes)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codequest
JWT_SECRET=<your-strong-secret-from-step-2>
JWT_EXPIRE=7d
```

### Step 6: Password Validation (10 minutes)

Update `backend/src/models/User.js`:
```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [8, 'Password must be at least 8 characters'], // Changed from 6 to 8
  select: false,
  validate: {
    validator: function(v) {
      // At least one uppercase, one lowercase, one number
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
    },
    message: 'Password must contain uppercase, lowercase, and number'
  }
}
```

### Step 7: Add Login Rate Limiting (5 minutes)

Create `backend/src/middleware/loginLimiter.js`:
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true
});

module.exports = loginLimiter;
```

Update `backend/src/routes/authRoutes.js`:
```javascript
const loginLimiter = require('../middleware/loginLimiter');

router.post('/login', loginLimiter, login);
```

### Step 8: Environment Check (2 minutes)

Add to `backend/server.js` (at the top):
```javascript
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET === 'your_jwt_secret_key_change_this_in_production_12345') {
    console.error('❌ CRITICAL: Change JWT_SECRET in production!');
    process.exit(1);
  }
}
```

### Step 9: Remove Console Logs (10 minutes)

Search and remove/comment all `console.log()` statements in production code.

Or add this to `backend/server.js`:
```javascript
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
}
```

### Step 10: Setup MongoDB Atlas (15 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (or allow all: 0.0.0.0/0)
5. Get connection string
6. Update MONGODB_URI in .env

---

## ✅ **Deployment Checklist:**

### Before Deploying:
- [ ] Strong JWT_SECRET generated
- [ ] Security packages installed
- [ ] Helmet.js added
- [ ] Rate limiting added
- [ ] Input sanitization added
- [ ] CORS configured for production domain
- [ ] Password validation strengthened
- [ ] Login rate limiting added
- [ ] Console logs removed
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] NODE_ENV=production
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Tested on staging environment

### After Deploying:
- [ ] Test registration
- [ ] Test login
- [ ] Test all features
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Set up backups
- [ ] Add monitoring (optional)

---

## 🚀 **Deployment Platforms:**

### Option 1: Heroku (Easiest)
```bash
# Install Heroku CLI
# Login: heroku login
# Create app: heroku create your-app-name
# Add MongoDB: heroku addons:create mongolab
# Deploy: git push heroku main
```

### Option 2: Vercel (Frontend) + Railway (Backend)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Database: MongoDB Atlas

### Option 3: AWS/DigitalOcean (Advanced)
- Full control
- More configuration needed
- Better for scaling

---

## 📊 **Security Testing:**

### Test These Before Going Live:
1. **SQL Injection:** Try `' OR '1'='1` in login
2. **XSS:** Try `<script>alert('xss')</script>` in inputs
3. **Rate Limiting:** Try 10 rapid login attempts
4. **Token Expiry:** Wait 7 days, token should expire
5. **HTTPS:** All requests should use HTTPS
6. **CORS:** Only your domain should access API

---

## 💡 **Pro Tips:**

1. **Test on Staging First**
   - Deploy to test environment
   - Test everything
   - Then deploy to production

2. **Keep Development Separate**
   - Use different .env files
   - Different databases
   - Different domains

3. **Monitor Everything**
   - Use error tracking (Sentry)
   - Monitor uptime (UptimeRobot)
   - Check logs regularly

4. **Backup Database**
   - MongoDB Atlas auto-backups
   - Or manual exports weekly

---

## 🎯 **Estimated Time:**

- **Security Setup:** 1-2 hours
- **MongoDB Atlas:** 15 minutes
- **Deployment:** 30 minutes
- **Testing:** 1 hour
- **Total:** 3-4 hours

---

## 📞 **When You're Ready:**

1. Complete all features
2. Test everything thoroughly
3. Come back to this checklist
4. Follow step by step
5. Deploy! 🚀

---

**Save this file and use it when you're ready to deploy!**

**For now, keep building features! Your current security is fine for development.** ✅
