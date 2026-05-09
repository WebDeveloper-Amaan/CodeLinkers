// Database-integrated Flexbox & Grid Game - IMPROVED
const Game = {
    currentLevelIndex: 0,
    currentLevel: null,
    dbQuestions: [],
    user: null,
    completedQuestions: new Set()
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();
    await loadQuestionsFromDB();
    setupEventListeners();
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 800);
});

// Load user data from backend
async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to play!');
        window.location.href = 'games.html';
        return;
    }
    
    try {
        const response = await API.Auth.getCurrentUser();
        Game.user = response.data || response;
        
        // Load completed questions from user progress
        if (Game.user.progress && Array.isArray(Game.user.progress)) {
            Game.user.progress.forEach(p => {
                if (p.completed) {
                    Game.completedQuestions.add(p.questionId.toString());
                }
            });
        }
        
        updateStats();
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Load questions from database
async function loadQuestionsFromDB() {
    try {
        const response = await API.Questions.getAll();
        const allQuestions = response.data || response;
        
        // Filter CSS Medium questions only
        Game.dbQuestions = allQuestions.filter(q => 
            q.topic === 'css' && 
            q.difficulty === 'medium' && 
            q.status === 'active'
        ).sort((a, b) => a.questionId - b.questionId);
        
        if (Game.dbQuestions.length === 0) {
            alert('No questions available. Please add questions from admin panel.');
            window.location.href = 'games.html';
            return;
        }
        
        // Find last incomplete question or start from beginning
        let startIndex = findLastIncompleteQuestion();
        loadLevel(startIndex);
        populateLevelSelector();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions');
    }
}

// Find last incomplete question
function findLastIncompleteQuestion() {
    // If all questions completed, start from last question
    const allCompleted = Game.dbQuestions.every(q => 
        Game.completedQuestions.has(q._id)
    );
    
    if (allCompleted && Game.dbQuestions.length > 0) {
        return Game.dbQuestions.length - 1;
    }
    
    // Find first incomplete question
    for (let i = 0; i < Game.dbQuestions.length; i++) {
        if (!Game.completedQuestions.has(Game.dbQuestions[i]._id)) {
            return i;
        }
    }
    
    return 0;
}

// Load level
function loadLevel(index) {
    if (index < 0 || index >= Game.dbQuestions.length) return;
    
    Game.currentLevelIndex = index;
    const q = Game.dbQuestions[index];
    Game.currentLevel = q;
    
    // Check if completed
    const isCompleted = Game.completedQuestions.has(q._id);
    
    // Update UI
    document.getElementById('chapterNum').textContent = `Question ${index + 1} of ${Game.dbQuestions.length}`;
    document.getElementById('questTitle').textContent = q.title;
    document.getElementById('questXP').innerHTML = `<i class="fas fa-bolt"></i> ${isCompleted ? 'Completed' : '+' + q.points + ' XP'}`;
    
    // Badges
    document.getElementById('topicBadge').textContent = q.topic.toUpperCase();
    document.getElementById('topicBadge').className = `badge badge-${q.topic === 'flexbox' ? 'flexbox' : 'grid'}`;
    document.getElementById('difficultyBadge').textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
    document.getElementById('difficultyBadge').className = `badge badge-${q.difficulty}`;
    
    // Content - Better formatting
    document.getElementById('storyText').textContent = q.description || 'Complete this CSS challenge!';
    document.getElementById('dialoguesContainer').innerHTML = '';
    document.getElementById('missionGoal').textContent = q.description || 'Style the elements correctly';
    document.getElementById('missionHint').textContent = q.hints && q.hints.length > 0 ? q.hints[0] : 'Use CSS properties to match the goal layout';
    
    // Better tip formatting
    const tipHTML = q.hints && q.hints.length > 1 
        ? q.hints[1].split(',').map(h => `<code>${h.trim()}</code>`).join(', ')
        : '<code>display: flex</code>, <code>justify-content</code>, <code>align-items</code>';
    document.getElementById('tipContent').innerHTML = `Try using: ${tipHTML}`;
    
    // Editor
    const initialCode = q.initialCSS || '.flex-container {\n  /* Write your CSS here */\n  \n}';
    document.getElementById('cssEditor').value = initialCode;
    updateLineNumbers();
    
    // Battlefield
    loadBattlefield();
    loadGoalPreview();
    
    applyStyles();
    updateProgressBar();
    
    // Show completion badge if completed
    if (isCompleted) {
        showToast('✅ Already completed! Try again for practice', 'info');
    }
}

function loadBattlefield() {
    const container = document.getElementById('flexContainer');
    const q = Game.currentLevel;
    container.innerHTML = '';
    
    const count = q.charCount || 3;
    const theme = q.charTheme || 'wizard';
    const boxSize = q.boxSize || 70;
    const containerHeight = q.containerHeight || 400;
    const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚', star: '⭐', gem: '💎', wand: '🪄' };
    const mixedThemes = ['wizard', 'dragon', 'elf', 'knight', 'fairy'];
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'character char-order';
        const currentTheme = theme === 'mixed' ? mixedThemes[i % mixedThemes.length] : theme;
        const emoji = themes[currentTheme] || '🧙';
        div.innerHTML = `${emoji}<span class="char-label">Item ${i + 1}</span>`;
        div.style.width = `${boxSize}px`;
        div.style.height = `${boxSize}px`;
        div.style.minWidth = `${boxSize}px`;
        div.style.minHeight = `${boxSize}px`;
        container.appendChild(div);
    }
    
    // Set container height
    container.style.minHeight = `${containerHeight}px`;
    
    // Apply initial CSS if exists
    let styleTag = document.getElementById('liveDynamicCSS');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'liveDynamicCSS';
        document.head.appendChild(styleTag);
    }
    
    if (q.initialCSS) {
        const cssMatch = q.initialCSS.match(/\.flex-container\s*\{([^}]+)\}/s);
        if (cssMatch && cssMatch[1]) {
            styleTag.textContent = `#flexContainer { ${cssMatch[1].trim()} }`;
        }
    } else {
        styleTag.textContent = '';
    }
}

