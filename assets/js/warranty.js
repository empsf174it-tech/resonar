document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('warranty-form');
    if (!form) return;

    // Prefill if logged in
    const sessionStr = localStorage.getItem('resonar_session');
    const guestPrompt = document.getElementById('guest-prompt');
    
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            if (session.name) document.getElementById('w-name').value = session.name;
            if (session.email) document.getElementById('w-email').value = session.email;
            if (guestPrompt) guestPrompt.style.display = 'none';
        } catch(e) {}
    } else {
        if (guestPrompt) guestPrompt.style.display = 'inline-block';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('w-name').value;
        const email = document.getElementById('w-email').value;
        const product = document.getElementById('w-product').value;
        const serial = document.getElementById('w-serial').value.toUpperCase();
        const date = document.getElementById('w-date').value;
        const terms = document.getElementById('w-terms').checked;
        
        let isValid = true;

        if (!name) { showError('w-name', 'Name is required'); isValid = false; } else clearError('w-name');
        if (!email || !email.includes('@')) { showError('w-email', 'Valid email required'); isValid = false; } else clearError('w-email');
        if (!product) { showError('w-product', 'Select a product'); isValid = false; } else clearError('w-product');
        
        // Serial Validation
        const serialRegex = /^RES-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!serialRegex.test(serial)) {
            showError('w-serial', 'Format must be RES-XXXX-XXXX');
            isValid = false;
        } else {
            clearError('w-serial');
        }

        // Date Validation
        if (!date) {
            showError('w-date', 'Date is required');
            isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 5); // max 5 years old
            
            if (selectedDate > today) {
                showError('w-date', 'Purchase date cannot be in the future');
                isValid = false;
            } else if (selectedDate < minDate) {
                showError('w-date', 'Purchase date is too old for warranty registration');
                isValid = false;
            } else {
                clearError('w-date');
            }
        }

        if (!terms) {
            showError('w-terms', 'You must agree to the terms');
            isValid = false;
        } else {
            clearError('w-terms');
        }

        if (isValid) {
            // Generate Reference
            const ref = 'WAR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            
            // Save to localStorage
            const warranties = JSON.parse(localStorage.getItem('resonar_warranties') || '[]');
            warranties.push({
                product: product,
                serial: serial,
                date: date,
                ref: ref,
                registeredOn: new Date().toISOString()
            });
            localStorage.setItem('resonar_warranties', JSON.stringify(warranties));

            // Show Success
            form.style.display = 'none';
            document.getElementById('ref-number').textContent = ref;
            document.getElementById('warranty-success').style.display = 'block';
        }
    });
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

// Terms checkbox has its error right after its box; other fields keep it inside their .form-group
function getErrorEl(input) {
    if (input.id === 'w-terms') return input.parentNode.nextElementSibling;
    return input.closest('.form-group').querySelector('.error-msg');
}
