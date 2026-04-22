// ============================================
        // GAME STATE
        // ============================================
        const Game = {
            currentLevelIndex: 0,
            currentLevel: null,
            totalXP: 0,
            playerLevel: 1,
            winStreak: 0,
            completedLevels: new Set(),
            customLevels: []
        };

        // ============================================
        // LEVEL DATA
        // ============================================
        let flexboxLevels = [
            {
                id: 'flex-1',
                number: 1,
                title: 'The Sorting Ceremony',
                topic: 'Flexbox',
                difficulty: 'Beginner',
                points: 50,
                narrative: 'Welcome to Hogwarts! Harry, Hermione, and Ron must stand together in the center of the Great Hall for the Sorting Hat ceremony.',
                dialogues: [
                    { speaker: 'Dumbledore', type: 'dumbledore', text: 'Welcome to Hogwarts! Let the Sorting begin.', wand: 'Elder Wand' },
                    { speaker: 'Harry', type: 'harry', text: 'I hope we all get into Gryffindor!', wand: 'Holly, Phoenix Feather' },
                    { speaker: 'Hermione', type: 'hermione', text: 'Use justify-content to center us!', wand: 'Vine, Dragon Heartstring' }
                ],
                missionGoal: 'Center all students in the Great Hall',
                missionHint: 'Use display: flex and justify-content: center',
                tip: 'Use <code>display: flex</code> and <code>justify-content: center</code> to center items!',
                characters: [
                    { type: 'harry', emoji: '⚡', label: 'Harry' },
                    { type: 'hermione', emoji: '📚', label: 'Hermione' },
                    { type: 'ron', emoji: '♟️', label: 'Ron' }
                ],
                initialCSS: '.flex-container {\n  /* Center the students */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'flex', label: 'display: flex' },
                    { property: 'justify-content', value: 'center', label: 'justify-content: center' }
                ],
                goalStyles: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
            },
            {
                id: 'flex-2',
                number: 2,
                title: 'Defense Formation',
                topic: 'Flexbox',
                difficulty: 'Beginner',
                points: 60,
                narrative: 'The Order of the Phoenix must spread out to defend Hogwarts from all sides!',
                dialogues: [
                    { speaker: 'Snape', type: 'snape', text: 'Spread out! Cover all positions.', wand: 'Unknown' },
                    { speaker: 'Harry', type: 'harry', text: 'We need to cover the flanks!', wand: 'Holly, Phoenix Feather' }
                ],
                missionGoal: 'Spread defenders across the battlefield',
                missionHint: 'Use justify-content: space-between',
                tip: '<code>space-between</code> places items at the start and end with equal space between!',
                characters: [
                    { type: 'harry', emoji: '⚡', label: 'Harry' },
                    { type: 'dumbledore', emoji: '🧙', label: 'Dumbledore' },
                    { type: 'hermione', emoji: '📚', label: 'Hermione' }
                ],
                initialCSS: '.flex-container {\n  display: flex;\n  /* Spread out */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'flex', label: 'display: flex' },
                    { property: 'justify-content', value: 'space-between', label: 'justify-content: space-between' }
                ],
                goalStyles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
            },
            {
                id: 'flex-3',
                number: 3,
                title: 'The Tower',
                topic: 'Flexbox',
                difficulty: 'Medium',
                points: 80,
                narrative: 'At the Astronomy Tower, students must form a vertical line to observe the stars.',
                dialogues: [
                    { speaker: 'Hermione', type: 'hermione', text: 'We need to form a column!', wand: 'Vine, Dragon Heartstring' },
                    { speaker: 'Ron', type: 'ron', text: 'Use flex-direction: column!', wand: 'Willow, Unicorn Hair' }
                ],
                missionGoal: 'Arrange students in a vertical column',
                missionHint: 'Use flex-direction: column',
                tip: '<code>flex-direction: column</code> stacks items vertically!',
                characters: [
                    { type: 'harry', emoji: '⚡', label: 'Harry' },
                    { type: 'hermione', emoji: '📚', label: 'Hermione' },
                    { type: 'ron', emoji: '♟️', label: 'Ron' }
                ],
                initialCSS: '.flex-container {\n  display: flex;\n  /* Stack vertically */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'flex', label: 'display: flex' },
                    { property: 'flex-direction', value: 'column', label: 'flex-direction: column' },
                    { property: 'align-items', value: 'center', label: 'align-items: center' }
                ],
                goalStyles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
            },
            {
                id: 'flex-4',
                number: 4,
                title: "Philosopher's Stone",
                topic: 'Flexbox',
                difficulty: 'Medium',
                points: 100,
                narrative: "The Philosopher's Stone must be placed at the exact center of the chamber!",
                dialogues: [
                    { speaker: 'Dumbledore', type: 'dumbledore', text: 'Only perfect centering will protect the Stone.', wand: 'Elder Wand' },
                    { speaker: 'Harry', type: 'harry', text: 'I must center it both ways!', wand: 'Holly, Phoenix Feather' }
                ],
                missionGoal: 'Center the Stone both horizontally and vertically',
                missionHint: 'Combine justify-content and align-items with center',
                tip: '<code>align-items: center</code> + <code>justify-content: center</code> = perfect center!',
                characters: [
                    { type: 'treasure', emoji: '💎', label: 'Stone' }
                ],
                initialCSS: '.flex-container {\n  display: flex;\n  /* Perfect center */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'flex', label: 'display: flex' },
                    { property: 'justify-content', value: 'center', label: 'justify-content: center' },
                    { property: 'align-items', value: 'center', label: 'align-items: center' }
                ],
                goalStyles: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
            },
            {
                id: 'flex-5',
                number: 5,
                title: "Dumbledore's Army",
                topic: 'Flexbox',
                difficulty: 'Advanced',
                points: 120,
                narrative: "The Room of Requirement is full! DA members must wrap to multiple rows.",
                dialogues: [
                    { speaker: 'Harry', type: 'harry', text: 'Everyone take positions!', wand: 'Holly, Phoenix Feather' },
                    { speaker: 'Hermione', type: 'hermione', text: 'Use flex-wrap!', wand: 'Vine, Dragon Heartstring' }
                ],
                missionGoal: 'Arrange the army in wrapped rows with gaps',
                missionHint: 'Use flex-wrap: wrap and gap',
                tip: '<code>flex-wrap: wrap</code> allows items to wrap. Add <code>gap</code> for spacing!',
                characters: [
                    { type: 'harry', emoji: '⚡', label: 'Harry' },
                    { type: 'hermione', emoji: '📚', label: 'Hermione' },
                    { type: 'ron', emoji: '♟️', label: 'Ron' },
                    { type: 'order', emoji: '🌙', label: 'Luna' },
                    { type: 'order', emoji: '🌱', label: 'Neville' },
                    { type: 'order', emoji: '🔥', label: 'Ginny' }
                ],
                initialCSS: '.flex-container {\n  display: flex;\n  /* Wrap with gaps */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'flex', label: 'display: flex' },
                    { property: 'flex-wrap', value: 'wrap', label: 'flex-wrap: wrap' },
                    { property: 'gap', value: null, label: 'gap' },
                    { property: 'justify-content', value: 'center', label: 'justify-content: center' }
                ],
                goalStyles: { display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', alignItems: 'center' }
            }
        ];

        let gridLevels = [
            {
                id: 'grid-1',
                number: 1,
                title: 'Trophy Room',
                topic: 'Grid',
                difficulty: 'Beginner',
                points: 70,
                narrative: 'The House Cup trophies need organizing in a 2x2 grid.',
                dialogues: [
                    { speaker: 'Hermione', type: 'hermione', text: 'CSS Grid is perfect for this!', wand: 'Vine, Dragon Heartstring' },
                    { speaker: 'Ron', type: 'ron', text: 'A 2-column grid should work.', wand: 'Willow, Unicorn Hair' }
                ],
                missionGoal: 'Arrange trophies in a 2-column grid',
                missionHint: 'Use display: grid and grid-template-columns',
                tip: '<code>display: grid</code> + <code>grid-template-columns: 1fr 1fr</code> for 2 equal columns!',
                characters: [
                    { type: 'treasure', emoji: '🦁', label: 'Gryffindor' },
                    { type: 'treasure', emoji: '🐍', label: 'Slytherin' },
                    { type: 'treasure', emoji: '🦅', label: 'Ravenclaw' },
                    { type: 'treasure', emoji: '🦡', label: 'Hufflepuff' }
                ],
                initialCSS: '.flex-container {\n  /* Use CSS Grid */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'grid', label: 'display: grid' },
                    { property: 'grid-template-columns', value: null, label: 'grid-template-columns' },
                    { property: 'gap', value: null, label: 'gap' }
                ],
                goalStyles: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', justifyItems: 'center' }
            },
            {
                id: 'grid-2',
                number: 2,
                title: 'Quidditch Field',
                topic: 'Grid',
                difficulty: 'Medium',
                points: 90,
                narrative: 'The Quidditch team needs a 3x3 formation on the field!',
                dialogues: [
                    { speaker: 'Harry', type: 'harry', text: 'We need a 3x3 formation!', wand: 'Holly, Phoenix Feather' },
                    { speaker: 'Ron', type: 'ron', text: 'Use repeat(3, 1fr)!', wand: 'Willow, Unicorn Hair' }
                ],
                missionGoal: 'Create a 3x3 Quidditch formation',
                missionHint: 'Use grid-template-columns: repeat(3, 1fr)',
                tip: '<code>repeat(3, 1fr)</code> creates 3 equal columns!',
                characters: [
                    { type: 'order', emoji: '🧹', label: 'Chaser' },
                    { type: 'harry', emoji: '⚡', label: 'Seeker' },
                    { type: 'order', emoji: '🧹', label: 'Chaser' },
                    { type: 'order', emoji: '🏏', label: 'Beater' },
                    { type: 'ron', emoji: '🥅', label: 'Keeper' },
                    { type: 'order', emoji: '🏏', label: 'Beater' },
                    { type: 'order', emoji: '🧹', label: 'Chaser' },
                    { type: 'treasure', emoji: '⚽', label: 'Quaffle' },
                    { type: 'treasure', emoji: '✨', label: 'Snitch' }
                ],
                initialCSS: '.flex-container {\n  display: grid;\n  /* Create 3 columns */\n  \n}',
                requiredProperties: [
                    { property: 'display', value: 'grid', label: 'display: grid' },
                    { property: 'grid-template-columns', value: null, label: 'grid-template-columns' },
                    { property: 'gap', value: null, label: 'gap' }
                ],
                goalStyles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', justifyItems: 'center' }
            }
        ];

        let allLevels = [...flexboxLevels, ...gridLevels];

        // ============================================
        // INITIALIZATION
        // ============================================
        document.addEventListener('DOMContentLoaded', initGame);

        function initGame() {
            loadProgress();
            loadCustomLevels();
            loadLevel(0);
            setupEventListeners();
            populateLevelSelector();

            setTimeout(() => {
                document.getElementById('loadingOverlay').style.display = 'none';
            }, 800);
        }

        // ============================================
        // LEVEL MANAGEMENT
        // ============================================
        function loadLevel(index) {
            if (index < 0 || index >= allLevels.length) return;

            Game.currentLevelIndex = index;
            Game.currentLevel = allLevels[index];
            const level = Game.currentLevel;

            // Update UI
            document.getElementById('chapterNum').textContent = `Chapter ${level.number}`;
            document.getElementById('questTitle').textContent = level.title;
            document.getElementById('questXP').innerHTML = `<i class="fas fa-bolt"></i> +${level.points} XP`;

            // Badges
            const topicBadge = document.getElementById('topicBadge');
            topicBadge.textContent = level.topic;
            topicBadge.className = `badge badge-${level.topic.toLowerCase()}`;

            const diffBadge = document.getElementById('difficultyBadge');
            diffBadge.textContent = level.difficulty;
            diffBadge.className = `badge badge-${level.difficulty.toLowerCase()}`;

            // Content
            document.getElementById('storyText').textContent = level.narrative;
            loadDialogues(level.dialogues);
            document.getElementById('missionGoal').textContent = level.missionGoal;
            document.getElementById('missionHint').textContent = level.missionHint;
            document.getElementById('tipContent').innerHTML = level.tip;

            // Battlefield
            loadBattlefield(level.characters);
            loadGoalPreview(level);

            // Editor
            document.getElementById('cssEditor').value = level.initialCSS;
            updateLineNumbers();
            loadValidationBar(level.requiredProperties);

            setTimeout(() => {
                applyStyles();
                validateCode();
            }, 100);

            saveProgress();
        }

        function loadDialogues(dialogues) {
            const container = document.getElementById('dialoguesContainer');
            container.innerHTML = '';

            const avatarEmojis = {
                harry: '⚡', hermione: '📚', ron: '♟️', dumbledore: '🧙',
                voldemort: '🐍', snape: '🧪', draco: '🦅'
            };

            dialogues.forEach((d, i) => {
                const div = document.createElement('div');
                div.className = 'dialogue';
                div.style.animationDelay = `${i * 0.15}s`;
                div.innerHTML = `
                    <div class="dialogue-avatar avatar-${d.type}">${avatarEmojis[d.type] || '💬'}</div>
                    <div class="dialogue-content">
                        <div class="dialogue-speaker speaker-${d.type}">
                            ${d.speaker}
                            ${d.wand ? `<span class="wand-info">🪄 ${d.wand}</span>` : ''}
                        </div>
                        <div class="dialogue-bubble">${d.text}</div>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        function loadBattlefield(chars) {
            const container = document.getElementById('flexContainer');
            container.innerHTML = '';
            container.style.cssText = '';

            chars.forEach(char => {
                const div = document.createElement('div');
                div.className = `character char-${char.type}`;
                div.innerHTML = `${char.emoji}<span class="char-label">${char.label}</span>`;
                container.appendChild(div);
            });
        }

        function loadGoalPreview(level) {
            const container = document.getElementById('goalContainer');
            container.innerHTML = '';
            Object.assign(container.style, level.goalStyles);

            level.characters.forEach(char => {
                const div = document.createElement('div');
                div.className = `character char-${char.type}`;
                div.innerHTML = `${char.emoji}<span class="char-label">${char.label}</span>`;
                container.appendChild(div);
            });
        }

        function loadValidationBar(properties) {
            const bar = document.getElementById('validationBar');
            bar.innerHTML = '';

            properties.forEach(prop => {
                const div = document.createElement('div');
                div.className = 'validation-item';
                div.id = `val-${prop.property}`;
                div.innerHTML = `<i class="fas fa-circle"></i> ${prop.label}`;
                bar.appendChild(div);
            });
        }

        // ============================================
        // CODE EDITOR
        // ============================================
        function updateLineNumbers() {
            const editor = document.getElementById('cssEditor');
            const lines = editor.value.split('\n').length;
            document.getElementById('lineNumbers').innerHTML = 
                Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
        }

        function runCode() {
            applyStyles();
            validateCode();
            showToast('Code applied!', 'success');
        }

        function applyStyles() {
            const css = document.getElementById('cssEditor').value;
            const container = document.getElementById('flexContainer');

            // Reset
            container.style.cssText = `
                width: 100%; min-height: calc(100vh - 180px); height: auto; border-radius: 16px; padding: 30px;
                border: 2px dashed rgba(99, 102, 241, 0.25);
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.03) 100%);
                display: flex; flex-wrap: wrap; align-content: flex-start; gap: 15px; overflow: auto;
            `;

            // Parse and apply
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

        function validateCode() {
            const css = document.getElementById('cssEditor').value.toLowerCase();
            const level = Game.currentLevel;
            let allValid = true;

            level.requiredProperties.forEach(req => {
                const item = document.getElementById(`val-${req.property}`);
                if (!item) return;

                let valid = req.value 
                    ? css.includes(req.property) && css.includes(req.value)
                    : css.includes(req.property);

                item.className = `validation-item ${valid ? 'valid' : 'invalid'}`;
                item.querySelector('i').className = `fas fa-${valid ? 'check-circle' : 'times-circle'}`;

                if (!valid) allValid = false;
            });

            return allValid;
        }

        function resetCode() {
            if (Game.currentLevel) {
                document.getElementById('cssEditor').value = Game.currentLevel.initialCSS;
                updateLineNumbers();
                applyStyles();
                validateCode();
                showToast('Code reset!', 'info');
            }
        }

        // ============================================
        // SUBMISSION
        // ============================================
        function submitSolution() {
            if (validateCode()) {
                handleVictory();
            } else {
                handleDefeat();
            }
        }

        function handleVictory() {
            const level = Game.currentLevel;
            let xp = level.points;

            Game.winStreak++;
            if (Game.winStreak >= 3) xp += 15;
            if (Game.winStreak >= 5) xp += 30;

            Game.totalXP += xp;
            Game.completedLevels.add(level.id);
            Game.playerLevel = Math.floor(Game.totalXP / 200) + 1;

            updateStats();

            document.getElementById('earnedXP').textContent = `+${xp}`;
            document.getElementById('streakCount').textContent = Game.winStreak;
            document.getElementById('victoryModal').classList.add('active');

            createConfetti();
            saveProgress();
        }

        function handleDefeat() {
            Game.winStreak = 0;
            updateStats();
            document.getElementById('defeatHint').textContent = Game.currentLevel.missionHint;
            document.getElementById('defeatModal').classList.add('active');
        }

        function showSolution() {
            closeModal('defeatModal');
            const level = Game.currentLevel;
            let solution = '.flex-container {\n';
            level.requiredProperties.forEach(prop => {
                if (prop.value) solution += `  ${prop.property}: ${prop.value};\n`;
            });
            solution += '}';
            document.getElementById('cssEditor').value = solution;
            updateLineNumbers();
            applyStyles();
            validateCode();
            showToast('Solution shown!', 'info');
        }

        function nextLevel() {
            closeModal('victoryModal');
            if (Game.currentLevelIndex < allLevels.length - 1) {
                loadLevel(Game.currentLevelIndex + 1);
            } else {
                showToast('🎉 All levels complete!', 'success');
            }
        }

        // ============================================
        // DYNAMIC LEVEL MANAGEMENT
        // ============================================
        function addNewLevel(event) {
            event.preventDefault();

            const title = document.getElementById('newLevelTitle').value.trim();
            const topic = document.getElementById('newLevelTopic').value;
            const difficulty = document.getElementById('newLevelDifficulty').value;
            const points = parseInt(document.getElementById('newLevelPoints').value);
            const story = document.getElementById('newLevelStory').value.trim();
            const goal = document.getElementById('newLevelGoal').value.trim();
            const css = document.getElementById('newLevelCSS').value.trim();
            const propsStr = document.getElementById('newLevelProps').value.trim();
            const charsStr = document.getElementById('newLevelChars').value.trim();

            const requiredProperties = propsStr.split(',').map(p => {
                const [prop, val] = p.trim().split(':').map(s => s.trim());
                return { property: prop, value: val || null, label: p.trim() };
            });

            const characters = charsStr.split(',').map(c => {
                const [type, emoji, label] = c.trim().split(':').map(s => s.trim());
                return { type: type || 'order', emoji: emoji || '🧙', label: label || 'Wizard' };
            });

            const newLevel = {
                id: `custom-${Date.now()}`,
                number: allLevels.length + 1,
                title, topic, difficulty, points,
                narrative: story,
                dialogues: [{ speaker: 'Dumbledore', type: 'dumbledore', text: 'A new challenge!', wand: 'Elder Wand' }],
                missionGoal: goal,
                missionHint: `Complete: ${goal}`,
                tip: `Use the required properties!`,
                characters,
                initialCSS: css,
                requiredProperties,
                goalStyles: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
                isCustom: true
            };

            if (topic === 'Flexbox') flexboxLevels.push(newLevel);
            else gridLevels.push(newLevel);

            allLevels = [...flexboxLevels, ...gridLevels];
            Game.customLevels.push(newLevel);

            localStorage.setItem('hogwarts-custom-levels', JSON.stringify(Game.customLevels));
            populateLevelSelector();
            clearAddLevelForm();
            showToast(`"${title}" created!`, 'success');
        }

        function clearAddLevelForm() {
            document.getElementById('addLevelForm').reset();
        }

        function loadCustomLevels() {
            const saved = localStorage.getItem('hogwarts-custom-levels');
            if (saved) {
                try {
                    const customLevels = JSON.parse(saved);
                    customLevels.forEach(level => {
                        level.number = allLevels.length + 1;
                        if (level.topic === 'Flexbox') flexboxLevels.push(level);
                        else gridLevels.push(level);
                    });
                    allLevels = [...flexboxLevels, ...gridLevels];
                    Game.customLevels = customLevels;
                } catch (e) {}
            }
        }

        // ============================================
        // UI HELPERS
        // ============================================
        function updateStats() {
            document.getElementById('totalXP').textContent = Game.totalXP;
            document.getElementById('winStreak').textContent = Game.winStreak;
            document.getElementById('playerLevel').textContent = Game.playerLevel;
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
            const flexGrid = document.getElementById('flexboxLevels');
            const gridGrid = document.getElementById('gridLevels');

            flexGrid.innerHTML = '';
            gridGrid.innerHTML = '';

            flexboxLevels.forEach((level, i) => {
                flexGrid.appendChild(createLevelCard(level, i));
            });

            gridLevels.forEach((level, i) => {
                gridGrid.appendChild(createLevelCard(level, flexboxLevels.length + i));
            });
        }

        function createLevelCard(level, globalIndex) {
            const completed = Game.completedLevels.has(level.id);

            const card = document.createElement('div');
            card.className = `level-card ${completed ? 'completed' : ''}`;
            card.onclick = () => {
                loadLevel(globalIndex);
                closeLevelsModal();
            };

            card.innerHTML = `
                <div class="level-card-num">Chapter ${level.number} ${level.isCustom ? '(Custom)' : ''}</div>
                <div class="level-card-title">${level.title}</div>
                <div class="level-card-badges">
                    <span class="badge badge-${level.difficulty.toLowerCase()}">${level.difficulty}</span>
                    <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success);">+${level.points} XP</span>
                </div>
            `;

            return card;
        }

        // ============================================
        // PROGRESS
        // ============================================
        function saveProgress() {
            localStorage.setItem('hogwarts-css-game', JSON.stringify({
                totalXP: Game.totalXP,
                playerLevel: Game.playerLevel,
                winStreak: Game.winStreak,
                completedLevels: Array.from(Game.completedLevels),
                currentLevelIndex: Game.currentLevelIndex
            }));
        }

        function loadProgress() {
            const saved = localStorage.getItem('hogwarts-css-game');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    Game.totalXP = data.totalXP || 0;
                    Game.playerLevel = data.playerLevel || 1;
                    Game.winStreak = data.winStreak || 0;
                    Game.completedLevels = new Set(data.completedLevels || []);
                    updateStats();
                } catch (e) {}
            }
        }

        // ============================================
        // EVENT LISTENERS
        // ============================================
        function setupEventListeners() {
            const editor = document.getElementById('cssEditor');

            editor.addEventListener('input', () => {
                updateLineNumbers();
                applyStyles();
                validateCode();
            });

            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(editor.selectionEnd);
                    editor.selectionStart = editor.selectionEnd = start + 2;
                    updateLineNumbers();
                    applyStyles();
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

        // ============================================
        // TOAST & CONFETTI
        // ============================================
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

            setTimeout(() => container.innerHTML = '', 5000);
        }