// ============================================
// CodeLinkers - Main JavaScript
// ============================================

// Theme Management
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    },

    toggle() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
};

// Modal Management
const ModalManager = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    init() {
        // Close modal on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });
    }
};

// Navbar Scroll Effect
const NavbarManager = {
    init() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
};

// Scroll Reveal Animation
const RevealManager = {
    init() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
};

// Counter Animation
const CounterManager = {
    animate(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };

        updateCounter();
    },

    init() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
};

// Smooth Scroll for anchor links
const SmoothScrollManager = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Mobile Menu
const MobileMenuManager = {
    init() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
            });
        }
    },
    
    toggleMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('mobile-active');
        }
    }
};

// Tabs Management
const TabsManager = {
    init() {
        document.querySelectorAll('[data-tab-group]').forEach(group => {
            const tabs = group.querySelectorAll('[data-tab]');
            const panels = group.querySelectorAll('[data-tab-panel]');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetPanel = tab.dataset.tab;

                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Show target panel
                    panels.forEach(panel => {
                        if (panel.dataset.tabPanel === targetPanel) {
                            panel.classList.add('active');
                        } else {
                            panel.classList.remove('active');
                        }
                    });
                });
            });
        });
    }
};

// Form Validation
const FormManager = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password) {
        return password.length >= 6;
    },

    showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.form-error') || document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 4px; display: block;';
        
        if (!formGroup.querySelector('.form-error')) {
            formGroup.appendChild(errorEl);
        }
        input.style.borderColor = '#ef4444';
    },

    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) errorEl.remove();
        input.style.borderColor = '';
    },

    init() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('[name="email"]');
                const password = loginForm.querySelector('[name="password"]');
                let valid = true;

                this.clearError(email);
                this.clearError(password);

                if (!this.validateEmail(email.value)) {
                    this.showError(email, 'Please enter a valid email');
                    valid = false;
                }

                if (!this.validatePassword(password.value)) {
                    this.showError(password, 'Password must be at least 6 characters');
                    valid = false;
                }

                if (valid) {
                    // Handle login with API
                    const btn = loginForm.querySelector('button[type="submit"]');
                    const originalHTML = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                    API.Auth.login({ email: email.value, password: password.value })
                        .then(response => {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            
                            ModalManager.close('loginModal');
                            showSuccessMessage('✅ Login successful! Welcome back, ' + response.user.name + '!');
                            
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(error => {
                            showErrorMessage('❌ ' + (error.message || 'Login failed. Please check your credentials.'));
                            btn.disabled = false;
                            btn.innerHTML = originalHTML;
                        });
                }
            });
        }

        // Signup Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = signupForm.querySelector('[name="name"]');
                const email = signupForm.querySelector('[name="email"]');
                const password = signupForm.querySelector('[name="password"]');
                const confirmPassword = signupForm.querySelector('[name="confirmPassword"]');
                let valid = true;

                [name, email, password, confirmPassword].forEach(input => this.clearError(input));

                if (name.value.trim().length < 2) {
                    this.showError(name, 'Please enter your name');
                    valid = false;
                }

                if (!this.validateEmail(email.value)) {
                    this.showError(email, 'Please enter a valid email');
                    valid = false;
                }

                if (!this.validatePassword(password.value)) {
                    this.showError(password, 'Password must be at least 6 characters');
                    valid = false;
                }

                if (password.value !== confirmPassword.value) {
                    this.showError(confirmPassword, 'Passwords do not match');
                    valid = false;
                }

                if (valid) {
                    // Handle signup with API
                    const btn = signupForm.querySelector('button[type="submit"]');
                    const originalHTML = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

                    API.Auth.register({
                        name: name.value,
                        email: email.value,
                        password: password.value
                    })
                        .then(response => {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            
                            ModalManager.close('signupModal');
                            showSuccessMessage('🎉 Account created successfully! Welcome, ' + response.user.name + '!');
                            
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(error => {
                            showErrorMessage('❌ ' + (error.message || 'Signup failed. Please try again.'));
                            btn.disabled = false;
                            btn.innerHTML = originalHTML;
                        });
                }
            });
        }
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    ModalManager.init();
    NavbarManager.init();
    RevealManager.init();
    CounterManager.init();
    SmoothScrollManager.init();
    MobileMenuManager.init();
    TabsManager.init();
    FormManager.init();
    updateNavbar(); // Check if user is logged in
});

