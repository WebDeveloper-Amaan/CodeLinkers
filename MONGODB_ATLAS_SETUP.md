# MongoDB Atlas Setup Guide

## 🌐 Switch from Local to Cloud Database

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free forever)
3. Choose "Shared" (Free tier)
4. Select region closest to you
5. Create cluster (takes 3-5 minutes)

### Step 2: Configure Database Access

1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `codelinkers`
5. Password: Generate secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Configure Network Access

1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IP
4. Click "Confirm"

### Step 4: Get Connection String

1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string:
   ```
   mongodb+srv://codelinkers:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/CodeLinkers` before the `?`

**Final string:**
```
mongodb+srv://codelinkers:YourPassword123@cluster0.xxxxx.mongodb.net/CodeLinkers?retryWrites=true&w=majority
```

### Step 5: Update Your Project

**backend/.env**
```env
# Comment out local MongoDB
# MONGODB_URI=mongodb://localhost:27017/CodeLinkers

# Add Atlas connection
MONGODB_URI=mongodb+srv://codelinkers:YourPassword123@cluster0.xxxxx.mongodb.net/CodeLinkers?retryWrites=true&w=majority
```

### Step 6: Test Connection

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

### Step 7: Migrate Data (Optional)

If you want to move existing data from local to Atlas:

```bash
# Export from local
mongodump --db CodeLinkers --out ./backup

# Import to Atlas
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net" --db CodeLinkers ./backup/CodeLinkers
```

## 🔒 Security Best Practices

### For Production:

1. **Restrict IP Access:**
   - Don't use 0.0.0.0/0
   - Add only your server's IP address

2. **Use Environment Variables:**
   - Never commit `.env` file
   - Use hosting platform's environment variables

3. **Strong Password:**
   - Use generated password (not simple ones)
   - Store securely

4. **Enable Monitoring:**
   - Atlas provides free monitoring
   - Set up alerts for unusual activity

## 📊 Atlas Free Tier Limits

- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Unlimited connections
- ✅ Automatic backups (limited)
- ✅ 99.9% uptime SLA

**Perfect for:**
- Development
- Small projects
- Learning
- Prototypes
- Up to ~1000 users

## 🚀 When to Upgrade

Upgrade to paid tier when:
- Storage > 512 MB
- Need dedicated resources
- Need advanced backups
- Production app with many users

**Pricing:**
- M10 (Shared): $0.08/hour (~$57/month)
- M20 (Dedicated): $0.20/hour (~$144/month)

## 🔄 Switching Between Local and Atlas

**Development:**
```env
MONGODB_URI=mongodb://localhost:27017/CodeLinkers
```

**Production:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/CodeLinkers
```

**Use different databases:**
```env
# Development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/CodeLinkers_Dev

# Production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/CodeLinkers_Prod
```

## ✅ Verification Checklist

- [ ] Atlas account created
- [ ] Cluster created and running
- [ ] Database user added
- [ ] Network access configured
- [ ] Connection string copied
- [ ] .env file updated
- [ ] Backend restarts successfully
- [ ] Can create/read data
- [ ] Frontend connects properly

## 🆘 Troubleshooting

**Error: "Authentication failed"**
- Check username/password in connection string
- Verify user has correct permissions

**Error: "Connection timeout"**
- Check network access (IP whitelist)
- Verify connection string format

**Error: "Database not found"**
- Add database name to connection string
- Format: `...mongodb.net/CodeLinkers?...`

## 📞 Support

- Atlas Docs: https://docs.atlas.mongodb.com
- Community: https://community.mongodb.com
- Support: support@mongodb.com

---

**Ready to deploy? MongoDB Atlas makes it easy!** 🚀