function loadGoalPreview() {
    const container = document.getElementById('goalContainer');
    const q = Game.currentLevel;
    container.innerHTML = '';
    
    const count = q.charCount || 3;
    const theme = q.charTheme || 'wizard';
    const boxSize = q.boxSize || 70;
    const containerHeight = q.containerHeight || 400;
    const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚', star: '⭐', gem: '💎', wand: '🪄' };
    const mixedThemes = ['wizard', 'dragon', 'elf', 'knight', 'fairy'];
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'character char-order';
        const currentTheme = theme === 'mixed' ? mixedThemes[i % mixedThemes.length] : theme;
        const emoji = themes[currentTheme] || '🧙';
        div.innerHTML = `${emoji}<span class="char-label">Item ${i + 1}</span>`;
        div.style.width = `${boxSize}px`;
        div.style.height = `${boxSize}px`;
        div.style.minWidth = `${boxSize}px`;
        div.style.minHeight = `${boxSize}px`;
        container.appendChild(div);
    }
    
    // Set container height
    container.style.minHeight = `${containerHeight}px`;
    
    // Apply expected CSS
    let styleTag = document.getElementById('goalDynamicCSS');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'goalDynamicCSS';
        document.head.appendChild(styleTag);
    }
    
    if (q.expectedCSS) {
        const cssMatch = q.expectedCSS.match(/\.flex-container\s*\{([^}]+)\}/s);
        if (cssMatch && cssMatch[1]) {
            styleTag.textContent = `#goalContainer { ${cssMatch[1].trim()} }`;
        }
    }
}

