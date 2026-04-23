// Biometric Authentication Helper
const BiometricHelper = {
  // Capture face from webcam
  captureFace: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      throw new Error('Camera access denied or not available');
    }
  },

  // Record voice from microphone
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
      
      // Try to use audio/wav format if supported, otherwise webm
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
          console.log('Recorded audio blob:', blob.size, 'bytes, type:', blob.type);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log('Audio base64 length:', reader.result.length);
            resolve(reader.result);
          };
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
      console.error('Microphone error:', error);
      throw new Error('Microphone access denied or not available');
    }
  },

  // Show camera preview modal
  showCameraModal: (onCapture, requirePin = false) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 600px;">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">Face Recognition</h2>
        <p class="modal-subtitle">Position your face in the camera</p>
        <div style="position: relative; background: #000; border-radius: 12px; overflow: hidden;">
          <video id="biometric-video" autoplay style="width: 100%; display: block;"></video>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 250px; border: 3px solid #6366f1; border-radius: 50%; pointer-events: none;"></div>
        </div>
        ${requirePin ? `
        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">🔐 Security PIN (4 digits)</label>
          <input type="password" id="biometric-pin" class="form-input" placeholder="Enter 4-digit PIN" maxlength="4" pattern="\\d{4}" style="text-align: center; font-size: 1.5rem; letter-spacing: 8px;">
          <p style="font-size: 0.85rem; color: var(--text-dark-muted); margin-top: 8px;">This PIN will be required along with your face for login</p>
        </div>
        ` : ''}
        <button class="btn btn-primary w-full mt-4" id="capture-face-btn">
          <i class="fas fa-camera"></i> Capture Face
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = modal.querySelector('#biometric-video');
        video.srcObject = stream;
        
        modal.querySelector('#capture-face-btn').onclick = () => {
          let pin = null;
          if (requirePin) {
            const pinInput = modal.querySelector('#biometric-pin');
            pin = pinInput.value;
            if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
              alert('⚠️ Please enter a valid 4-digit PIN');
              return;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          
          stream.getTracks().forEach(track => track.stop());
          modal.remove();
          
          onCapture(canvas.toDataURL('image/jpeg'), pin);
        };
      })
      .catch(() => {
        alert('Camera access denied');
        modal.remove();
      });
  },

  // Show microphone recording modal
  showMicModal: (onRecord, requirePin = false) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 500px; text-align: center;">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">Voice Recognition</h2>
        <p class="modal-subtitle">Speak clearly for 3 seconds</p>
        <div style="padding: 40px;">
          <div id="recording-indicator" style="width: 100px; height: 100px; margin: 0 auto; border-radius: 50%; background: #ef4444; display: none; animation: pulse 1s infinite;"></div>
          <i class="fas fa-microphone" style="font-size: 4rem; color: #6366f1;"></i>
        </div>
        ${requirePin ? `
        <div class="form-group" style="text-align: left; margin-bottom: 16px;">
          <label class="form-label">🔐 Security PIN (4 digits)</label>
          <input type="password" id="biometric-pin" class="form-input" placeholder="Enter 4-digit PIN" maxlength="4" pattern="\\d{4}" style="text-align: center; font-size: 1.5rem; letter-spacing: 8px;">
          <p style="font-size: 0.85rem; color: var(--text-dark-muted); margin-top: 8px; text-align: center;">This PIN will be required along with your voice for login</p>
        </div>
        ` : ''}
        <button class="btn btn-primary w-full" id="record-voice-btn">
          <i class="fas fa-microphone"></i> Start Recording
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#record-voice-btn').onclick = async () => {
      let pin = null;
      if (requirePin) {
        const pinInput = modal.querySelector('#biometric-pin');
        pin = pinInput.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          alert('⚠️ Please enter a valid 4-digit PIN');
          return;
        }
      }
      
      const btn = modal.querySelector('#record-voice-btn');
      const indicator = modal.querySelector('#recording-indicator');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording...';
      indicator.style.display = 'block';
      
      try {
        const audioData = await BiometricHelper.recordVoice(3000);
        modal.remove();
        onRecord(audioData, pin);
      } catch (error) {
        alert('Microphone access denied');
        modal.remove();
      }
    };
  },

  // Show PIN prompt modal
  showPinModal: (userName, onSubmit) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal" style="max-width: 400px; text-align: center;">
        <h2 class="modal-title">Welcome ${userName}!</h2>
        <p class="modal-subtitle">Enter your security PIN to continue</p>
        <div class="form-group" style="margin: 24px 0;">
          <input type="password" id="verify-pin" class="form-input" placeholder="Enter 4-digit PIN" maxlength="4" pattern="\\d{4}" style="text-align: center; font-size: 2rem; letter-spacing: 12px;" autofocus>
        </div>
        <button class="btn btn-primary w-full" id="submit-pin-btn">
          <i class="fas fa-unlock"></i> Verify PIN
        </button>
        <button class="btn btn-ghost w-full mt-2" onclick="this.closest('.modal-overlay').remove()">
          Cancel
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    const submitPin = () => {
      const pin = modal.querySelector('#verify-pin').value;
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        alert('⚠️ Please enter a valid 4-digit PIN');
        return;
      }
      modal.remove();
      onSubmit(pin);
    };

    modal.querySelector('#submit-pin-btn').onclick = submitPin;
    modal.querySelector('#verify-pin').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitPin();
    });
  }
};

window.BiometricHelper = BiometricHelper;
