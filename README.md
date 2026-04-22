# CodeLinkers - Gamified Learning Platform

A full-stack web application for learning HTML, CSS, and programming through interactive coding challenges.

## 🏗️ Project Structure

```
PROgame/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # MongoDB schemas
│   │   └── routes/         # API routes
│   ├── uploads/            # File uploads
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   └── server.js          # Entry point
│
└── frontend/              # Static HTML/CSS/JS
    ├── index.html
    ├── games.html
    ├── admin.html
    ├── styles.css
    ├── script.js
    └── api.js            # API service layer
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install MongoDB** (if not already installed)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   - Edit `backend/.env` file
   - Update `MONGODB_URI` if using different MongoDB setup
   - Change `JWT_SECRET` to a secure random string

4. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

5. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Open browser: http://localhost:5000
   - API: http://localhost:5000/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)
- `POST /api/questions/submit` - Submit answer (protected)

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload note (admin only)
- `DELETE /api/notes/:id` - Delete note (admin only)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add video (admin only)
- `DELETE /api/videos/:id` - Delete video (admin only)

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/progress` - Get user progress (protected)
- `GET /api/users/stats` - Get user stats (protected)

## 🔐 Creating Admin User

To create an admin user, you need to manually update the database:

1. Register a normal user through the UI
2. Connect to MongoDB:
   ```bash
   mongosh
   use CodeLinkers
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 🎮 Features

### For Students
- ✅ User registration & authentication
- ✅ Browse coding challenges by topic & difficulty
- ✅ Submit answers and get instant feedback
- ✅ Track progress and earn points
- ✅ View leaderboard rankings
- ✅ Access study notes and video tutorials

### For Admins
- ✅ Create/edit/delete coding questions
- ✅ Upload study notes (PDF)
- ✅ Add video tutorial links
- ✅ View user statistics
- ✅ Manage content

## 🛠️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests
- LocalStorage for token management
- Responsive design

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/CodeLinkers
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS enabled

## 📦 Database Schema

### Users
- name, email, password (hashed)
- role (user/admin)
- points, progress array
- timestamps

### Questions
- title, description
- topic, difficulty, points
- hints, initialHTML, expectedCSS
- targetImage, status
- creator reference

### Notes
- title, category, semester, subject
- description, fileUrl, fileName
- uploader reference

### Videos
- title, url, category
- duration, channelName, description
- creator reference

## 🚧 Development

### Adding New Features

1. Create model in `backend/src/models/`
2. Create controller in `backend/src/controllers/`
3. Create routes in `backend/src/routes/`
4. Register routes in `backend/server.js`
5. Update frontend API in `frontend/api.js`

### Testing API

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in .env
- Or kill process: `netstat -ano | findstr :5000`

### CORS Issues
- Backend already has CORS enabled
- Check API_URL in frontend/api.js

## 📄 License

MIT License

## 👨‍💻 Author

CodeLinkers Team

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.
