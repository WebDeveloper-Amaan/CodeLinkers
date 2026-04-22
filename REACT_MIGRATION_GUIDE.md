# React Migration Guide - CodeLinkers

## 🎯 Migration Strategy: HTML/CSS/JS → React + Vite

---

## 📁 New Project Structure

```
PROgame/
├── backend/                    # Keep as-is (Node.js + Express + MongoDB)
│   ├── src/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── client/                     # NEW React + Vite frontend
    ├── public/
    │   └── assets/
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   └── Toast.jsx
    │   │   ├── game/
    │   │   │   ├── GameCard.jsx
    │   │   │   ├── CodeEditor.jsx
    │   │   │   └── PreviewPanel.jsx
    │   │   └── admin/
    │   │       ├── QuestionForm.jsx
    │   │       └── AdminSidebar.jsx
    │   │
    │   ├── pages/              # Page components (routes)
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Games.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Leaderboard.jsx
    │   │   ├── PlayGame.jsx
    │   │   ├── FlexboxGame.jsx
    │   │   └── Admin.jsx
    │   │
    │   ├── services/           # API calls
    │   │   └── api.js
    │   │
    │   ├── context/            # State management
    │   │   └── AuthContext.jsx
    │   │
    │   ├── hooks/              # Custom hooks
    │   │   ├── useAuth.js
    │   │   └── useGame.js
    │   │
    │   ├── utils/              # Helper functions
    │   │   └── helpers.js
    │   │
    │   ├── styles/             # CSS files
    │   │   ├── index.css
    │   │   └── game.css
    │   │
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # Entry point
    │   └── router.jsx          # Routes configuration
    │
    ├── .env                    # Frontend env variables
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Step 1: Setup React + Vite

### Create Vite Project

```bash
# In PROgame directory
npm create vite@latest client -- --template react
cd client
npm install
```

### Install Dependencies

```bash
# Core dependencies
npm install react-router-dom axios

# UI Libraries (optional but recommended)
npm install @headlessui/react @heroicons/react

# State management (if needed later)
npm install zustand
# OR
npm install @tanstack/react-query

# Code editor component
npm install @monaco-editor/react
# OR
npm install react-codemirror2 codemirror
```

### Configure Vite

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔄 Step 2: Migration Mapping

### Current Files → React Components

| Current HTML File | React Component | Route |
|------------------|-----------------|-------|
| `index.html` | `pages/Home.jsx` | `/` |
| `login.html` | `pages/Login.jsx` | `/login` |
| `register.html` | `pages/Register.jsx` | `/register` |
| `games.html` | `pages/Games.jsx` | `/games` |
| `dashboard.html` | `pages/Dashboard.jsx` | `/dashboard` |
| `leaderboard.html` | `pages/Leaderboard.jsx` | `/leaderboard` |
| `play.html` | `pages/PlayGame.jsx` | `/play/:id` |
| `flexbox&grid-adventure.html` | `pages/FlexboxGame.jsx` | `/flexbox-game` |
| `admin.html` | `pages/Admin.jsx` | `/admin` |
| `add-flexgrid-question.html` | `pages/AddQuestion.jsx` | `/admin/add-question` |

### Current JS Files → React Services/Hooks

| Current JS File | React Equivalent |
|----------------|------------------|
| `api.js` | `services/api.js` (keep similar) |
| `script.js` | Split into components + hooks |
| `flexbox-grid-db.js` | `hooks/useGame.js` + `pages/FlexboxGame.jsx` |

---

## 📝 Step 3: Code Conversion Examples

### Example 1: API Service (Keep Similar)

**client/src/services/api.js**
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const API = {
  Auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me')
  },
  Questions: {
    getAll: () => api.get('/questions'),
    getById: (id) => api.get(`/questions/${id}`),
    create: (data) => api.post('/questions', data),
    submitAnswer: (id, answer) => api.post('/questions/submit', { questionId: id, userAnswer: answer })
  },
  Users: {
    getLeaderboard: () => api.get('/users/leaderboard'),
    getStats: () => api.get('/users/stats')
  }
};

export default api;
```

---

### Example 2: Auth Context (State Management)

**client/src/context/AuthContext.jsx**
```javascript
import { createContext, useState, useEffect } from 'react';
import { API } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await API.Auth.getCurrentUser();
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await API.Auth.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**client/src/hooks/useAuth.js**
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);
```