// Editor functions
function updateLineNumbers() {
    const editor = document.getElementById('cssEditor');
    const lines = editor.value.split('\n').length;
    document.getElementById('lineNumbers').innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

function runCode() {
    applyStyles();
    showToast('✨ Code applied!', 'success');
}

function applyStyles() {
    const css = document.getElementById('cssEditor').value;
    const container = document.getElementById('flexContainer');
    
    // Reset to base styles
    container.style.cssText = `
        width: 100%; 
        min-height: ${Game.currentLevel.containerHeight || 400}px; 
        height: auto; 
        border-radius: 16px; 
        padding: 30px;
        border: 2px dashed rgba(99, 102, 241, 0.25);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.03) 100%);
        gap: 15px; 
        overflow: auto;
    `;
    
    // Apply user CSS
    const match = css.match(/\.flex-container\s*\{([^}]*)\}/s);
    if (match && match[1]) {
        const props = match[1].split(';').filter(p => p.trim() && !p.trim().startsWith('/*'));
        props.forEach(prop => {
            const colonIndex = prop.indexOf(':');
            if (colonIndex > -1) {
                const name = prop.substring(0, colonIndex).trim();
                const value = prop.substring(colonIndex + 1).trim();
                if (name && value) {
                    try {
                        container.style[name.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
                    } catch (e) {
                        console.error('CSS error:', e);
                    }
                }
            }
        });
    }
    
    // Update validation bar
    updateValidationBar(css);
}

function updateValidationBar(css) {
    const bar = document.getElementById('validationBar');
    const q = Game.currentLevel;
    
    if (!q.expectedCSS) {
        bar.innerHTML = '';
        return;
    }
    
    // Extract required properties from expected CSS
    const expectedMatch = q.expectedCSS.match(/\.flex-container\s*\{([^}]*)\}/s);
    if (!expectedMatch) {
        bar.innerHTML = '';
        return;
    }
    
    const expectedProps = expectedMatch[1]
        .split(';')
        .filter(p => p.trim() && !p.trim().startsWith('/*'))
        .map(p => {
            const colonIndex = p.indexOf(':');
            if (colonIndex > -1) {
                return {
                    name: p.substring(0, colonIndex).trim(),
                    value: p.substring(colonIndex + 1).trim()
                };
            }
            return null;
        })
        .filter(p => p !== null);
    
    // Check user CSS
    const userMatch = css.match(/\.flex-container\s*\{([^}]*)\}/s);
    const userProps = userMatch ? userMatch[1]
        .split(';')
        .filter(p => p.trim() && !p.trim().startsWith('/*'))
        .map(p => {
            const colonIndex = p.indexOf(':');
            if (colonIndex > -1) {
                return {
                    name: p.substring(0, colonIndex).trim(),
                    value: p.substring(colonIndex + 1).trim()
                };
            }
            return null;
        })
        .filter(p => p !== null) : [];
    
    // Create validation items
    bar.innerHTML = expectedProps.map(expected => {
        const userProp = userProps.find(u => u.name === expected.name);
        const isValid = userProp && userProp.value === expected.value;
        const icon = isValid ? 'check' : 'times';
        const className = isValid ? 'valid' : 'invalid';
        
        return `<div class="validation-item ${className}">
            <i class="fas fa-${icon}"></i>
            <span>${expected.name}: ${expected.value}</span>
        </div>`;
    }).join('');
}

function resetCode() {
    const initialCode = Game.currentLevel.initialCSS || '.flex-container {\n  /* Write your CSS here */\n  \n}';
    document.getElementById('cssEditor').value = initialCode;
    updateLineNumbers();
    applyStyles();
    showToast('🔄 Code reset!', 'info');
}

