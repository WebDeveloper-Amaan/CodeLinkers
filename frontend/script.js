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
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                    API.Auth.login({ email: email.value, password: password.value })
                        .then(response => {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            alert('Login successful!');
                            ModalManager.close('loginModal');
                            window.location.reload();
                        })
                        .catch(error => {
                            alert(error.message || 'Login failed');
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
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
                            alert('Account created successfully!');
                            ModalManager.close('signupModal');
                            window.location.reload();
                        })
                        .catch(error => {
                            alert(error.message || 'Signup failed');
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fas fa-rocket"></i> Create Account';
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

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    }
}

// ============================================
// BIOMETRIC AUTHENTICATION FUNCTIONS
// ============================================

// Face Login
async function loginWithFace() {
    try {
        BiometricHelper.showCameraModal(async (faceImage) => {
            try {
                const response = await API.Biometric.verifyFace(faceImage);
                
                if (response.needsPin) {
                    BiometricHelper.showPinModal(response.userName, async (pin) => {
                        try {
                            const verifyResponse = await API.Biometric.verifyFace(faceImage, pin);
                            const { token, user } = verifyResponse.data;
                            
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            
                            alert('✅ Welcome back, ' + user.name + '!');
                            window.location.href = 'dashboard.html';
                        } catch (error) {
                            alert('❌ ' + (error.message || 'Invalid PIN'));
                        }
                    });
                } else {
                    const { token, user } = response.data;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    alert('✅ Welcome back, ' + user.name + '!');
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('❌ Face not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        alert('❌ Camera access required for face login');
    }
}

// Voice Login
async function loginWithVoice() {
    try {
        BiometricHelper.showMicModal(async (voiceAudio) => {
            try {
                const response = await API.Biometric.verifyVoice(voiceAudio);
                
                if (response.needsPin) {
                    BiometricHelper.showPinModal(response.userName, async (pin) => {
                        try {
                            const verifyResponse = await API.Biometric.verifyVoice(voiceAudio, pin);
                            const { token, user } = verifyResponse.data;
                            
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            
                            alert('✅ Welcome back, ' + user.name + '!');
                            window.location.href = 'dashboard.html';
                        } catch (error) {
                            alert('❌ ' + (error.message || 'Invalid PIN'));
                        }
                    });
                } else {
                    const { token, user } = response.data;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    alert('✅ Welcome back, ' + user.name + '!');
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('❌ Voice not recognized. Please try again or use password.');
            }
        });
    } catch (error) {
        alert('❌ Microphone access required for voice login');
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

// Export for global access
window.ThemeManager = ThemeManager;
window.ModalManager = ModalManager;
window.loginWithFace = loginWithFace;
window.loginWithVoice = loginWithVoice;
window.enrollFace = enrollFace;
window.enrollVoice = enrollVoice;
