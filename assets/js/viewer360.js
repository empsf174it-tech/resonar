document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('viewer360');
    if (!container) return;

    const frameIndicator = document.getElementById('v-frame');
    const playPauseBtn = document.getElementById('v-play-pause');
    const playIcon = '<i class="ph ph-play-circle"></i>';
    const pauseIcon = '<i class="ph ph-pause-circle"></i>';

    const TOTAL_FRAMES = 36;
    let currentFrame = 1;
    let isDragging = false;
    let startX = 0;
    let isPlaying = false;
    let playInterval;
    
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configurable frame list (Documented: supply 36 real URLs for prod)
    const frameUrls = Array(TOTAL_FRAMES).fill('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800');
    
    // Inject images
    frameUrls.forEach((url, i) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Product frame ${i + 1}`;
        img.draggable = false;
        if (i === 0) img.classList.add('active');
        // Insert before the overlay
        container.insertBefore(img, container.querySelector('.viewer-overlay'));
    });

    const images = container.querySelectorAll('img');

    function updateFrame(index) {
        images[currentFrame - 1].classList.remove('active');
        currentFrame = index;
        images[currentFrame - 1].classList.add('active');
        if (frameIndicator) frameIndicator.textContent = currentFrame;
    }

    function nextFrame() {
        let next = currentFrame + 1;
        if (next > TOTAL_FRAMES) next = 1;
        updateFrame(next);
    }

    function prevFrame() {
        let prev = currentFrame - 1;
        if (prev < 1) prev = TOTAL_FRAMES;
        updateFrame(prev);
    }

    function togglePlay() {
        if (isPlaying) {
            clearInterval(playInterval);
            isPlaying = false;
            if (playPauseBtn) playPauseBtn.innerHTML = playIcon;
        } else {
            playInterval = setInterval(nextFrame, 100); // 10fps
            isPlaying = true;
            if (playPauseBtn) playPauseBtn.innerHTML = pauseIcon;
        }
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
    }

    // Interaction handlers
    function handleStart(x) {
        isDragging = true;
        startX = x;
        if (isPlaying) togglePlay(); // pause on drag
    }

    function handleMove(x) {
        if (!isDragging) return;
        const diff = x - startX;
        
        // sensitivity: change frame every 10px
        if (Math.abs(diff) > 10) {
            if (diff > 0) prevFrame();
            else nextFrame();
            startX = x;
        }
    }

    function handleEnd() {
        isDragging = false;
    }

    // Mouse
    container.addEventListener('mousedown', (e) => handleStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', handleEnd);

    // Touch
    container.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), {passive: true});
    window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), {passive: true});
    window.addEventListener('touchend', handleEnd);

    // Keyboard (Focus required, set tabindex="0" on container)
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextFrame();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevFrame();
        }
    });
});
