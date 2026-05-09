// API Configuration
const API_URL = window.CONFIG?.API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = '/index.html';
          }
        }
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
const AuthAPI = {
  register: async (userData) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getMe: async () => {
    return await apiCall('/auth/me');
  },

  getCurrentUser: async () => {
    const response = await apiCall('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }
};

// Questions API
const QuestionsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiCall(`/questions?${params}`);
  },

  getById: async (id) => {
    return await apiCall(`/questions/${id}`);
  },

  create: async (questionData) => {
    return await apiCall('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  },

  update: async (id, questionData) => {
    return await apiCall(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
  },

  delete: async (id) => {
    return await apiCall(`/questions/${id}`, {
      method: 'DELETE'
    });
  },

  submitAnswer: async (questionId, userAnswer) => {
    return await apiCall('/questions/submit', {
      method: 'POST',
      body: JSON.stringify({ questionId, userAnswer })
    });
  }
};

// Notes API
const NotesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiCall(`/notes?${params}`);
  },

  getById: async (id) => {
    return await apiCall(`/notes/${id}`);
  },

  create: async (noteData) => {
    return await apiCall('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  },

  update: async (id, noteData) => {
    return await apiCall(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData)
    });
  },

  delete: async (id) => {
    return await apiCall(`/notes/${id}`, {
      method: 'DELETE'
    });
  },

  trackDownload: async (id) => {
    return await apiCall(`/notes/${id}/download`, {
      method: 'POST'
    });
  }
};

// Videos API
const VideosAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiCall(`/videos?${params}`);
  },

  create: async (videoData) => {
    return await apiCall('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData)
    });
  },

  delete: async (id) => {
    return await apiCall(`/videos/${id}`, {
      method: 'DELETE'
    });
  }
};

// Users API
const UsersAPI = {
  getLeaderboard: async () => {
    return await apiCall('/users/leaderboard');
  },

  getProgress: async () => {
    return await apiCall('/users/progress');
  },

  getStats: async () => {
    return await apiCall('/users/stats');
  }
};

// Biometric API
const BiometricAPI = {
  enrollFace: async (faceImage, pin) => {
    return await apiCall('/biometric/enroll-face', {
      method: 'POST',
      body: JSON.stringify({ faceImage, pin })
    });
  },

  enrollVoice: async (voiceAudio, pin) => {
    return await apiCall('/biometric/enroll-voice', {
      method: 'POST',
      body: JSON.stringify({ voiceAudio, pin })
    });
  },

  verifyFace: async (faceImage, pin = null) => {
    return await apiCall('/biometric/verify-face', {
      method: 'POST',
      body: JSON.stringify({ faceImage, pin })
    });
  },

  verifyVoice: async (voiceAudio, pin = null) => {
    return await apiCall('/biometric/verify-voice', {
      method: 'POST',
      body: JSON.stringify({ voiceAudio, pin })
    });
  }
};

// Chatbot API
const ChatbotAPI = {
  sendMessage: async (message) => {
    return await apiCall('/chatbot/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};

// Export all APIs
window.API = {
  Auth: AuthAPI,
  Questions: QuestionsAPI,
  Notes: NotesAPI,
  Videos: VideosAPI,
  Users: UsersAPI,
  Biometric: BiometricAPI,
  Chatbot: ChatbotAPI
};
