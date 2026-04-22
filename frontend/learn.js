// Learn Coding Page - Load Videos from Database
document.addEventListener('DOMContentLoaded', async () => {
    await loadVideos();
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 500);
});

async function loadVideos() {
    try {
        const response = await API.Videos.getAll();
        const videos = response.data || response;
        
        console.log('Videos loaded:', videos.length);
        
        // Group by category
        const grouped = {};
        videos.forEach(video => {
            const cat = video.category.toLowerCase();
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(video);
        });
        
        // Render each category
        const categories = ['html', 'css', 'javascript', 'dsa', 'dbms', 'python'];
        categories.forEach(category => {
            renderVideos(category, grouped[category] || []);
        });
        
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function renderVideos(category, videos) {
    const container = document.querySelector(`[data-category="${category}"]`);
    if (!container) return;
    
    if (videos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-video" style="font-size: 48px; color: var(--primary); opacity: 0.5; margin-bottom: 16px;"></i>
                <h3 style="font-size: 20px; margin-bottom: 8px;">Coming Soon</h3>
                <p style="color: var(--text-secondary);">Videos will be added soon</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = videos.map(video => createVideoCard(video)).join('');
}

function createVideoCard(video) {
    const videoId = getYouTubeVideoId(video.url);
    
    return `
        <div class="card video-card" style="opacity: 1; transform: none;">
            <div class="video-thumbnail" onclick="playVideo('${videoId}', '${video.title.replace(/'/g, "\\'")}')"
                 style="background-image: url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg'); background-size: cover; background-position: center; cursor: pointer;">
                <div class="play-overlay">
                    <i class="fab fa-youtube"></i>
                </div>
                ${video.duration ? `<span class="video-duration">${video.duration}</span>` : ''}
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description || 'Watch this tutorial to learn more'}</p>
                <div class="video-meta">
                    <span><i class="fas fa-user"></i> ${video.channelName || 'YouTube'}</span>
                    ${video.duration ? `<span><i class="fas fa-clock"></i> ${video.duration}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function getYouTubeVideoId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
}

function playVideo(videoId, title) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'z-index: 10000; backdrop-filter: blur(8px); background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; opacity: 0; transition: opacity 0.3s ease;';
    modal.innerHTML = `
        <div style="width: 100%; max-width: 1200px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; margin: auto; transform: scale(0.9); transition: transform 0.3s ease;">
            <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.3);">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ff0000, #cc0000); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: pulse 2s infinite;">
                        <i class="fab fa-youtube" style="color: white; font-size: 18px;"></i>
                    </div>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${title}</h2>
                </div>
                <button onclick="this.closest('.modal-overlay').style.opacity='0'; setTimeout(() => { this.closest('.modal-overlay').remove(); document.body.style.overflow=''; }, 300);" style="width: 36px; height: 36px; border-radius: 8px; border: none; background: rgba(255, 255, 255, 0.1); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px; flex-shrink: 0; margin-left: 12px;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'; this.style.color='#ef4444'; this.style.transform='rotate(90deg)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.color='var(--text-primary)'; this.style.transform='rotate(0deg)'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding: 20px; background: rgba(0, 0, 0, 0.2);">
                <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: linear-gradient(135deg, #1e1e1e, #2d2d2d); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); border: 2px solid rgba(99, 102, 241, 0.3);">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1;">
                        <div style="width: 60px; height: 60px; border: 3px solid rgba(99, 102, 241, 0.3); border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 2;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        onload="this.previousElementSibling.style.display='none'">
                    </iframe>
                </div>
                <div style="margin-top: 16px; padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: 10px; border-left: 3px solid #6366f1; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-lightbulb" style="color: #fbbf24; font-size: 16px; animation: glow 2s infinite;"></i>
                    <span style="color: var(--text-secondary); font-size: 13px; flex: 1;">Press <kbd style="padding: 2px 6px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">ESC</kbd> or click outside to close</span>
                    <button onclick="this.closest('iframe').requestFullscreen()" style="padding: 6px 12px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 6px; color: #6366f1; cursor: pointer; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 6px;" onmouseover="this.style.background='rgba(99, 102, 241, 0.3)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='rgba(99, 102, 241, 0.2)'; this.style.transform='scale(1)'">
                        <i class="fas fa-expand"></i> Fullscreen
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escHandler);
            }, 300);
        }
    });
}

window.playVideo = playVideo;
