document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.anc-btn');
    const resultDiv = document.getElementById('anc-result');
    const title = document.getElementById('anc-result-title');
    const desc = document.getElementById('anc-result-desc');

    const recommendations = {
        'quiet': {
            title: 'Passive Isolation or No ANC',
            desc: 'In a treated room or quiet space, ANC can sometimes introduce a faint hiss (noise floor). Stick to good closed-back headphones for tracking, or open-backs for mixing.'
        },
        'office': {
            title: 'Feedforward or Light Hybrid ANC',
            desc: 'You need to block out chatter and AC hum, but might still need to hear someone trying to get your attention. Standard ANC will work perfectly.'
        },
        'travel': {
            title: 'Premium Hybrid ANC',
            desc: 'Airplane engines require heavy low-frequency cancellation. Invest in headphones with Hybrid ANC for maximum isolation so you can monitor your audio clearly.'
        }
    };

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const env = btn.getAttribute('data-env');
            if (recommendations[env]) {
                title.textContent = recommendations[env].title;
                desc.textContent = recommendations[env].desc;
                
                resultDiv.style.display = 'block';
                // Trigger animation reset
                resultDiv.style.animation = 'none';
                resultDiv.offsetHeight; /* trigger reflow */
                resultDiv.style.animation = 'slideUpFade 0.3s ease';
            }
        });
    });
});
