document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateCartCount();
    setupFooterYear();
    initCtaReveal();
    initBackToTop();
});

function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const drawerClose = document.createElement('button');
    drawerClose.className = 'drawer-close';
    drawerClose.innerHTML = '<i class="ph ph-x"></i>';
    drawerClose.setAttribute('aria-label', 'Close menu');
    
    if (navMenu) {
        navMenu.prepend(drawerClose);
    }

    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        navMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
        drawerClose.focus();
    }

    function closeMenu() {
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    }

    if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.addEventListener('click', openMenu);
    }

    drawerClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // Dropdowns on mobile (Accordion)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                    trigger.setAttribute('aria-expanded', !isExpanded);
                }
            });

            // Keyboard accessibility for desktop
            trigger.addEventListener('keydown', (e) => {
                if (window.innerWidth > 1024 && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // Update Login button if session exists
    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn) {
        const session = localStorage.getItem('resonar_session');
        if (session) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
            
            // Create logout button next to it
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-secondary';
            logoutBtn.style.padding = '0 16px';
            logoutBtn.style.height = '48px';
            logoutBtn.innerHTML = '<i class="ph ph-sign-out"></i>';
            logoutBtn.title = 'Logout';
            logoutBtn.onclick = () => {
                localStorage.removeItem('resonar_session');
                window.location.reload();
            };
            loginBtn.parentNode.appendChild(logoutBtn);
        }
    }
}

function updateCartCount() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const cart = JSON.parse(localStorage.getItem('resonar_cart') || '[]');
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        countEl.textContent = totalItems;
        if (totalItems === 0) {
            countEl.style.display = 'none';
        } else {
            countEl.style.display = 'flex';
        }
    }
}

function setupFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function initCtaReveal() {
    const banner = document.querySelector('.cta-banner');
    if (!banner || !('IntersectionObserver' in window)) return;

    banner.classList.add('is-hidden');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                banner.classList.remove('is-hidden');
                banner.classList.add('in-view');
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(banner);
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="ph-bold ph-arrow-up"></i>';
    document.body.appendChild(btn);

    const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
}
