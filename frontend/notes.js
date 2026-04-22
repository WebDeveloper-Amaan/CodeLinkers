// Notes Page Logic
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Notes page loaded, fetching notes...');
    await loadNotes();
    setupTabs();
    
    // Check URL hash and open specific tab
    const hash = window.location.hash.substring(1);
    if (hash && ['beginner', 'bca', 'mca', 'placement', 'interview'].includes(hash)) {
        openTab(hash);
    }
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 500);
});

// Listen for hash changes (when clicking footer links on same page)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && ['beginner', 'bca', 'mca', 'placement', 'interview'].includes(hash)) {
        openTab(hash);
    }
});

async function loadNotes() {
    try {
        console.log('Calling API.Notes.getAll()...');
        const response = await API.Notes.getAll();
        const notes = response.data || response;
        
        console.log('Notes received:', notes);
        console.log('Total notes:', notes.length);
        
        // Group notes by category
        const grouped = {
            beginner: notes.filter(n => n.category === 'beginner'),
            bca: notes.filter(n => n.category === 'bca'),
            mca: notes.filter(n => n.category === 'mca'),
            placement: notes.filter(n => n.category === 'placement'),
            interview: notes.filter(n => n.category === 'interview')
        };
        
        console.log('Grouped notes:', grouped);
        
        // Render each category
        renderNotes('beginner', grouped.beginner);
        renderNotes('bca', grouped.bca);
        renderNotes('mca', grouped.mca);
        renderNotes('placement', grouped.placement);
        renderNotes('interview', grouped.interview);
        
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Failed to load notes. Please check if the server is running.', 'error');
    }
}

function renderNotes(category, notes) {
    console.log(`Rendering ${category} notes:`, notes.length);
    
    const panel = document.querySelector(`[data-tab-panel="${category}"]`);
    if (!panel) {
        console.error(`Panel not found for category: ${category}`);
        return;
    }
    
    const grid = panel.querySelector('.grid');
    if (!grid) {
        console.error(`Grid not found in panel: ${category}`);
        return;
    }
    
    // Clear existing content
    grid.innerHTML = '';
    
    if (notes.length === 0) {
        console.log(`No notes for ${category}, showing empty state`);
        grid.innerHTML = `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-dark-muted); margin-bottom: 16px;"></i>
                <h3>No Notes Available</h3>
                <p style="color: var(--text-dark-muted);">Notes will be added soon!</p>
            </div>
        `;
        return;
    }
    
    console.log(`Rendering ${notes.length} cards for ${category}`);
    const html = notes.map(note => createNoteCard(note, category)).join('');
    console.log('Generated HTML length:', html.length);
    grid.innerHTML = html;
    console.log('Grid innerHTML set, children count:', grid.children.length);
}

function createNoteCard(note, category) {
    const iconColors = {
        beginner: 'rgba(139, 92, 246, 0.15); color: #8b5cf6',
        bca: 'rgba(99, 102, 241, 0.15); color: #6366f1',
        mca: 'rgba(236, 72, 153, 0.15); color: #ec4899',
        placement: 'rgba(16, 185, 129, 0.15); color: #10b981',
        interview: 'rgba(245, 158, 11, 0.15); color: #f59e0b'
    };
    
    const icon = getIconForNote(note);
    
    return `
        <div class="card note-card" style="opacity: 1; transform: none;">
            <div class="note-icon" style="background: ${iconColors[category]}">
                <i class="${icon}"></i>
            </div>
            <div class="note-info">
                <h3>${note.title}</h3>
                <p>${note.description || note.subject || 'Study material'}</p>
                <div class="note-meta">
                    <span><i class="fas fa-file"></i> ${note.fileCount || 1} File${note.fileCount > 1 ? 's' : ''}</span>
                    <span><i class="fas fa-download"></i> ${formatDownloads(note.downloadCount || 0)} Downloads</span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="downloadNote('${note._id}', '${note.fileUrl}', '${note.title}')">
                <i class="fas fa-eye"></i> Preview/Download
            </button>
        </div>
    `;
}

function getIconForNote(note) {
    const title = note.title.toLowerCase();
    const subject = (note.subject || '').toLowerCase();
    
    if (title.includes('html') || subject.includes('html')) return 'fab fa-html5';
    if (title.includes('css') || subject.includes('css')) return 'fab fa-css3-alt';
    if (title.includes('javascript') || title.includes('js')) return 'fab fa-js';
    if (title.includes('java')) return 'fab fa-java';
    if (title.includes('python')) return 'fab fa-python';
    if (title.includes('sql') || title.includes('database') || title.includes('dbms')) return 'fas fa-database';
    if (title.includes('aptitude') || title.includes('reasoning')) return 'fas fa-brain';
    if (title.includes('dsa') || title.includes('algorithm')) return 'fas fa-code';
    if (title.includes('company') || title.includes('paper')) return 'fas fa-building';
    if (title.includes('resume')) return 'fas fa-file-alt';
    if (title.includes('system design')) return 'fas fa-project-diagram';
    
    return 'fas fa-file-pdf';
}

function formatDownloads(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count;
}

async function downloadNote(noteId, fileUrl, title) {
    try {
        // Track download
        await API.Notes.trackDownload(noteId);
        
        // Open in new tab (keeps user on current page)
        window.open(fileUrl, '_blank');
        
        // Update download count in UI
        updateDownloadCount(noteId);
        
    } catch (error) {
        console.error('Error downloading note:', error);
        showToast('Failed to open note', 'error');
    }
}

function updateDownloadCount(noteId) {
    // Find the note card and increment download count
    const cards = document.querySelectorAll('.note-card');
    cards.forEach(card => {
        const button = card.querySelector('button');
        if (button && button.getAttribute('onclick').includes(noteId)) {
            const downloadSpan = card.querySelector('.note-meta span:last-child');
            if (downloadSpan) {
                const currentText = downloadSpan.textContent;
                const match = currentText.match(/([\d.]+)k?/);
                if (match) {
                    let count = match[1].includes('.') && currentText.includes('k')
                        ? parseFloat(match[1]) * 1000 
                        : parseInt(match[1]);
                    count = isNaN(count) ? 0 : count;
                    count++;
                    downloadSpan.innerHTML = `<i class="fas fa-download"></i> ${formatDownloads(count)} Downloads`;
                }
            }
        }
    });
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            openTab(targetTab);
        });
    });
}

function openTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Remove active class from all
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    
    // Add active class to target
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const targetPanel = document.querySelector(`[data-tab-panel="${tabName}"]`);
    
    if (targetBtn) targetBtn.classList.add('active');
    if (targetPanel) {
        targetPanel.classList.add('active');
        // Scroll to tabs section
        const tabsContainer = document.querySelector('.tabs-container');
        if (tabsContainer) {
            tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
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
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
    document.body.appendChild(container);
    return container;
}
