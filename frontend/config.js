// Frontend Configuration
const CONFIG = {
  // Automatically detect API URL based on environment
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`,
  
  // Feature flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    CHATBOT: true,
    DARK_MODE: true
  },
  
  // App settings
  APP_NAME: 'CodeLinkers',
  VERSION: '1.0.0',
  
  // Pagination
  ITEMS_PER_PAGE: 12,
  
  // File upload limits (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Supported file types
  ALLOWED_FILE_TYPES: {
    NOTES: ['.pdf', '.doc', '.docx'],
    IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.FEATURES);
Object.freeze(CONFIG.ALLOWED_FILE_TYPES);

window.CONFIG = CONFIG;
