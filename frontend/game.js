// ============================================
// Game State Management
// ============================================
const GameState = {
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    topic: 'css',
    difficulty: 'beginner',
    totalPoints: 0,
    streak: 0,
    completedQuestions: new Set(),
    hintUsed: false,
    timerInterval: null,
    elapsedSeconds: 0,
    questionStartTime: 0,
    attempts: 0,
    correctAnswers: 0,
    initialHtmlCode: '',
    initialCssCode: ''
};

// ============================================
// Game Initialization
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    GameState.topic = urlParams.get('topic') || 'css';
    GameState.difficulty = urlParams.get('level') || 'beginner';

    document.getElementById('levelDisplay').textContent = 
        GameState.difficulty.charAt(0).toUpperCase() + GameState.difficulty.slice(1);

    await GameLogic.loadQuestions();
    await GameLogic.loadUserData();
    GameUI.setupEventListeners();
    GameLogic.startTimer();
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 500);
});

// ============================================
// Game Logic
// ============================================
const GameLogic = {
    async loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Guest mode
            const guestAttempts = parseInt(localStorage.getItem('guestAttempts') || '0');
            document.getElementById('totalPoints').textContent = `${3 - guestAttempts} free`;
            return;
        }

        try {
            const userData = await API.Auth.getCurrentUser();
            GameState.totalPoints = userData.points || 0;
            document.getElementById('totalPoints').textContent = GameState.totalPoints;
            
            if (userData.progress && Array.isArray(userData.progress)) {
                userData.progress.forEach(p => {
                    if (p.completed) {
                        const qIndex = GameState.questions.findIndex(q => q._id === p.questionId);
                        if (qIndex !== -1) {
                            GameState.completedQuestions.add(qIndex);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },

    async loadQuestions() {
        try {
            const response = await API.Questions.getAll();
            const allQuestions = response.data || response;
            
            GameState.questions = allQuestions.filter(q => 
                q.topic.toLowerCase() === GameState.topic.toLowerCase() && 
                q.difficulty.toLowerCase() === GameState.difficulty.toLowerCase() &&
                q.status === 'active'
            );
            
            if (GameState.questions.length === 0) {
                GameUI.showToast('No questions available for this level!', 'error');
                setTimeout(() => window.location.href = 'games.html', 2000);
                return;
            }
            
            this.loadQuestion(0);
        } catch (error) {
            console.error('Error loading questions:', error);
            GameUI.showToast('Failed to load questions', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
        }
    },

    loadQuestion(index) {
        if (index < 0 || index >= GameState.questions.length) return;

        // Check if question is locked
        if (index > 0) {
            const prevCompleted = GameState.completedQuestions.has(index - 1);
            if (!prevCompleted) {
                GameUI.showToast('Complete previous level first!', 'warning');
                return;
            }
        }

        GameState.currentIndex = index;
        GameState.currentQuestion = GameState.questions[index];
        GameState.hintUsed = false;
        GameState.questionStartTime = Date.now();

        const q = GameState.currentQuestion;

        document.getElementById('questionTitle').textContent = q.title;
        document.getElementById('questionDescription').textContent = q.description;
        document.getElementById('pointsDisplay').textContent = `+${q.points} pts`;
        document.getElementById('questionNumber').textContent = 
            `Question ${index + 1} of ${GameState.questions.length}`;
        document.getElementById('currentLevel').textContent = index + 1;
        document.getElementById('totalLevels').textContent = GameState.questions.length;

        const diffBadge = document.getElementById('difficultyBadge');
        diffBadge.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
        diffBadge.className = 'badge badge-' + q.difficulty.toLowerCase();

        const topicBadge = document.getElementById('topicBadge');
        topicBadge.textContent = q.topic.toUpperCase();
        topicBadge.className = 'badge badge-' + q.topic.toLowerCase();

        GameUI.updateProgressBar();

        document.getElementById('hintContent').classList.remove('visible');
        document.getElementById('hintText').textContent = q.hints?.[0] || 'No hint available.';

        if (GameState.topic.toLowerCase() === 'html') {
            GameState.initialHtmlCode = q.initialHTML || `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Challenge</title>
</head>
<body>
    <!-- Write your HTML code here -->
    
</body>
</html>`;
            GameState.initialCssCode = '/* Optional CSS styling */';
            document.getElementById('htmlEditor').value = GameState.initialHtmlCode;
            document.getElementById('cssEditor').value = GameState.initialCssCode;
        } else if (GameState.difficulty.toLowerCase() === 'medium' && q.charCount) {
            // CSS Medium - Flexbox/Grid with character boxes
            const count = q.charCount || 3;
            const theme = q.charTheme || 'wizard';
            const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚' };
            const mixedThemes = ['wizard', 'dragon', 'elf', 'knight', 'fairy'];
            
            let boxesHTML = '';
            for (let i = 0; i < count; i++) {
                const currentTheme = theme === 'mixed' ? mixedThemes[i % mixedThemes.length] : theme;
                boxesHTML += `  <div class="box box-${i + 1}">${themes[currentTheme] || '🧙'}</div>\n`;
            }
            
            GameState.initialHtmlCode = `<div class="flex-container">\n${boxesHTML}</div>`;
            GameState.initialCssCode = q.initialCSS || `.flex-container {\n  /* Write your CSS here */\n  \n}\n\n.box {\n  width: ${q.boxSize || 50}px;\n  height: ${q.boxSize || 50}px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  border-radius: 8px;\n  background: linear-gradient(135deg, #6366f1, #8b5cf6);\n}`;
            document.getElementById('cssEditor').value = GameState.initialCssCode;
            document.getElementById('htmlEditor').value = GameState.initialHtmlCode;
        } else {
            GameState.initialHtmlCode = q.initialHTML || '<div class="container">\n  <div class="box">Content</div>\n</div>';
            GameState.initialCssCode = '/* Write your CSS here */';
            document.getElementById('cssEditor').value = GameState.initialCssCode;
            document.getElementById('htmlEditor').value = GameState.initialHtmlCode;
        }

        GameUI.updateLineNumbers();
        GameUI.refreshPreview();
        GameUI.showExpectedOutput();
        
        if (GameState.topic.toLowerCase() === 'html') {
            GameUI.switchEditorTab('html');
        } else {
            GameUI.switchEditorTab('css');
        }
    },

    async submitAnswer() {
        if (!GameState.currentQuestion) return;

        const userAnswer = GameState.topic.toLowerCase() === 'html' 
            ? document.getElementById('htmlEditor').value
            : document.getElementById('cssEditor').value;

        if (!userAnswer.trim()) {
            GameUI.showToast('Please write some code!', 'warning');
            return;
        }

        const token = localStorage.getItem('token');
        const guestAttempts = parseInt(localStorage.getItem('guestAttempts') || '0');

        // Guest mode: Allow 3 free attempts
        if (!token) {
            if (guestAttempts >= 3) {
                GameUI.showLoginPrompt();
                return;
            }
            
            // Client-side validation for guests
            const isCorrect = this.validateAnswerLocally(userAnswer);
            
            if (isCorrect) {
                localStorage.setItem('guestAttempts', (guestAttempts + 1).toString());
                GameState.completedQuestions.add(GameState.currentIndex);
                GameState.correctAnswers++;
                GameUI.updateProgressBar();
                GameUI.showSuccessResult(0, 0);
                GameUI.createConfetti();
                
                if (guestAttempts + 1 >= 3) {
                    setTimeout(() => GameUI.showLoginPrompt(), 2000);
                }
            } else {
                this.handleWrongAnswer('Not quite right. Try again!', GameState.currentQuestion.hints?.[0]);
            }
            return;
        }

        // Logged-in user: Normal flow
        GameState.attempts++;

        try {
            const result = await API.Questions.submitAnswer(
                GameState.currentQuestion._id, 
                userAnswer
            );

            if (result.correct) {
                if (result.alreadyCompleted) {
                    GameUI.showToast('Already completed! Try another question.', 'info');
                    setTimeout(() => this.nextChallenge(), 1500);
                } else {
                    this.handleCorrectAnswer(result.points);
                }
            } else {
                this.handleWrongAnswer(result.message, result.hint);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            
            // If unauthorized, clear token and redirect to login
            if (error.message && error.message.includes('Not authorized')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                GameUI.showToast('Session expired. Please login again.', 'error');
                setTimeout(() => window.location.href = 'index.html', 2000);
            } else {
                GameUI.showToast('Error submitting answer', 'error');
            }
        }
    },

    validateAnswerLocally(userAnswer) {
        const q = GameState.currentQuestion;
        if (q.topic === 'html' && q.expectedHTML) {
            return userAnswer.toLowerCase().includes(q.expectedHTML.toLowerCase().match(/<[^>]+>/)?.[0] || 'xxx');
        } else if (q.topic === 'css' && q.expectedCSS) {
            return userAnswer.toLowerCase().replace(/\s/g, '').includes(q.expectedCSS.toLowerCase().replace(/\s/g, '').substring(0, 20));
        }
        return false;
    },

    handleCorrectAnswer(points) {
        GameState.totalPoints += points;
        GameState.streak++;
        GameState.completedQuestions.add(GameState.currentIndex);
        GameState.correctAnswers++;

        document.getElementById('totalPoints').textContent = GameState.totalPoints;
        document.getElementById('currentStreak').textContent = GameState.streak;
        GameUI.updateProgressBar();

        const timeTaken = (Date.now() - GameState.questionStartTime) / 1000;
        GameUI.showSuccessResult(points, timeTaken);
        GameUI.createConfetti();
    },

    handleWrongAnswer(message, hint) {
        GameState.streak = 0;
        document.getElementById('currentStreak').textContent = 0;
        
        let feedbackMsg = message || 'Not quite right. Try again!';
        if (hint) {
            feedbackMsg += '\n\nHint: ' + hint;
        }
        
        GameUI.showErrorResult(feedbackMsg);
        
        // Auto-show hint after wrong answer
        if (hint && !GameState.hintUsed) {
            setTimeout(() => {
                document.getElementById('hintContent').classList.add('visible');
                GameState.hintUsed = true;
            }, 2000);
        }
    },

    nextChallenge() {
        GameUI.closeResult();
        
        if (GameState.currentIndex < GameState.questions.length - 1) {
            this.loadQuestion(GameState.currentIndex + 1);
        } else {
            GameUI.showToast('All levels completed!', 'success');
            setTimeout(() => window.location.href = 'games.html', 2000);
        }
    },

    toggleHint() {
        const content = document.getElementById('hintContent');
        const isVisible = content.classList.contains('visible');

        if (!isVisible && !GameState.hintUsed) {
            GameState.hintUsed = true;
            GameUI.showToast('Hint revealed!', 'info');
        }

        content.classList.toggle('visible');
    },

    startTimer() {
        GameState.timerInterval = setInterval(() => {
            GameState.elapsedSeconds++;
            const mins = Math.floor(GameState.elapsedSeconds / 60);
            const secs = GameState.elapsedSeconds % 60;
            document.getElementById('timerDisplay').textContent = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
};

// ============================================
// UI Management
// ============================================
const GameUI = {
    switchEditorTab(tab) {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.editor-tab').forEach(t => {
            if (t.textContent.toLowerCase().includes(tab)) t.classList.add('active');
        });

        document.getElementById('cssEditorWrapper').style.display = tab === 'css' ? 'block' : 'none';
        document.getElementById('htmlEditorWrapper').style.display = tab === 'html' ? 'block' : 'none';
    },

    runCode() {
        this.refreshPreview();
        this.showToast('Code executed!', 'info');
    },

    refreshPreview() {
        const css = document.getElementById('cssEditor').value;
        const html = document.getElementById('htmlEditor').value;

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Inter', Arial, sans-serif; 
                        padding: 24px;
                        min-height: 100vh;
                        background: #f8fafc;
                    }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        document.getElementById('previewFrame').srcdoc = content;
    },

    showExpectedOutput() {
        const q = GameState.currentQuestion;
        if (!q) return;

        const expectedCSS = q.expectedCSS || '';
        const expectedHTML = q.expectedHTML || q.initialHTML || '';

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Inter', Arial, sans-serif; 
                        padding: 24px;
                        min-height: 100vh;
                        background: #f8fafc;
                    }
                    ${expectedCSS}
                </style>
            </head>
            <body>
                ${expectedHTML}
            </body>
            </html>
        `;

        document.getElementById('expectedFrame').srcdoc = content;
    },

    resetCode() {
        if (GameState.currentQuestion) {
            document.getElementById('cssEditor').value = GameState.initialCssCode;
            document.getElementById('htmlEditor').value = GameState.initialHtmlCode;
            this.updateLineNumbers();
            this.refreshPreview();
            this.showToast('Code reset', 'info');
        }
    },

    updateLineNumbers() {
        const cssEditor = document.getElementById('cssEditor');
        const cssLines = cssEditor.value.split('\n').length;
        document.getElementById('cssLineNumbers').innerHTML = 
            Array.from({ length: cssLines }, (_, i) => i + 1).join('<br>');

        const htmlEditor = document.getElementById('htmlEditor');
        const htmlLines = htmlEditor.value.split('\n').length;
        document.getElementById('htmlLineNumbers').innerHTML = 
            Array.from({ length: htmlLines }, (_, i) => i + 1).join('<br>');
    },

    validateHTML(editor) {
        const code = editor.value;
        const tagStack = [];
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
        const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        
        let match;
        let hasError = false;
        
        while ((match = tagRegex.exec(code)) !== null) {
            const fullTag = match[0];
            const tagName = match[1];
            
            if (fullTag.startsWith('<!--')) continue;
            
            if (fullTag.startsWith('</')) {
                if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
                    hasError = true;
                    break;
                }
                tagStack.pop();
            } else if (!selfClosing.includes(tagName?.toLowerCase())) {
                tagStack.push(tagName);
            }
        }
        
        if (tagStack.length > 0) hasError = true;
        
        editor.style.borderColor = hasError ? 'rgba(239, 68, 68, 0.5)' : '';
    },

    updateProgressBar() {
        const completed = GameState.completedQuestions.size;
        const total = GameState.questions.length;
        const percent = Math.round((completed / total) * 100);

        document.getElementById('progressBar').style.width = `${percent}%`;
        document.getElementById('progressText').textContent = `${completed} completed`;
        document.getElementById('progressPercent').textContent = `${percent}%`;
    },

    showSuccessResult(points, timeTaken) {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const message = document.getElementById('resultMessage');
        const token = localStorage.getItem('token');

        icon.className = 'result-icon success';
        icon.innerHTML = '<i class="fas fa-check"></i>';
        
        const titles = ['Excellent!', 'Amazing!', 'Perfect!', 'Brilliant!'];
        title.textContent = titles[Math.floor(Math.random() * titles.length)];
        message.textContent = token ? 'You solved the challenge correctly!' : 'Correct! Sign up to save your progress!';

        if (token) {
            document.getElementById('earnedPoints').textContent = `+${points}`;
            document.getElementById('streakCount').textContent = GameState.streak;
            document.getElementById('resultStats').style.display = 'flex';
        } else {
            document.getElementById('resultStats').style.display = 'none';
        }

        modal.classList.add('active');
    },

    showLoginPrompt() {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const message = document.getElementById('resultMessage');

        icon.className = 'result-icon';
        icon.innerHTML = '<i class="fas fa-lock"></i>';
        title.textContent = 'Free Trial Complete!';
        message.innerHTML = 'You\'ve tried 3 questions! Sign up to:<br>✓ Save your progress<br>✓ Earn points<br>✓ Unlock all challenges';
        document.getElementById('resultStats').style.display = 'none';

        const actions = modal.querySelector('.result-actions');
        actions.innerHTML = `
            <button class="btn btn-primary" onclick="window.location.href='index.html'">
                Sign Up Free <i class="fas fa-arrow-right"></i>
            </button>
        `;

        modal.classList.add('active');
    },

    showErrorResult(feedback) {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const message = document.getElementById('resultMessage');

        icon.className = 'result-icon error';
        icon.innerHTML = '<i class="fas fa-times"></i>';
        title.textContent = 'Not Quite!';
        message.textContent = feedback;
        document.getElementById('resultStats').style.display = 'none';

        modal.classList.add('active');
    },

    closeResult() {
        document.getElementById('resultModal').classList.remove('active');
    },

    toggleShortcuts() {
        document.getElementById('shortcutsModal').classList.toggle('active');
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    createConfetti() {
        const container = document.getElementById('confettiContainer');
        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 8 + 6) + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }

        setTimeout(() => container.innerHTML = '', 4000);
    },

    setupEventListeners() {
        const cssEditor = document.getElementById('cssEditor');
        const htmlEditor = document.getElementById('htmlEditor');
        
        // Instant live preview for CSS (no debounce)
        cssEditor.addEventListener('input', () => {
            this.updateLineNumbers();
            this.refreshPreview();
        });

        // Instant live preview for HTML with validation
        htmlEditor.addEventListener('input', () => {
            this.updateLineNumbers();
            this.validateHTML(htmlEditor);
            this.refreshPreview();
        });

        // Tab key support for CSS
        cssEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = cssEditor.selectionStart;
                const end = cssEditor.selectionEnd;
                cssEditor.value = cssEditor.value.substring(0, start) + '  ' + cssEditor.value.substring(end);
                cssEditor.selectionStart = cssEditor.selectionEnd = start + 2;
                this.updateLineNumbers();
            }
        });

        // Enhanced HTML editor with auto-closing tags
        htmlEditor.addEventListener('keydown', (e) => {
            const start = htmlEditor.selectionStart;
            const end = htmlEditor.selectionEnd;
            const value = htmlEditor.value;

            // Tab key
            if (e.key === 'Tab') {
                e.preventDefault();
                htmlEditor.value = value.substring(0, start) + '  ' + value.substring(end);
                htmlEditor.selectionStart = htmlEditor.selectionEnd = start + 2;
                this.updateLineNumbers();
                return;
            }

            // Auto-close tags when typing >
            if (e.key === '>') {
                const beforeCursor = value.substring(0, start);
                const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?$/);
                
                if (tagMatch) {
                    const tagName = tagMatch[1].toLowerCase();
                    const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
                    
                    if (!selfClosing.includes(tagName)) {
                        e.preventDefault();
                        const closeTag = `</${tagName}>`;
                        htmlEditor.value = value.substring(0, start) + '>' + closeTag + value.substring(end);
                        htmlEditor.selectionStart = htmlEditor.selectionEnd = start + 1;
                        this.updateLineNumbers();
                        this.refreshPreview();
                    }
                }
            }

            // Auto-close brackets and quotes
            const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
            if (pairs[e.key]) {
                e.preventDefault();
                htmlEditor.value = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
                htmlEditor.selectionStart = htmlEditor.selectionEnd = start + 1;
                this.updateLineNumbers();
            }

            // Enter key - auto-indent
            if (e.key === 'Enter') {
                const currentLine = value.substring(0, start).split('\n').pop();
                const indent = currentLine.match(/^\s*/)[0];
                const openTag = currentLine.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>\s*$/);
                
                if (openTag) {
                    e.preventDefault();
                    htmlEditor.value = value.substring(0, start) + '\n' + indent + '  \n' + indent + value.substring(end);
                    htmlEditor.selectionStart = htmlEditor.selectionEnd = start + indent.length + 3;
                    this.updateLineNumbers();
                } else {
                    e.preventDefault();
                    htmlEditor.value = value.substring(0, start) + '\n' + indent + value.substring(end);
                    htmlEditor.selectionStart = htmlEditor.selectionEnd = start + indent.length + 1;
                    this.updateLineNumbers();
                }
            }
        });

        // Scroll sync for CSS line numbers
        cssEditor.addEventListener('scroll', () => {
            document.getElementById('cssLineNumbers').style.transform = 
                `translateY(-${cssEditor.scrollTop}px)`;
        });

        // Scroll sync for HTML line numbers
        htmlEditor.addEventListener('scroll', () => {
            document.getElementById('htmlLineNumbers').style.transform = 
                `translateY(-${htmlEditor.scrollTop}px)`;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.runCode();
                        break;
                    case 's':
                        e.preventDefault();
                        GameLogic.submitAnswer();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetCode();
                        break;
                    case 'h':
                        e.preventDefault();
                        GameLogic.toggleHint();
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.closeResult();
                document.getElementById('shortcutsModal').classList.remove('active');
            }
        });
    }
};
