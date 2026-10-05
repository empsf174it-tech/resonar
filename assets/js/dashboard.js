document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup user info
    const sessionStr = localStorage.getItem('resonar_session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            const nameEl = document.getElementById('user-name');
            if (nameEl && session.name) {
                nameEl.textContent = session.name;
            }
        } catch (e) {
            console.error('Session parse error');
        }
    }

    // 2. Tab switching
    const buttons = document.querySelectorAll('.dash-nav button');
    const sections = document.querySelectorAll('.dash-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
            
            // Re-draw chart if analytics tab
            if (target === 'analytics') {
                drawChart();
            }
        });
    });

    // 3. Load warranties
    loadWarranties();

    // 4. Draw chart (delay slightly to ensure it's visible)
    setTimeout(drawChart, 100);
});

function loadWarranties() {
    const list = document.getElementById('warranty-list');
    if (!list) return;

    const warranties = JSON.parse(localStorage.getItem('resonar_warranties') || '[]');
    
    if (warranties.length === 0) {
        list.innerHTML = `
            <div style="padding: var(--space-4); background-color: var(--bg-primary); border-radius: var(--radius); text-align: center; color: var(--text-secondary);">
                You haven't registered any products yet.
            </div>
        `;
        return;
    }

    list.innerHTML = warranties.map(w => `
        <div style="padding: var(--space-4); background-color: var(--bg-primary); border-radius: var(--radius); border: 1px solid var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
            <div>
                <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${w.product}</h3>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">Serial: <span class="tabular">${w.serial}</span> | Purchased: ${w.date}</p>
            </div>
            <div class="badge badge-primary">Active</div>
        </div>
    `).join('');
}

function drawChart() {
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) return;
    
    // Ensure actual size matches display size for sharpness
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 300; // Fixed height

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Mock data points
    const data = [40, 60, 45, 80, 70, 110, 95, 130, 120, 160];
    const maxVal = Math.max(...data) * 1.2;
    const padding = 40;
    const chartW = width - (padding * 2);
    const chartH = height - (padding * 2);

    // Draw grid
    ctx.strokeStyle = '#2a2a35';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartH / 4) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        
        // Labels
        ctx.fillStyle = '#a0a0b0';
        ctx.font = '12px "Space Grotesk"';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const val = Math.floor(maxVal - (maxVal / 4) * i);
        ctx.fillText(val, padding - 10, y);
    }
    ctx.stroke();

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    data.forEach((val, i) => {
        const x = padding + (chartW / (data.length - 1)) * i;
        const y = padding + chartH - ((val / maxVal) * chartH);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw fill
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw points
    data.forEach((val, i) => {
        const x = padding + (chartW / (data.length - 1)) * i;
        const y = padding + chartH - ((val / maxVal) * chartH);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0c';
        ctx.fill();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Window resize re-draw
window.addEventListener('resize', () => {
    if (document.getElementById('analytics').classList.contains('active')) {
        drawChart();
    }
});