async function submitSolution() {
    const css = document.getElementById('cssEditor').value;
    
    // Show loading
    const submitBtn = event.target;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    
    try {
        const response = await API.Questions.submitAnswer(Game.currentLevel._id, css);
        const data = response.data || response;
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        
        if (data.correct) {
            // Mark as completed
            Game.completedQuestions.add(Game.currentLevel._id);
            handleVictory(data);
        } else {
            handleDefeat(data);
        }
    } catch (error) {
        console.error('Submit error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        showToast('❌ Submission failed', 'error');
    }
}

function handleVictory(response) {
    // Update user points from response
    if (response.newPoints !== undefined && response.newPoints !== null) {
        Game.user.points = response.newPoints;
    }
    updateStats();
    
    const isAlreadyCompleted = response.alreadyCompleted || false;
    
    document.getElementById('earnedXP').textContent = isAlreadyCompleted ? '0' : `+${Game.currentLevel.points}`;
    document.getElementById('streakCount').textContent = Game.completedQuestions.size;
    document.getElementById('victoryMessage').textContent = isAlreadyCompleted 
        ? 'Already completed! No additional points awarded.' 
        : "You've mastered this CSS spell!";
    document.getElementById('victoryModal').classList.add('active');
    
    if (!isAlreadyCompleted) {
        createConfetti();
    }
}

function handleDefeat(data) {
    const hint = data.hint || (Game.currentLevel.hints && Game.currentLevel.hints.length > 0 ? Game.currentLevel.hints[0] : 'Check your CSS properties and values');
    document.getElementById('defeatHint').textContent = hint;
    document.getElementById('defeatModal').classList.add('active');
}

function nextLevel() {
    closeModal('victoryModal');
    if (Game.currentLevelIndex < Game.dbQuestions.length - 1) {
        loadLevel(Game.currentLevelIndex + 1);
    } else {
        showToast('🎉 All levels complete! Great job!', 'success');
        setTimeout(() => window.location.href = 'games.html', 2000);
    }
}

// UI helpers
function updateStats() {
    if (Game.user) {
        document.getElementById('totalXP').textContent = Game.user.points || 0;
        document.getElementById('winStreak').textContent = Game.completedQuestions.size;
        document.getElementById('playerLevel').textContent = Math.floor((Game.user.points || 0) / 200) + 1;
    }
}

function updateProgressBar() {
    const completed = Game.completedQuestions.size;
    const total = Game.dbQuestions.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('progressText').textContent = `${completed}/${total}`;
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
}

function switchView(view) {
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('liveView').style.display = view === 'live' ? 'flex' : 'none';
    document.getElementById('goalView').style.display = view === 'goal' ? 'flex' : 'none';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function openLevelsModal() {
    populateLevelSelector();
    document.getElementById('levelsModal').classList.add('active');
}

function closeLevelsModal() {
    document.getElementById('levelsModal').classList.remove('active');
}

function openShortcutsModal() {
    document.getElementById('shortcutsModal').classList.add('active');
}

function closeShortcutsModal() {
    document.getElementById('shortcutsModal').classList.remove('active');
}

function populateLevelSelector() {
    const grid = document.getElementById('flexboxLevels');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Game.dbQuestions.forEach((q, i) => {
        const isCompleted = Game.completedQuestions.has(q._id);
        const card = document.createElement('div');
        card.className = `level-card ${isCompleted ? 'completed' : ''}`;
        card.onclick = () => {
            loadLevel(i);
            closeLevelsModal();
        };
        
        card.innerHTML = `
            <div class="level-card-num">Question ${i + 1}</div>
            <div class="level-card-title">${q.title}</div>
            <div class="level-card-badges">
                <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success);">+${q.points} XP</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Event listeners
function setupEventListeners() {
    const editor = document.getElementById('cssEditor');
    
    editor.addEventListener('input', () => {
        updateLineNumbers();
        applyStyles();
    });
    
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(editor.selectionEnd);
            editor.selectionStart = editor.selectionEnd = start + 2;
            updateLineNumbers();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'Enter') { e.preventDefault(); runCode(); }
            if (e.key === 's') { e.preventDefault(); submitSolution(); }
            if (e.key === 'r') { e.preventDefault(); resetCode(); }
            if (e.key === 'm') { e.preventDefault(); openLevelsModal(); }
        }
        if (e.key === 'Escape') {
            closeModal('victoryModal');
            closeModal('defeatModal');
            closeLevelsModal();
            closeShortcutsModal();
        }
    });
}

// Toast & Confetti
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function showSolution() {
    const q = Game.currentLevel;
    if (q.expectedCSS) {
        document.getElementById('cssEditor').value = q.expectedCSS;
        updateLineNumbers();
        applyStyles();
        showToast('💡 Solution loaded', 'info');
        closeModal('defeatModal');
    }
}

async function addNewLevel(event) {
    event.preventDefault();
    
    const newQuestion = {
        questionId: Game.dbQuestions.length + 1,
        title: document.getElementById('newLevelTitle').value,
        description: document.getElementById('newLevelStory').value,
        topic: document.getElementById('newLevelTopic').value.toLowerCase(),
        difficulty: document.getElementById('newLevelDifficulty').value.toLowerCase(),
        points: parseInt(document.getElementById('newLevelPoints').value),
        hints: [document.getElementById('newLevelGoal').value],
        initialCSS: document.getElementById('newLevelCSS').value,
        expectedCSS: document.getElementById('newLevelCSS').value,
        charCount: 3,
        charTheme: 'wizard',
        boxSize: 70,
        containerHeight: 400,
        status: 'active'
    };
    
    try {
        await API.Questions.create(newQuestion);
        showToast('✅ Level created!', 'success');
        clearAddLevelForm();
        await loadQuestionsFromDB();
        closeLevelsModal();
    } catch (error) {
        console.error('Error creating level:', error);
        showToast('❌ Failed to create level', 'error');
    }
}

function clearAddLevelForm() {
    document.getElementById('addLevelForm').reset();
}
