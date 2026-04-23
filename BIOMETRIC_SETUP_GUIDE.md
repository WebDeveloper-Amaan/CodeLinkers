# 🔐 BIOMETRIC AUTHENTICATION SETUP GUIDE

## ✅ What's Been Done

### Backend (Node.js)
- ✅ User model updated with `faceEmbedding`, `voiceEmbedding`, `biometricEnabled` fields
- ✅ Biometric controller created (`biometricController.js`)
- ✅ Biometric routes added (`/api/biometric/*`)
- ✅ Server.js updated to include biometric routes
- ✅ Axios dependency added for Python service communication

### Python Service
- ✅ Flask API created (`biometric-service/app.py`)
- ✅ Face authentication module (`face_auth.py`)
- ✅ Voice authentication module (`voice_auth.py`)
- ✅ Requirements.txt with all dependencies

### Frontend
- ✅ Biometric API methods added to `api.js`
- ✅ Biometric helper created (`biometric.js`) for camera/mic access

---

## 🚀 INSTALLATION STEPS

### Step 1: Install Node.js Dependencies

```bash
cd backend
npm install
```

This will install the new `axios` package needed for Python communication.

---

### Step 2: Install Python Dependencies

```bash
cd biometric-service
pip install -r requirements.txt
```

**Important:** This will install:
- Flask (web framework)
- dlib (face recognition - requires CMake)
- resemblyzer (voice recognition)
- librosa (audio processing)
- numpy, scikit-learn

**For Windows users:**
If dlib installation fails, install CMake first:
```bash
pip install cmake
pip install dlib
```

Or download pre-built dlib wheel from:
https://github.com/z-mahmud22/Dlib_Windows_Python3.x

---

### Step 3: Download Face Recognition Models

The face recognition needs pre-trained models. Download these files:

1. **shape_predictor_68_face_landmarks.dat**
2. **dlib_face_recognition_resnet_model_v1.dat**

Download from: http://dlib.net/files/

Place them in: `biometric-service/models/`

```bash
mkdir biometric-service\models
# Place downloaded .dat files here
```

---

### Step 4: Start Python Flask Service

```bash
cd biometric-service
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5001
 * Biometric service ready!
```

**Keep this terminal running!**

---

### Step 5: Start Node.js Backend

Open a NEW terminal:

```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 5000
📁 Frontend: http://localhost:5000
🔌 API: http://localhost:5000/api
```

---

### Step 6: Update Frontend HTML Files

Add biometric.js script to your HTML files:

**In `index.html`, `games.html`, etc., add before closing `</body>`:**

```html
<script src="api.js"></script>
<script src="biometric.js"></script>
<script src="script.js"></script>
```

---

## 🎮 HOW TO USE

### For Users (Enrollment)

1. **Register normally** with email/password
2. **After login**, go to Profile/Settings
3. Click **"Enable Face Recognition"** or **"Enable Voice Recognition"**
4. Allow camera/microphone access
5. Capture face or record voice
6. Biometric data saved!

### For Users (Login)

1. On login page, click **"Login with Face"** or **"Login with Voice"**
2. Allow camera/microphone
3. Capture/record
4. If recognized → Logged in automatically!

---

## 🔧 ADDING BIOMETRIC BUTTONS TO LOGIN MODAL

Update your `index.html` login modal:

```html
<!-- Login Modal -->
<div class="modal-overlay" id="loginModal">
    <div class="modal">
        <button class="modal-close" onclick="ModalManager.close('loginModal')">
            <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">Welcome Back!</h2>
        <p class="modal-subtitle">Log in to continue your learning journey</p>
        
        <!-- BIOMETRIC LOGIN BUTTONS -->
        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <button class="btn btn-secondary w-full" onclick="loginWithFace()">
                <i class="fas fa-camera"></i> Face Login
            </button>
            <button class="btn btn-secondary w-full" onclick="loginWithVoice()">
                <i class="fas fa-microphone"></i> Voice Login
            </button>
        </div>
        
        <div style="text-align: center; margin: 20px 0; color: #888;">
            <span>OR</span>
        </div>
        
        <!-- EXISTING EMAIL/PASSWORD FORM -->
        <form id="loginForm">
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-input" placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-input" placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary w-full">
                <i class="fas fa-sign-in-alt"></i> Log In
            </button>
        </form>
    </div>
</div>
```

---

## 📝 JAVASCRIPT FUNCTIONS

Add these functions to your `script.js`:

