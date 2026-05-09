// Biometric Authentication Helper - IMPROVED WITH LOADING STATES
const BiometricHelper = {
  // Show camera preview modal with loading states
  showCameraModal: (onCapture, requirePin = false) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 600px;">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">
          <i class="fas fa-camera" style="color: var(--primary);"></i>
          Face Recognition
        </h2>
        <p class="modal-subtitle">Position your face in the camera frame</p>
        
        <!-- Loading State -->
        <div id="camera-loading" style="padding: 60px; text-align: center;">
          <div style="width: 60px; height: 60px; border: 4px solid rgba(99, 102, 241, 0.2); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite;"></div>
          <p style="color: var(--text-dark-muted);">Starting camera...</p>
        </div>
        
        <!-- Camera View -->
        <div id="camera-view" style="display: none;">
          <div style="position: relative; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);">
            <video id="biometric-video" autoplay style="width: 100%; display: block;"></video>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 250px; border: 3px dashed #6366f1; border-radius: 50%; pointer-events: none; box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);"></div>
            <div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.7); padding: 8px 16px; border-radius: 20px; color: white; font-size: 0.85rem;">
              <i class="fas fa-info-circle"></i> Align your face in the oval
            </div>
          </div>
          
          ${requirePin ? `
          <div class="form-group" style="margin-top: 20px;">
            <label class="form-label">
              <i class="fas fa-lock"></i> Security PIN (4 digits)
            </label>
            <input type="password" id="biometric-pin" class="form-input" placeholder="Enter 4-digit PIN" maxlength="4" pattern="\\d{4}" style="text-align: center; font-size: 1.5rem; letter-spacing: 8px;">
            <p style="font-size: 0.85rem; color: var(--text-dark-muted); margin-top: 8px; text-align: center;">
              <i class="fas fa-shield-alt"></i> This PIN adds extra security to your face login
            </p>
          </div>
          ` : ''}
          
          <button class="btn btn-primary w-full mt-4" id="capture-face-btn">
            <i class="fas fa-camera"></i> Capture Face
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      .then(stream => {
        const video = modal.querySelector('#biometric-video');
        video.srcObject = stream;
        
        // Hide loading, show camera
        setTimeout(() => {
          modal.querySelector('#camera-loading').style.display = 'none';
          modal.querySelector('#camera-view').style.display = 'block';
        }, 500);
        
        modal.querySelector('#capture-face-btn').onclick = async () => {
          let pin = null;
          if (requirePin) {
            const pinInput = modal.querySelector('#biometric-pin');
            pin = pinInput.value;
            if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
              showBiometricToast('⚠️ Please enter a valid 4-digit PIN', 'error');
              pinInput.focus();
              return;
            }
          }
          
          // Show processing state
          const btn = modal.querySelector('#capture-face-btn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
          
          // Capture image
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          
          stream.getTracks().forEach(track => track.stop());
          
          // Show success animation
          showBiometricToast('✅ Face captured successfully!', 'success');
          
          setTimeout(() => {
            modal.remove();
            onCapture(canvas.toDataURL('image/jpeg'), pin);
          }, 500);
        };
      })
      .catch(() => {
        modal.querySelector('#camera-loading').innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 16px;"></i>
            <h3 style="margin-bottom: 8px;">Camera Access Denied</h3>
            <p style="color: var(--text-dark-muted); margin-bottom: 20px;">Please allow camera access to use face recognition</p>
            <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Close</button>
          </div>
        `;
      });
  },

  // Show microphone recording modal with loading states
  showMicModal: (onRecord, requirePin = false) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 500px; text-align: center;">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">
          <i class="fas fa-microphone" style="color: var(--primary);"></i>
          Voice Recognition
        </h2>
        <p class="modal-subtitle">Speak clearly: "My voice is my password"</p>
        
        <div style="padding: 40px;">
          <div id="mic-icon" style="position: relative; width: 120px; height: 120px; margin: 0 auto;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0.1;"></div>
            <i class="fas fa-microphone" style="font-size: 4rem; color: var(--primary); position: relative; z-index: 1; line-height: 120px;"></i>
          </div>
          <div id="recording-indicator" style="display: none; margin-top: 20px;">
            <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 12px;">
              <div class="sound-wave"></div>
              <div class="sound-wave"></div>
              <div class="sound-wave"></div>
              <div class="sound-wave"></div>
              <div class="sound-wave"></div>
            </div>
            <p style="color: var(--danger); font-weight: 600;">
              <i class="fas fa-circle" style="animation: blink 1s infinite;"></i> Recording...
            </p>
            <p id="countdown" style="font-size: 2rem; font-weight: 700; color: var(--primary); margin-top: 8px;">3</p>
          </div>
        </div>
        
        ${requirePin ? `
        <div class="form-group" style="text-align: left; margin-bottom: 16px;">
          <label class="form-label">
            <i class="fas fa-lock"></i> Security PIN (4 digits)
          </label>
          <input type="password" id="biometric-pin" class="form-input" placeholder="Enter 4-digit PIN" maxlength="4" pattern="\\d{4}" style="text-align: center; font-size: 1.5rem; letter-spacing: 8px;">
          <p style="font-size: 0.85rem; color: var(--text-dark-muted); margin-top: 8px; text-align: center;">
            <i class="fas fa-shield-alt"></i> This PIN adds extra security to your voice login
          </p>
        </div>
        ` : ''}
        
        <button class="btn btn-primary w-full" id="record-voice-btn">
          <i class="fas fa-microphone"></i> Start Recording
        </button>
      </div>
      
      <style>
        .sound-wave {
          width: 4px;
          height: 40px;
          background: var(--primary);
          border-radius: 2px;
          animation: wave 1s ease-in-out infinite;
        }
        .sound-wave:nth-child(2) { animation-delay: 0.1s; }
        .sound-wave:nth-child(3) { animation-delay: 0.2s; }
        .sound-wave:nth-child(4) { animation-delay: 0.3s; }
        .sound-wave:nth-child(5) { animation-delay: 0.4s; }
        
        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 50px; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#record-voice-btn').onclick = async () => {
      let pin = null;
      if (requirePin) {
        const pinInput = modal.querySelector('#biometric-pin');
        pin = pinInput.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          showBiometricToast('⚠️ Please enter a valid 4-digit PIN', 'error');
          pinInput.focus();
          return;
        }
      }
      
      const btn = modal.querySelector('#record-voice-btn');
      const indicator = modal.querySelector('#recording-indicator');
      const micIcon = modal.querySelector('#mic-icon');
      const countdown = modal.querySelector('#countdown');
      
      btn.disabled = true;
      btn.style.display = 'none';
      micIcon.style.display = 'none';
      indicator.style.display = 'block';
      
      // Countdown
      let count = 3;
      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          countdown.textContent = count;
        } else {
          clearInterval(countdownInterval);
          countdown.textContent = '✓';
          countdown.style.color = 'var(--success)';
        }
      }, 1000);
      
      try {
        const audioData = await BiometricHelper.recordVoice(3000);
        
        // Show processing
        indicator.innerHTML = `
          <div style="width: 60px; height: 60px; border: 4px solid rgba(99, 102, 241, 0.2); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite;"></div>
          <p style="color: var(--text-dark-muted);">Processing voice...</p>
        `;
        
        showBiometricToast('✅ Voice recorded successfully!', 'success');
        
        setTimeout(() => {
          modal.remove();
          onRecord(audioData, pin);
        }, 500);
      } catch (error) {
        modal.remove();
        showBiometricToast('❌ Microphone access denied', 'error');
      }
    };
  },

  // Show PIN prompt modal with loading states
  showPinModal: (userName, onSubmit) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 450px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);">
          <i class="fas fa-user-check" style="font-size: 2rem; color: white;"></i>
        </div>
        <h2 class="modal-title">Welcome Back!</h2>
        <p class="modal-subtitle" style="font-size: 1.1rem; margin-bottom: 8px;">${userName}</p>
        <p style="color: var(--text-dark-muted); font-size: 0.9rem; margin-bottom: 24px;">
          <i class="fas fa-shield-alt"></i> Enter your security PIN to continue
        </p>
        
        <div class="form-group" style="margin: 24px 0;">
          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
            <input type="password" class="pin-digit" maxlength="1" pattern="\\d" style="width: 60px; height: 70px; text-align: center; font-size: 2rem; border-radius: 12px; border: 2px solid rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05);">
            <input type="password" class="pin-digit" maxlength="1" pattern="\\d" style="width: 60px; height: 70px; text-align: center; font-size: 2rem; border-radius: 12px; border: 2px solid rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05);">
            <input type="password" class="pin-digit" maxlength="1" pattern="\\d" style="width: 60px; height: 70px; text-align: center; font-size: 2rem; border-radius: 12px; border: 2px solid rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05);">
            <input type="password" class="pin-digit" maxlength="1" pattern="\\d" style="width: 60px; height: 70px; text-align: center; font-size: 2rem; border-radius: 12px; border: 2px solid rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05);">
          </div>
        </div>
        
        <button class="btn btn-primary w-full" id="submit-pin-btn">
          <i class="fas fa-unlock"></i> Verify PIN
        </button>
        <button class="btn btn-ghost w-full mt-2" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    // PIN input handling
    const pinInputs = modal.querySelectorAll('.pin-digit');
    pinInputs[0].focus();
    
    pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < 3) {
          pinInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          pinInputs[index - 1].focus();
        }
      });
    });

    const submitPin = async () => {
      const pin = Array.from(pinInputs).map(input => input.value).join('');
      
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showBiometricToast('⚠️ Please enter a valid 4-digit PIN', 'error');
        pinInputs[0].focus();
        return;
      }
      
      // Show loading
      const btn = modal.querySelector('#submit-pin-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
      
      // Add loading overlay to modal
      const loadingOverlay = document.createElement('div');
      loadingOverlay.style.cssText = 'position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; border-radius: 16px; z-index: 10;';
      loadingOverlay.innerHTML = `
        <div style="text-align: center;">
          <div style="width: 60px; height: 60px; border: 4px solid rgba(255, 255, 255, 0.2); border-top-color: white; border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite;"></div>
          <p style="color: white; font-weight: 600;">Verifying PIN...</p>
        </div>
      `;
      modal.querySelector('.modal').style.position = 'relative';
      modal.querySelector('.modal').appendChild(loadingOverlay);
      
      try {
        await onSubmit(pin);
        modal.remove();
      } catch (error) {
        loadingOverlay.remove();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-unlock"></i> Verify PIN';
        showBiometricToast('❌ Invalid PIN. Please try again.', 'error');
        pinInputs.forEach(input => input.value = '');
        pinInputs[0].focus();
      }
    };

    modal.querySelector('#submit-pin-btn').onclick = submitPin;
    pinInputs[3].addEventListener('input', (e) => {
      if (e.target.value.length === 1) {
        submitPin();
      }
    });
  },

  // Record voice helper
  recordVoice: async (duration = 3000) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, duration);
      });
    } catch (error) {
      throw new Error('Microphone access denied or not available');
    }
  }
};

// Toast notification for biometric actions
function showBiometricToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    right: 24px;
    z-index: 10000;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  
  if (type === 'success') {
    toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    toast.style.color = 'white';
  } else if (type === 'error') {
    toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    toast.style.color = 'white';
  } else {
    toast.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
    toast.style.color = 'white';
  }
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

window.BiometricHelper = BiometricHelper;