// Update navbar based on login status
async function updateNavbar() {
    const token = localStorage.getItem('token');
    const navActions = document.querySelector('.nav-actions');
    
    if (!navActions) return;
    
    if (token) {
        try {
            const response = await API.Auth.getMe();
            const user = response.data || response;
            localStorage.setItem('user', JSON.stringify(user));
            
            navActions.innerHTML = `
                <button class="theme-toggle" onclick="ThemeManager.toggle()">
                    <i class="fas fa-moon"></i>
                    <i class="fas fa-sun"></i>
                </button>
                <a href="dashboard.html" class="user-profile-link">
                    <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        <span class="user-points">${user.points || 0} pts</span>
                    </div>
                </a>
                <button class="btn btn-ghost btn-sm" onclick="logout()">Logout</button>
                <button class="mobile-menu-btn" onclick="MobileMenuManager.toggleMenu()">
                    <i class="fas fa-bars"></i>
                </button>
            `;
        } catch (e) {
            // Only logout if token is actually invalid (401), not on network errors
            if (e.message && e.message.includes('401')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                updateNavbar();
            } else {
                // Use cached user data if API fails
                const cachedUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (cachedUser) {
                    navActions.innerHTML = `
                        <button class="theme-toggle" onclick="ThemeManager.toggle()">
                            <i class="fas fa-moon"></i>
                            <i class="fas fa-sun"></i>
                        </button>
                        <a href="dashboard.html" class="user-profile-link">
                            <div class="user-avatar">${cachedUser.name.charAt(0).toUpperCase()}</div>
                            <div class="user-info">
                                <span class="user-name">${cachedUser.name}</span>
                                <span class="user-points">${cachedUser.points || 0} pts</span>
                            </div>
                        </a>
                        <button class="btn btn-ghost btn-sm" onclick="logout()">Logout</button>
                        <button class="mobile-menu-btn" onclick="MobileMenuManager.toggleMenu()">
                            <i class="fas fa-bars"></i>
                        </button>
                    `;
                }
            }
        }
    } else {
        navActions.innerHTML = `
            <button class="theme-toggle" onclick="ThemeManager.toggle()">
                <i class="fas fa-moon"></i>
                <i class="fas fa-sun"></i>
            </button>
            <button class="btn btn-ghost btn-sm" onclick="ModalManager.open('loginModal')">Log In</button>
            <button class="btn btn-primary btn-sm" onclick="ModalManager.open('signupModal')">Sign Up</button>
            <button class="mobile-menu-btn" onclick="MobileMenuManager.toggleMenu()">
                <i class="fas fa-bars"></i>
            </button>
        `;
    }
}

// Logout function with confirmation modal
function logout() {
    // Create custom confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal" style="max-width: 450px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);">
                <i class="fas fa-sign-out-alt" style="font-size: 2rem; color: white;"></i>
            </div>
            <h2 class="modal-title">Logout Confirmation</h2>
            <p class="modal-subtitle" style="font-size: 1rem; margin-bottom: 24px;">Are you sure you want to logout?</p>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-ghost" style="flex: 1;" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn btn-primary" style="flex: 1; background: linear-gradient(135deg, #ef4444, #dc2626);" id="confirmLogout">
                    <i class="fas fa-sign-out-alt"></i> Yes, Logout
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('#confirmLogout').onclick = () => {
        modal.remove();
        
        // Show loading
        showGlobalLoading('Logging out...');
        
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            hideGlobalLoading();
            showSuccessMessage('✅ Logged out successfully! See you soon!');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }, 500);
    };
}

// ============================================
// BIOMETRIC AUTHENTICATION FUNCTIONS
// ============================================