```javascript
// Face Login
async function loginWithFace() {
    try {
        BiometricHelper.showCameraModal(async (faceImage) => {
            try {
                const response = await API.Biometric.verifyFace(faceImage);
                const { token, user } = response.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                alert('Face recognized! Welcome back, ' + user.name);
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Face not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        alert('Camera access required for face login');
    }
}

// Voice Login
async function loginWithVoice() {
    try {
        BiometricHelper.showMicModal(async (voiceAudio) => {
            try {
                const response = await API.Biometric.verifyVoice(voiceAudio);
                const { token, user } = response.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                alert('Voice recognized! Welcome back, ' + user.name);
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Voice not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        alert('Microphone access required for voice login');
    }
}

// Enroll Face (call after user logs in)
async function enrollFace() {
    try {
        BiometricHelper.showCameraModal(async (faceImage) => {
            try {
                await API.Biometric.enrollFace(faceImage);
                alert('Face enrolled successfully! You can now login with your face.');
            } catch (error) {
                alert('Failed to enroll face: ' + error.message);
            }
        });
    } catch (error) {
        alert('Camera access required');
    }
}

// Enroll Voice (call after user logs in)
async function enrollVoice() {
    try {
        BiometricHelper.showMicModal(async (voiceAudio) => {
            try {
                await API.Biometric.enrollVoice(voiceAudio);
                alert('Voice enrolled successfully! You can now login with your voice.');
            } catch (error) {
                alert('Failed to enroll voice: ' + error.message);
            }
        });
    } catch (error) {
        alert('Microphone access required');
    }
}
```

---

## 🧪 TESTING

### Test Face Recognition:

1. Start both servers (Python + Node.js)
2. Register a new user
3. Login with email/password
4. Call `enrollFace()` from browser console
5. Capture your face
6. Logout
7. Click "Login with Face"
8. Should recognize you!

### Test Voice Recognition:

1. Same steps but use `enrollVoice()` and "Login with Voice"

---

## 🔒 SECURITY NOTES

- ✅ Only embeddings (mathematical representations) are stored, NOT actual images/audio
- ✅ Embeddings are 128D arrays for face, 256D for voice
- ✅ Cannot reverse-engineer face/voice from embeddings
- ✅ Similarity threshold is 65% (adjustable in controller)
- ✅ Biometric is optional - users can still use password

---

## 🐛 TROUBLESHOOTING

### Python Service Won't Start
- Check if port 5001 is free: `netstat -ano | findstr :5001`
- Install missing dependencies: `pip install -r requirements.txt`
- Download face recognition models

### Camera/Mic Not Working
- Check browser permissions (Chrome: Settings → Privacy → Camera/Microphone)
- Use HTTPS in production (required for camera/mic access)
- Test on localhost first

### Face Not Recognized
- Ensure good lighting
- Face should be clearly visible
- Try enrolling again with better image
- Lower threshold in `biometricController.js` (line 82: change 0.65 to 0.55)

### Voice Not Recognized
- Speak clearly for full 3 seconds
- Reduce background noise
- Use same microphone for enrollment and login
- Lower threshold in controller

---

## 📊 API ENDPOINTS

### Enrollment (Protected - requires login)
- `POST /api/biometric/enroll-face` - Body: `{ faceImage: "base64..." }`
- `POST /api/biometric/enroll-voice` - Body: `{ voiceAudio: "base64..." }`

### Verification (Public)
- `POST /api/biometric/verify-face` - Body: `{ faceImage: "base64..." }`
- `POST /api/biometric/verify-voice` - Body: `{ voiceAudio: "base64..." }`

---

## 🚀 DEPLOYMENT

### Option 1: Same Server
Deploy both Node.js and Python on same server (Railway, Render)

### Option 2: Separate Services
- Node.js → Railway/Vercel
- Python → Render/Heroku
- Update `PYTHON_SERVICE_URL` in `biometricController.js`

### Option 3: Docker
Use docker-compose to run both services together.

---

## ✅ CHECKLIST

- [ ] Install Node.js dependencies (`npm install`)
- [ ] Install Python dependencies (`pip install -r requirements.txt`)
- [ ] Download face recognition models
- [ ] Start Python service (port 5001)
- [ ] Start Node.js service (port 5000)
- [ ] Add biometric.js to HTML files
- [ ] Add biometric buttons to login modal
- [ ] Add JavaScript functions to script.js
- [ ] Test face enrollment
- [ ] Test face login
- [ ] Test voice enrollment
- [ ] Test voice login

---

## 🎯 NEXT STEPS

1. **Create Profile Page** - Add buttons for "Enable Face Login" and "Enable Voice Login"
2. **Add Loading States** - Show spinner during biometric processing
3. **Improve UI** - Better camera preview, countdown timer for voice
4. **Add Liveness Detection** - Prevent photo/recording spoofing
5. **Multi-factor Auth** - Combine password + biometric

---

## 📞 SUPPORT

If you encounter issues:
1. Check both servers are running
2. Check browser console for errors
3. Verify Python service is accessible: http://localhost:5001/health
4. Test with Postman/curl first

---

**Your biometric authentication is now ready! 🎉**
