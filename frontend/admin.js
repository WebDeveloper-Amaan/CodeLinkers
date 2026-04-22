/* ============================================
   CodeLinkers Admin Panel - Database Connected
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initAdminPanel();
    loadDashboardData();
});

// ============================================
// Check Admin Authentication
// ============================================
async function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // If no token, redirect to login
    if (!token) {
        alert('Please login to access admin panel');
        window.location.href = 'index.html';
        return;
    }
    
    // Check if user data exists in localStorage
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            
            // If user is admin, allow access immediately
            if (user.role === 'admin') {
                updateAdminProfile(user);
                return; // Skip API call, user is already authenticated
            }
        } catch (e) {
            // Invalid user data, continue to API verification
        }
    }
    
    // Only verify with API if localStorage check failed
    try {
        const response = await API.Auth.getMe();
        const user = response.data || response;
        
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(user));
        
        // Check if user is admin
        if (user.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return;
        }
        
        updateAdminProfile(user);
    } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please login again.');
        window.location.href = 'index.html';
    }
}

function updateAdminProfile(user) {
    const adminName = document.querySelector('.admin-name');
    const adminRole = document.querySelector('.admin-role');
    
    if (adminName) adminName.textContent = user.name || 'Admin User';
    if (adminRole) adminRole.textContent = user.role === 'admin' ? 'Super Admin' : 'Admin';
}

// Initialize Admin Panel
function initAdminPanel() {
    initSidebarNavigation();
    initSidebarToggle();
    initModals();
    initNotifications();
    initForms();
    initNotesFilters();
}

// ============================================
// Dashboard Data Loading
// ============================================
async function loadDashboardData() {
    try {
        const questions = await API.Questions.getAll();
        const users = await API.Users.getLeaderboard();
        
        // Update stats
        document.querySelector('.stat-value').textContent = users.data?.length || 0;
        document.querySelectorAll('.stat-value')[1].textContent = questions.data?.length || 0;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// ============================================
// Form Handlers - Connected to Database
// ============================================
function initForms() {
    // Add Question Form
    const addQuestionForm = document.querySelector('#addQuestionModal form');
    if (addQuestionForm) {
        addQuestionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAddQuestion(e.target);
        });
    }

    // Add Note Form
    const addNoteForm = document.querySelector('#addNoteModal form');
    if (addNoteForm) {
        addNoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAddNote(e.target);
        });
    }

    // Add Video Form
    const addVideoForm = document.querySelector('#addVideoModal form');
    if (addVideoForm) {
        addVideoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAddVideo(e.target);
        });
    }

    // Load initial data
    loadNotes();
}

// ============================================
// Add Question to Database
// ============================================
async function handleAddQuestion(form) {
    const formData = new FormData(form);
    
    const titleInput = form.querySelector('input[placeholder*="Center"]');
    const descInput = form.querySelector('textarea[placeholder*="Describe"]');
    const topicSelect = form.querySelector('select');
    const difficultySelect = form.querySelectorAll('select')[1];
    const hintsInput = form.querySelector('textarea[placeholder*="Use display"]');
    const htmlInput = form.querySelector('textarea[placeholder*="<div"]');
    const cssInput = form.querySelector('textarea[placeholder*=".container"]');
    const statusSelect = form.querySelectorAll('select')[2];
    
    // Validation
    if (!titleInput.value.trim()) {
        showNotification('Please enter a question title', 'error');
        return;
    }
    if (!descInput.value.trim()) {
        showNotification('Please enter a description', 'error');
        return;
    }
    if (!topicSelect.value) {
        showNotification('Please select a topic', 'error');
        return;
    }
    if (!difficultySelect.value) {
        showNotification('Please select a difficulty level', 'error');
        return;
    }
    if (!cssInput.value.trim()) {
        showNotification('Please enter expected CSS solution', 'error');
        return;
    }
    
    const questionData = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        topic: topicSelect.value,
        difficulty: difficultySelect.value,
        points: getDifficultyPoints(difficultySelect.value),
        hints: hintsInput.value.split('\n').filter(h => h.trim()),
        initialHTML: htmlInput.value.trim() || '<div class="container">\n  <div class="box">Content</div>\n</div>',
        expectedCSS: cssInput.value.trim(),
        targetImage: generateTargetImageDataURL(htmlInput.value, cssInput.value),
        status: statusSelect.value || 'active'
    };

    try {
        const result = await API.Questions.create(questionData);
        showNotification('Question created successfully!', 'success');
        closeModal('addQuestionModal');
        form.reset();
        document.getElementById('targetPreviewFrame').srcdoc = '';
        loadQuestions();
    } catch (error) {
        console.error('Error creating question:', error);
        showNotification('Error creating question: ' + (error.message || 'Unknown error'), 'error');
    }
}

// Generate target image as data URL from preview
function generateTargetImageDataURL(html, css) {
    const iframe = document.getElementById('targetPreviewFrame');
    try {
        // Return a placeholder or the current preview URL
        return iframe.contentWindow.location.href || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPVwibWlkZGxlXCI+VGFyZ2V0IE91dHB1dDwvdGV4dD48L3N2Zz4=';
    } catch (e) {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPVwibWlkZGxlXCI+VGFyZ2V0IE91dHB1dDwvdGV4dD48L3N2Zz4=';
    }
}

function getDifficultyPoints(difficulty) {
    const points = {
        'beginner': 5,
        'medium': 10,
        'advanced': 20
    };
    return points[difficulty] || 5;
}

// ============================================
// Load Questions from Database
// ============================================
async function loadQuestions() {
    try {
        const response = await API.Questions.getAll();
        const questions = response.data || response;
        
        const tbody = document.querySelector('#games tbody');
        if (!tbody) return;

        tbody.innerHTML = questions.map(q => `
            <tr data-id="${q._id}">
                <td><input type="checkbox"></td>
                <td>
                    <div class="question-cell">
                        <span class="question-title">${q.title}</span>
                        <span class="question-id">#${q.topic.toUpperCase()}-${q._id.slice(-3)}</span>
                    </div>
                </td>
                <td><span class="topic-badge ${q.topic.toLowerCase()}">${q.topic.toUpperCase()}</span></td>
                <td><span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
                <td>${q.points}</td>
                <td>-</td>
                <td><span class="success-rate medium">-</span></td>
                <td><span class="status-badge ${q.status}">${q.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="editQuestion('${q._id}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn preview" onclick="previewQuestion('${q._id}')" title="Preview"><i class="fas fa-eye"></i></button>
                        <button class="action-btn delete" onclick="deleteQuestion('${q._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        showNotification(`Loaded ${questions.length} questions`, 'success');
    } catch (error) {
        console.error('Error loading questions:', error);
        showNotification('Error loading questions', 'error');
    }
}

// ============================================
// Delete Question
// ============================================
async function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
        await API.Questions.delete(id);
        showNotification('Question deleted successfully!', 'success');
        loadQuestions();
    } catch (error) {
        console.error('Error deleting question:', error);
        showNotification('Error deleting question', 'error');
    }
}

// ============================================
// Edit Question
// ============================================
async function editQuestion(id) {
    window.location.href = `add-question.html?id=${id}`;
}

// ============================================
// Preview Question
// ============================================
function previewQuestion(id) {
    window.open(`play.html?questionId=${id}`, '_blank');
}

// ============================================
// Add/Update Note to Database
// ============================================
async function handleAddNote(form) {
    const title = document.getElementById('noteTitle').value.trim();
    const category = document.getElementById('noteCategory').value;
    const semester = document.getElementById('noteSemester').value.trim();
    const subject = document.getElementById('noteSubject').value.trim();
    const description = document.getElementById('noteDescription').value.trim();
    const fileUrl = document.getElementById('noteFileUrl').value.trim();
    const fileCount = parseInt(document.getElementById('noteFileCount').value) || 1;
    
    if (!title || !category || !fileUrl) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const noteData = {
        title,
        category,
        semester,
        subject,
        description,
        fileUrl,
        fileName: title + '.pdf',
        fileCount
    };

    try {
        if (editingNoteId) {
            // Delete old note and create new one (workaround for update issue)
            await API.Notes.delete(editingNoteId);
            await API.Notes.create(noteData);
            showNotification('Note updated successfully!', 'success');
            editingNoteId = null;
        } else {
            await API.Notes.create(noteData);
            showNotification('Notes added successfully!', 'success');
        }
        
        closeModal('addNoteModal');
        form.reset();
        
        // Reset modal to add mode
        document.querySelector('#addNoteModal .modal-title').textContent = 'Upload Study Notes';
        document.querySelector('#addNoteModal button[type="submit"]').innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Notes';
        
        loadNotes();
    } catch (error) {
        console.error('Error saving notes:', error);
        const errorMsg = error.message || 'Unknown error';
        showNotification('Error saving notes: ' + errorMsg, 'error');
    }
}

// ============================================
// Load Notes from Database
// ============================================
async function loadNotes() {
    try {
        const response = await API.Notes.getAll();
        const notes = response.data || response;
        
        // Store all notes for filtering
        allNotes = notes;
        
        // Update stats dynamically
        updateNotesStats(notes);
        
        const grid = document.querySelector('.notes-admin-grid');
        if (!grid) return;

        if (notes.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No notes found. Add your first note!</p>';
            return;
        }

        grid.innerHTML = notes.map(note => `
            <div class="note-admin-card" data-id="${note._id}">
                <div class="note-admin-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="note-admin-info">
                    <h4>${note.title}</h4>
                    <p>${note.category.toUpperCase()}${note.semester ? ' ' + note.semester : ''} ${note.subject ? '• ' + note.subject : ''}</p>
                    <div class="note-admin-meta">
                        <span><i class="fas fa-download"></i> ${note.downloadCount || 0} downloads</span>
                        <span><i class="fas fa-file"></i> ${note.fileCount || 1} file(s)</span>
                    </div>
                </div>
                <div class="note-admin-actions">
                    <button class="action-btn edit" onclick="editNote('${note._id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn preview" onclick="window.open('${note.fileUrl}', '_blank')" title="Open Link"><i class="fas fa-external-link-alt"></i></button>
                    <button class="action-btn delete" onclick="deleteNote('${note._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        showNotification(`Loaded ${notes.length} notes`, 'success');
    } catch (error) {
        console.error('Error loading notes:', error);
        showNotification('Error loading notes', 'error');
    }
}

// ============================================
// Update Notes Stats Dynamically
// ============================================
function updateNotesStats(notes) {
    const stats = {
        beginner: notes.filter(n => n.category === 'beginner').length,
        bca: notes.filter(n => n.category === 'bca').length,
        mca: notes.filter(n => n.category === 'mca').length,
        placement: notes.filter(n => n.category === 'placement').length,
        interview: notes.filter(n => n.category === 'interview').length
    };
    
    const miniStats = document.querySelectorAll('.mini-stat');
    if (miniStats.length >= 5) {
        miniStats[0].querySelector('.mini-stat-value').textContent = stats.beginner;
        miniStats[1].querySelector('.mini-stat-value').textContent = stats.bca;
        miniStats[2].querySelector('.mini-stat-value').textContent = stats.mca;
        miniStats[3].querySelector('.mini-stat-value').textContent = stats.placement;
        miniStats[4].querySelector('.mini-stat-value').textContent = stats.interview;
    }
}

// ============================================
// Delete Note
// ============================================
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        await API.Notes.delete(id);
        showNotification('Note deleted successfully!', 'success');
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showNotification('Error deleting note', 'error');
    }
}

// ============================================
// Add Video to Database
// ============================================
async function handleAddVideo(form) {
    const title = document.getElementById('videoTitle').value.trim();
    const url = document.getElementById('videoUrl').value.trim();
    const category = document.getElementById('videoCategory').value;
    const duration = document.getElementById('videoDuration').value.trim();
    const channelName = document.getElementById('videoChannel').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    
    if (!title || !url || !category) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const videoData = {
        title,
        url,
        category,
        duration,
        channelName,
        description
    };

    try {
        await API.Videos.create(videoData);
        showNotification('Video added successfully!', 'success');
        closeModal('addVideoModal');
        form.reset();
    } catch (error) {
        console.error('Error adding video:', error);
        showNotification('Error adding video: ' + (error.message || 'Unknown error'), 'error');
    }
}

// ============================================
// Sidebar Navigation
// ============================================
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.admin-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            document.querySelector('.admin-sidebar').classList.remove('open');
            window.location.hash = targetSection;

            // Load data when section is opened
            if (targetSection === 'games') loadQuestions();
            if (targetSection === 'notes') loadNotes();
            if (targetSection === 'videos') loadVideos();
        });
    });
    
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.sidebar-link[data-section="${hash}"]`);
        if (targetLink) targetLink.click();
    }
}

// ============================================
// Sidebar Toggle for Mobile
// ============================================
function initSidebarToggle() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
}

// ============================================
// Modal Functions
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset note form when closing
        if (modalId === 'addNoteModal') {
            editingNoteId = null;
            document.querySelector('#addNoteModal .modal-title').textContent = 'Upload Study Notes';
            document.querySelector('#addNoteModal button[type="submit"]').innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Notes';
            document.getElementById('addNoteForm').reset();
        }
    }
}

function initModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// ============================================
// Notifications
// ============================================
function initNotifications() {
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 32px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.style.cssText = `
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.95rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: 'fa-check-circle' },
        error: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: 'fa-exclamation-circle' },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: 'fa-exclamation-triangle' },
        info: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', icon: 'fa-info-circle' }
    };
    
    const config = colors[type] || colors.info;
    notification.style.background = config.bg;
    notification.style.color = config.color;
    notification.style.border = `1px solid ${config.color}30`;
    
    notification.innerHTML = `
        <i class="fas ${config.icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// ============================================
// Edit Note
// ============================================
let editingNoteId = null;

async function editNote(id) {
    try {
        const response = await API.Notes.getAll();
        const notes = response.data || response;
        const note = notes.find(n => n._id === id);
        
        if (!note) {
            showNotification('Note not found', 'error');
            return;
        }
        
        editingNoteId = id;
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteCategory').value = note.category;
        document.getElementById('noteSemester').value = note.semester || '';
        document.getElementById('noteSubject').value = note.subject || '';
        document.getElementById('noteDescription').value = note.description || '';
        document.getElementById('noteFileUrl').value = note.fileUrl;
        document.getElementById('noteFileCount').value = note.fileCount || 1;
        
        document.querySelector('#addNoteModal .modal-title').textContent = 'Edit Study Notes';
        document.querySelector('#addNoteModal button[type="submit"] i').className = 'fas fa-save';
        document.querySelector('#addNoteModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Notes';
        
        openModal('addNoteModal');
    } catch (error) {
        console.error('Error loading note:', error);
        showNotification('Error loading note', 'error');
    }
}

// ============================================
// Load Videos from Database
// ============================================
async function loadVideos() {
    try {
        const response = await API.Videos.getAll();
        const videos = response.data || response;
        
        const tbody = document.querySelector('#videos tbody');
        if (!tbody) return;

        if (videos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">No videos found. Add your first video!</td></tr>';
            return;
        }

        tbody.innerHTML = videos.map(video => `
            <tr data-id="${video._id}">
                <td>
                    <div class="video-cell">
                        <div class="video-thumb"><i class="fab fa-youtube"></i></div>
                        <span>${video.title}</span>
                    </div>
                </td>
                <td><span class="topic-badge ${video.category}">${video.category.toUpperCase()}</span></td>
                <td>${video.channelName || '-'}</td>
                <td>${video.duration || '-'}</td>
                <td>${new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn preview" onclick="window.open('${video.url}', '_blank')" title="Open Link"><i class="fas fa-external-link-alt"></i></button>
                        <button class="action-btn delete" onclick="deleteVideo('${video._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        showNotification(`Loaded ${videos.length} videos`, 'success');
    } catch (error) {
        console.error('Error loading videos:', error);
        showNotification('Error loading videos', 'error');
    }
}

// ============================================
// Delete Video
// ============================================
async function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
        await API.Videos.delete(id);
        showNotification('Video deleted successfully!', 'success');
        loadVideos();
    } catch (error) {
        console.error('Error deleting video:', error);
        showNotification('Error deleting video', 'error');
    }
}

// Export functions to global scope
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.deleteQuestion = deleteQuestion;
window.editQuestion = editQuestion;
window.previewQuestion = previewQuestion;
window.deleteNote = deleteNote;
window.editNote = editNote;
window.deleteVideo = deleteVideo;
window.logoutAdmin = logoutAdmin;

function logoutAdmin() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

console.log('%c🚀 CodeLinkers Admin Panel - Database Connected', 'font-size: 20px; font-weight: bold; color: #6366f1;');

// ============================================
// Notes Filters
// ============================================
let allNotes = [];

function initNotesFilters() {
    const categoryFilter = document.querySelector('#notes .filter-select:nth-of-type(1)');
    const subjectFilter = document.querySelector('#notes .filter-select:nth-of-type(2)');
    const searchInput = document.querySelector('#notes .filter-search input');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterNotes);
    }
    if (subjectFilter) {
        subjectFilter.addEventListener('change', filterNotes);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterNotes);
    }
}

function filterNotes() {
    const categoryFilter = document.querySelector('#notes .filter-select:nth-of-type(1)');
    const subjectFilter = document.querySelector('#notes .filter-select:nth-of-type(2)');
    const searchInput = document.querySelector('#notes .filter-search input');
    
    const category = categoryFilter?.value.toLowerCase() || '';
    const subject = subjectFilter?.value.toLowerCase() || '';
    const search = searchInput?.value.toLowerCase() || '';
    
    let filtered = allNotes;
    
    if (category) {
        filtered = filtered.filter(note => note.category.toLowerCase() === category);
    }
    
    if (subject) {
        filtered = filtered.filter(note => 
            (note.subject || '').toLowerCase().includes(subject)
        );
    }
    
    if (search) {
        filtered = filtered.filter(note => 
            note.title.toLowerCase().includes(search) ||
            (note.description || '').toLowerCase().includes(search) ||
            (note.subject || '').toLowerCase().includes(search) ||
            (note.semester || '').toLowerCase().includes(search)
        );
    }
    
    renderFilteredNotes(filtered);
}

function renderFilteredNotes(notes) {
    const grid = document.querySelector('.notes-admin-grid');
    if (!grid) return;

    if (notes.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No notes found matching your filters.</p>';
        return;
    }

    grid.innerHTML = notes.map(note => `
        <div class="note-admin-card" data-id="${note._id}">
            <div class="note-admin-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="note-admin-info">
                <h4>${note.title}</h4>
                <p>${note.category.toUpperCase()}${note.semester ? ' ' + note.semester : ''} ${note.subject ? '• ' + note.subject : ''}</p>
                <div class="note-admin-meta">
                    <span><i class="fas fa-download"></i> ${note.downloadCount || 0} downloads</span>
                    <span><i class="fas fa-file"></i> ${note.fileCount || 1} file(s)</span>
                </div>
            </div>
            <div class="note-admin-actions">
                <button class="action-btn edit" onclick="editNote('${note._id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn preview" onclick="window.open('${note.fileUrl}', '_blank')" title="Open Link"><i class="fas fa-external-link-alt"></i></button>
                <button class="action-btn delete" onclick="deleteNote('${note._id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// ============================================
// Target Preview Refresh
// ============================================
function refreshTargetPreview() {
    const htmlCode = document.querySelector('textarea[placeholder*="<div"]').value;
    const cssCode = document.getElementById('expectedCssInput').value;
    
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
        </body>
        </html>
    `;
    
    document.getElementById('targetPreviewFrame').srcdoc = content;
    showNotification('Preview updated!', 'success');
}

// Auto-refresh preview when code changes
document.addEventListener('DOMContentLoaded', function() {
    const htmlInput = document.querySelector('textarea[placeholder*="<div"]');
    const cssInput = document.getElementById('expectedCssInput');
    
    if (htmlInput && cssInput) {
        htmlInput.addEventListener('input', refreshTargetPreview);
        cssInput.addEventListener('input', refreshTargetPreview);
    }
});