// Face Login
async function loginWithFace() {
    try {
        BiometricHelper.showCameraModal(async (faceImage, pin) => {
            // Show global loading
            showGlobalLoading('Recognizing your face...');
            
            try {
                const response = await API.Biometric.verifyFace(faceImage, pin);
                
                if (response.needsPin) {
                    hideGlobalLoading();
                    BiometricHelper.showPinModal(response.userName, async (enteredPin) => {
                        showGlobalLoading('Verifying PIN...');
                        try {
                            const verifyResponse = await API.Biometric.verifyFace(faceImage, enteredPin);
                            const { token, user } = verifyResponse.data;
                            
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            
                            hideGlobalLoading();
                            showSuccessMessage('✅ Welcome back, ' + user.name + '!');
                            setTimeout(() => window.location.href = 'dashboard.html', 1000);
                        } catch (error) {
                            hideGlobalLoading();
                            showErrorMessage('❌ ' + (error.message || 'Invalid PIN'));
                        }
                    });
                } else {
                    const { token, user } = response.data;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    hideGlobalLoading();
                    showSuccessMessage('✅ Welcome back, ' + user.name + '!');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                }
            } catch (error) {
                hideGlobalLoading();
                showErrorMessage('❌ Face not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        showErrorMessage('❌ Camera access required for face login');
    }
}

// Voice Login
async function loginWithVoice() {
    try {
        BiometricHelper.showMicModal(async (voiceAudio, pin) => {
            showGlobalLoading('Recognizing your voice...');
            
            try {
                const response = await API.Biometric.verifyVoice(voiceAudio, pin);
                
                if (response.needsPin) {
                    hideGlobalLoading();
                    BiometricHelper.showPinModal(response.userName, async (enteredPin) => {
                        showGlobalLoading('Verifying PIN...');
                        try {
                            const verifyResponse = await API.Biometric.verifyVoice(voiceAudio, enteredPin);
                            const { token, user } = verifyResponse.data;
                            
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            
                            hideGlobalLoading();
                            showSuccessMessage('✅ Welcome back, ' + user.name + '!');
                            setTimeout(() => window.location.href = 'dashboard.html', 1000);
                        } catch (error) {
                            hideGlobalLoading();
                            showErrorMessage('❌ ' + (error.message || 'Invalid PIN'));
                        }
                    });
                } else {
                    const { token, user } = response.data;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    hideGlobalLoading();
                    showSuccessMessage('✅ Welcome back, ' + user.name + '!');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                }
            } catch (error) {
                hideGlobalLoading();
                showErrorMessage('❌ Voice not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        showErrorMessage('❌ Microphone access required for voice login');
    }
}

// Enroll Face (call after user logs in)
async function enrollFace() {
    try {
        BiometricHelper.showCameraModal(async (faceImage, pin) => {
            showGlobalLoading('Enrolling your face...');
            
            try {
                await API.Biometric.enrollFace(faceImage, pin);
                hideGlobalLoading();
                showSuccessMessage('✅ Face enrolled successfully! You can now login with your face.');
            } catch (error) {
                hideGlobalLoading();
                showErrorMessage('❌ Failed to enroll face: ' + error.message);
            }
        }, true);
    } catch (error) {
        showErrorMessage('❌ Camera access required');
    }
}

// Enroll Voice (call after user logs in)
async function enrollVoice() {
    try {
        BiometricHelper.showMicModal(async (voiceAudio, pin) => {
            showGlobalLoading('Enrolling your voice...');
            
            try {
                await API.Biometric.enrollVoice(voiceAudio, pin);
                hideGlobalLoading();
                showSuccessMessage('✅ Voice enrolled successfully! You can now login with your voice.');
            } catch (error) {
                hideGlobalLoading();
                showErrorMessage('❌ Failed to enroll voice: ' + error.message);
            }
        }, true);
    } catch (error) {
        showErrorMessage('❌ Microphone access required');
    }
}

// Export for global access
window.ThemeManager = ThemeManager;
window.ModalManager = ModalManager;
window.loginWithFace = loginWithFace;
window.loginWithVoice = loginWithVoice;
window.enrollFace = enrollFace;
window.enrollVoice = enrollVoice;

// Global loading overlay
function showGlobalLoading(message = 'Loading...') {
    let overlay = document.getElementById('globalLoadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'globalLoadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;
        overlay.innerHTML = `
            <div style="text-align: center; padding: 40px; background: rgba(15, 15, 26, 0.95); border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.3); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <div style="width: 80px; height: 80px; border: 4px solid rgba(99, 102, 241, 0.2); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 24px; animation: spin 1s linear infinite;"></div>
                <p id="loadingMessage" style="color: white; font-size: 1.1rem; font-weight: 600; margin: 0;"></p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.querySelector('#loadingMessage').textContent = message;
    overlay.style.display = 'flex';
}

function hideGlobalLoading() {
    const overlay = document.getElementById('globalLoadingOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => overlay.style.display = 'none', 200);
    }
}

// Success/Error messages
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        z-index: 100000;
        padding: 18px 28px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        toast.style.color = 'white';
        toast.innerHTML = `<i class="fas fa-check-circle" style="font-size: 1.5rem;"></i><span>${message}</span>`;
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        toast.style.color = 'white';
        toast.innerHTML = `<i class="fas fa-exclamation-circle" style="font-size: 1.5rem;"></i><span>${message}</span>`;
    } else {
        toast.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
        toast.style.color = 'white';
        toast.innerHTML = `<i class="fas fa-info-circle" style="font-size: 1.5rem;"></i><span>${message}</span>`;
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(animationStyle);
