// Database-integrated Flexbox & Grid Game
const Game = {
    currentLevelIndex: 0,
    currentLevel: null,
    dbQuestions: [],
    user: null
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
        
        loadLevel(0);
        populateLevelSelector();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions');
    }
}

// Load level
function loadLevel(index) {
    if (index < 0 || index >= Game.dbQuestions.length) return;
    
    Game.currentLevelIndex = index;
    const q = Game.dbQuestions[index];
    Game.currentLevel = q;
    
    // Update UI
    document.getElementById('chapterNum').textContent = `Question ${index + 1}`;
    document.getElementById('questTitle').textContent = q.title;
    document.getElementById('questXP').innerHTML = `<i class="fas fa-bolt"></i> +${q.points} XP`;
    
    // Badges
    document.getElementById('topicBadge').textContent = q.topic.toUpperCase();
    document.getElementById('difficultyBadge').textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
    document.getElementById('difficultyBadge').className = `badge badge-${q.difficulty}`;
    
    // Content
    document.getElementById('storyText').textContent = q.description;
    document.getElementById('dialoguesContainer').innerHTML = '';
    document.getElementById('missionGoal').textContent = q.description;
    document.getElementById('missionHint').textContent = q.hints && q.hints.length > 0 ? q.hints[0] : 'Use CSS properties';
    document.getElementById('tipContent').innerHTML = q.hints && q.hints.length > 1 ? q.hints[1] : 'Write your CSS code';
    
    // Editor
    document.getElementById('cssEditor').value = '.flex-container {\n  /* Write your CSS */\n  \n}';
    updateLineNumbers();
    
    // Battlefield - simple preview
    loadBattlefield();
    loadGoalPreview();
    
    applyStyles();
    updateProgressBar();
}

function loadBattlefield() {
    const container = document.getElementById('flexContainer');
    const q = Game.currentLevel;
    container.innerHTML = '';
    
    const count = q.charCount || 3;
    const theme = q.charTheme || 'wizard';
    const boxSize = q.boxSize || 50;
    const containerHeight = q.containerHeight || 250;
    const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚' };
    const mixedThemes = ['wizard', 'dragon', 'elf', 'knight', 'fairy'];
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'character char-order';
        const currentTheme = theme === 'mixed' ? mixedThemes[i % mixedThemes.length] : theme;
        const emoji = themes[currentTheme] || '🧙';
        div.innerHTML = `${emoji}<span class="char-label">Box ${i + 1}</span>`;
        div.style.width = `${boxSize}px`;
        div.style.height = `${boxSize}px`;
        container.appendChild(div);
    }
    
    // Inject CSS via style tag to override everything
    let styleTag = document.getElementById('liveDynamicCSS');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'liveDynamicCSS';
        document.head.appendChild(styleTag);
    }
    
    if (q.initialCSS) {
        const cssMatch = q.initialCSS.match(/\.flex-container\s*\{([^}]+)\}/s);
        if (cssMatch && cssMatch[1]) {
            styleTag.textContent = `#flexContainer { ${cssMatch[1].trim()} min-height: ${containerHeight}px !important; width: 100% !important; }`;
            console.log('Injected Initial CSS:', cssMatch[1].trim());
        }
    } else {
        styleTag.textContent = `#flexContainer { min-height: ${containerHeight}px !important; width: 100% !important; }`;
    }
}

function loadGoalPreview() {
    const container = document.getElementById('goalContainer');
    const q = Game.currentLevel;
    container.innerHTML = '';
    
    const count = q.charCount || 3;
    const theme = q.charTheme || 'wizard';
    const boxSize = q.boxSize || 50;
    const containerHeight = q.containerHeight || 250;
    const themes = { wizard: '🧙', dragon: '🐉', elf: '🧝', knight: '⚔️', fairy: '🧚' };
    const mixedThemes = ['wizard', 'dragon', 'elf', 'knight', 'fairy'];
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'character char-order';
        const currentTheme = theme === 'mixed' ? mixedThemes[i % mixedThemes.length] : theme;
        const emoji = themes[currentTheme] || '🧙';
        div.innerHTML = `${emoji}<span class="char-label">Box ${i + 1}</span>`;
        div.style.width = `${boxSize}px`;
        div.style.height = `${boxSize}px`;
        container.appendChild(div);
    }
    
    // Inject CSS via style tag to override everything
    let styleTag = document.getElementById('goalDynamicCSS');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'goalDynamicCSS';
        document.head.appendChild(styleTag);
    }
    
    if (q.expectedCSS) {
        const cssMatch = q.expectedCSS.match(/\.flex-container\s*\{([^}]+)\}/s);
        if (cssMatch && cssMatch[1]) {
            styleTag.textContent = `#goalContainer { ${cssMatch[1].trim()} min-height: ${containerHeight}px !important; width: 100% !important; }`;
            console.log('Injected Goal CSS:', cssMatch[1].trim());
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
    showToast('Code applied!', 'success');
}

