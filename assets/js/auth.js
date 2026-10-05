document.addEventListener('DOMContentLoaded', () => {
    // Page guards
    const currentPath = window.location.pathname;
    const isDashboard = currentPath.endsWith('dashboard.html');
    const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('register.html');
    
    const session = localStorage.getItem('resonar_session');

    if (isDashboard && !session) {
        window.location.href = 'login.html';
        return;
    }

    if (isAuthPage && session) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Password show/hide toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentNode.querySelector('input');
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.setAttribute('aria-pressed', String(show));
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
            btn.querySelector('i').className = show ? 'ph ph-eye-slash' : 'ph ph-eye';
        });
    });

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            let isValid = true;

            // Simple validation
            if (!email || !email.includes('@')) {
                showError('email', 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError('email');
            }

            if (!password || password.length < 8) {
                showError('password', 'Password must be at least 8 characters.');
                isValid = false;
            } else {
                clearError('password');
            }

            if (isValid) {
                // Mock login
                localStorage.setItem('resonar_session', JSON.stringify({ email: email, name: email.split('@')[0] }));
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            let isValid = true;

            if (!name) {
                showError('name', 'Name is required.');
                isValid = false;
            } else {
                clearError('name');
            }

            if (!email || !email.includes('@')) {
                showError('email', 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError('email');
            }

            if (!password || password.length < 8) {
                showError('password', 'Password must be at least 8 characters.');
                isValid = false;
            } else {
                clearError('password');
            }

            if (password !== confirm) {
                showError('confirm-password', 'Passwords do not match.');
                isValid = false;
            } else {
                clearError('confirm-password');
            }
            
            if (!terms) {
                showError('terms', 'You must agree to the terms.');
                isValid = false;
            } else {
                clearError('terms');
            }

            if (isValid) {
                // Mock registration
                localStorage.setItem('resonar_session', JSON.stringify({ email: email, name: name }));
                window.location.href = 'dashboard.html';
            }
        });
    }
});

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.add('form-error');
    input.classList.remove('form-success');
    
    const errorEl = getErrorEl(input);
    
    if (errorEl && errorEl.classList.contains('error-msg')) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.remove('form-error');
    input.classList.add('form-success');
    
    const errorEl = getErrorEl(input);
    
    if (errorEl && errorEl.classList.contains('error-msg')) {
        errorEl.style.display = 'none';
    }
}

// Terms checkbox has its error right after its row; other fields keep it inside their .form-group
function getErrorEl(input) {
    if (input.id === 'terms') return input.parentNode.nextElementSibling;
    return input.closest('.form-group').querySelector('.error-msg');
}