---

### Example 3: Router Setup

**client/src/router.jsx**
```javascript
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Games from './pages/Games';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import PlayGame from './pages/PlayGame';
import FlexboxGame from './pages/FlexboxGame';
import Admin from './pages/Admin';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/games', element: <Games /> },
  { path: '/leaderboard', element: <Leaderboard /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/play/:id',
    element: <ProtectedRoute><PlayGame /></ProtectedRoute>
  },
  {
    path: '/flexbox-game',
    element: <ProtectedRoute><FlexboxGame /></ProtectedRoute>
  },
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin><Admin /></ProtectedRoute>
  }
]);
```

**client/src/App.jsx**
```javascript
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
```

**client/src/main.jsx**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### Example 4: Protected Route Component

**client/src/components/common/ProtectedRoute.jsx**
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
```

---

### Example 5: Convert Login Page

**Current: login.html (vanilla JS)**
```html
<form id="loginForm">
  <input type="email" id="email">
  <input type="password" id="password">
  <button type="submit">Login</button>
</form>

<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // API call...
});
</script>
```

**React: pages/Login.jsx**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
```

---

### Example 6: Convert Games Page

**React: pages/Games.jsx**
```javascript
import { useState, useEffect } from 'react';
import { API } from '../services/api';
import GameCard from '../components/game/GameCard';

const Games = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await API.Questions.getAll();
      setQuestions(res.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedQuestions = {
    htmlBasic: questions.filter(q => q.topic === 'html' && q.difficulty === 'easy'),
    cssBasic: questions.filter(q => q.topic === 'css' && q.difficulty === 'easy'),
    cssMedium: questions.filter(q => q.topic === 'css' && q.difficulty === 'medium')
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="games-container">
      <h1>Choose Your Challenge</h1>
      <div className="game-grid">
        <GameCard
          title="HTML Basics"
          count={groupedQuestions.htmlBasic.length}
          route="/play/html-basic"
        />
        <GameCard
          title="CSS Basics"
          count={groupedQuestions.cssBasic.length}
          route="/play/css-basic"
        />
        <GameCard
          title="Flexbox & Grid"
          count={groupedQuestions.cssMedium.length}
          route="/flexbox-game"
        />
      </div>
    </div>
  );
};

export default Games;
```

**components/game/GameCard.jsx**
```javascript
import { Link } from 'react-router-dom';

const GameCard = ({ title, count, route }) => (
  <Link to={route} className="game-card">
    <h3>{title}</h3>
    <p>{count} Challenges</p>
  </Link>
);

export default GameCard;
```

---

### Example 7: Convert Flexbox Game (Complex)

**React: pages/FlexboxGame.jsx**
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import CodeEditor from '../components/game/CodeEditor';
import PreviewPanel from '../components/game/PreviewPanel';

const FlexboxGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cssCode, setCssCode] = useState('.flex-container {\n  /* Write CSS */\n}');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await API.Questions.getAll();
      const filtered = res.data.filter(
        q => q.topic === 'css' && q.difficulty === 'medium' && q.status === 'active'
      );
      setQuestions(filtered);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    try {
      const res = await API.Questions.submitAnswer(currentQuestion._id, cssCode);
      if (res.data.correct) {
        alert('Correct! +' + currentQuestion.points + ' XP');
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Try again!');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="flexbox-game">
      <div className="game-header">
        <h2>{currentQuestion.title}</h2>
        <p>{currentQuestion.description}</p>
      </div>

      <div className="game-layout">
        <CodeEditor value={cssCode} onChange={setCssCode} />
        <PreviewPanel
          question={currentQuestion}
          cssCode={cssCode}
        />
      </div>

      <button onClick={handleSubmit}>Submit Solution</button>
    </div>
  );
};

export default FlexboxGame;
```

**components/game/CodeEditor.jsx**
```javascript
import { useState } from 'react';