function applyStyles() {
    const css = document.getElementById('cssEditor').value;
    const container = document.getElementById('flexContainer');
    
    container.style.cssText = `
        width: 100%; min-height: calc(100vh - 180px); height: auto; border-radius: 16px; padding: 30px;
        border: 2px dashed rgba(99, 102, 241, 0.25);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.03) 100%);
        display: flex; flex-wrap: wrap; align-content: flex-start; gap: 15px; overflow: auto;
    `;
    
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
                    } catch (e) {}
                }
            }
        });
    }
}

function resetCode() {
    document.getElementById('cssEditor').value = '.flex-container {\n  /* Write your CSS */\n  \n}';
    updateLineNumbers();
    applyStyles();
    showToast('Code reset!', 'info');
}

async function submitSolution() {
    const css = document.getElementById('cssEditor').value;
    
    try {
        const response = await API.Questions.submitAnswer(Game.currentLevel._id, css);
        const data = response.data || response;
        
        console.log('Submit response:', data);
        
        if (data.correct) {
            handleVictory(data);
        } else {
            handleDefeat();
        }
    } catch (error) {
        console.error('Submit error:', error);
        showToast('Submission failed', 'error');
    }
}

function handleVictory(response) {
    // Update user points from response
    if (response.newPoints !== undefined && response.newPoints !== null) {
        Game.user.points = response.newPoints;
        console.log('Updated points to:', response.newPoints);
    }
    updateStats();
    
    document.getElementById('earnedXP').textContent = `+${Game.currentLevel.points}`;
    document.getElementById('streakCount').textContent = '1';
    document.getElementById('victoryModal').classList.add('active');
    
    createConfetti();
}

function handleDefeat() {
    document.getElementById('defeatHint').textContent = Game.currentLevel.hints && Game.currentLevel.hints.length > 0 ? Game.currentLevel.hints[0] : 'Check your CSS';
    document.getElementById('defeatModal').classList.add('active');
}

function nextLevel() {
    closeModal('victoryModal');
    if (Game.currentLevelIndex < Game.dbQuestions.length - 1) {
        loadLevel(Game.currentLevelIndex + 1);
    } else {
        showToast('🎉 All levels complete!', 'success');
        setTimeout(() => window.location.href = 'games.html', 2000);
    }
}

// UI helpers
function updateStats() {
    if (Game.user) {
        document.getElementById('totalXP').textContent = Game.user.points || 0;
        document.getElementById('playerLevel').textContent = Math.floor((Game.user.points || 0) / 200) + 1;
    }
}

function updateProgressBar() {
    const current = Game.currentLevelIndex + 1;
    const total = Game.dbQuestions.length;
    const percent = Math.round((current / total) * 100);
    
    document.getElementById('progressText').textContent = `${current}/${total}`;
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
        const card = document.createElement('div');
        card.className = 'level-card';
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
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;
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
        showToast('Solution loaded', 'info');
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
        boxSize: 50,
        containerHeight: 250,
        status: 'active'
    };
    
    try {
        await API.Questions.create(newQuestion);
        showToast('Level created!', 'success');
        clearAddLevelForm();
        await loadQuestionsFromDB();
        closeLevelsModal();
    } catch (error) {
        console.error('Error creating level:', error);
        showToast('Failed to create level', 'error');
    }
}

function clearAddLevelForm() {
    document.getElementById('addLevelForm').reset();
}