const CodeEditor = ({ value, onChange }) => {
  const lines = value.split('\n').length;

  return (
    <div className="code-editor">
      <div className="line-numbers">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
```

**components/game/PreviewPanel.jsx**
```javascript
import { useEffect, useRef } from 'react';

const PreviewPanel = ({ question, cssCode }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    applyStyles();
  }, [cssCode]);

  const applyStyles = () => {
    if (!containerRef.current) return;
    
    const match = cssCode.match(/\.flex-container\s*\{([^}]*)\}/s);
    if (match && match[1]) {
      const props = match[1].split(';').filter(p => p.trim());
      props.forEach(prop => {
        const [name, value] = prop.split(':').map(s => s.trim());
        if (name && value) {
          containerRef.current.style[name.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
        }
      });
    }
  };

  const renderBoxes = () => {
    const count = question.charCount || 3;
    const theme = question.charTheme || 'wizard';
    const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚' };
    
    return Array.from({ length: count }, (_, i) => (
      <div key={i} className="character" style={{ width: question.boxSize, height: question.boxSize }}>
        {themes[theme]}
        <span>Box {i + 1}</span>
      </div>
    ));
  };

  return (
    <div ref={containerRef} className="preview-container">
      {renderBoxes()}
    </div>
  );
};

export default PreviewPanel;
```

---

## 🎨 Step 4: Styling Migration

### Option 1: Keep Current CSS
- Copy `styles.css` to `client/src/styles/`
- Import in components: `import '../styles/styles.css'`

### Option 2: Use Tailwind CSS (Recommended)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: []
}
```

### Option 3: CSS Modules
```javascript
// Component.module.css
.button { background: blue; }

// Component.jsx
import styles from './Component.module.css';
<button className={styles.button}>Click</button>
```

---

## 🔧 Step 5: Backend Updates

### Update CORS (backend/server.js)
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));
```

### Remove Static File Serving (optional)
```javascript
// Remove or comment out:
// app.use(express.static(path.join(__dirname, '../frontend')));
```

---

## 🚀 Step 6: Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 📦 Step 7: Production Build

### Build React App
```bash
cd client
npm run build
```

### Serve from Backend
**backend/server.js**
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

---

## 🎯 Migration Checklist

### Phase 1: Setup (Day 1)
- [ ] Create Vite project
- [ ] Install dependencies
- [ ] Setup router
- [ ] Create AuthContext
- [ ] Copy API service

### Phase 2: Core Pages (Day 2-3)
- [ ] Login page
- [ ] Register page
- [ ] Home page
- [ ] Games page
- [ ] Dashboard page

### Phase 3: Game Pages (Day 4-5)
- [ ] PlayGame component
- [ ] FlexboxGame component
- [ ] CodeEditor component
- [ ] PreviewPanel component

### Phase 4: Admin (Day 6)
- [ ] Admin dashboard
- [ ] Question form
- [ ] File uploads

### Phase 5: Polish (Day 7)
- [ ] Leaderboard
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Testing

---

## 💡 Pro Tips

### 1. Use React DevTools
Install browser extension for debugging

### 2. Component Organization
```javascript
// Bad
function MyComponent() {
  // 500 lines of code
}

// Good
function MyComponent() {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
```

### 3. Custom Hooks for Logic Reuse
```javascript
// hooks/useQuestions.js
export const useQuestions = (topic, difficulty) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [topic, difficulty]);

  const loadQuestions = async () => {
    // API call
  };

  return { questions, loading };
};

// Usage in component
const { questions, loading } = useQuestions('css', 'medium');
```

### 4. Environment Variables
```javascript
// Use import.meta.env in Vite (not process.env)
const API_URL = import.meta.env.VITE_API_URL;
```

### 5. Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const Admin = lazy(() => import('./pages/Admin'));

<Suspense fallback={<Loading />}>
  <Admin />
</Suspense>
```

---

## 🔄 Next.js Migration (Future)

When ready for Next.js:
1. Better SEO
2. Server-side rendering
3. API routes (can replace Express)
4. File-based routing
5. Image optimization

**Quick Next.js Setup:**
```bash
npx create-next-app@latest client-nextjs
# Choose: App Router, TypeScript (optional), Tailwind
```

---

## 📚 Learning Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **Axios**: https://axios-http.com

---

## 🆘 Common Issues & Solutions

### Issue: CORS errors
**Solution**: Check backend CORS config and proxy in vite.config.js

### Issue: Token not sent
**Solution**: Check axios interceptor in api.js

### Issue: Routes not working
**Solution**: Use `<Link>` from react-router-dom, not `<a>`

### Issue: State not updating
**Solution**: Use setState function, don't mutate state directly

---

## 🎉 You're Ready!

Start with Phase 1, take it step by step. The backend stays the same, you're just rebuilding the frontend with React!

Good luck! 🚀
