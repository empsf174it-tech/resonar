const productsData = [
    {
        id: 'mic-1',
        name: 'Aether M-1 Condenser',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=200',
        price: '$299.00',
        category: 'Microphone',
        specs: {
            freq: '20Hz - 20kHz',
            impedance: '150 Ohms',
            sensitivity: '-34 dBV/Pa',
            pattern: 'Cardioid',
            connection: 'XLR',
            anc: false,
            weight: '450g'
        },
        award: 'Best Overall'
    },
    {
        id: 'mic-2',
        name: 'Echo V-Dynamic',
        image: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?auto=format&fit=crop&q=80&w=200',
        price: '$199.00',
        category: 'Microphone',
        specs: {
            freq: '50Hz - 18kHz',
            impedance: '320 Ohms',
            sensitivity: '-54 dBV/Pa',
            pattern: 'Supercardioid',
            connection: 'XLR / USB-C',
            anc: false,
            weight: '620g'
        },
        award: 'Best Value'
    },
    {
        id: 'head-1',
        name: 'Void 7X Reference',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200',
        price: '$249.00',
        category: 'Headphones',
        specs: {
            freq: '15Hz - 25kHz',
            impedance: '80 Ohms',
            sensitivity: '98 dB/mW',
            pattern: 'N/A',
            connection: '3.5mm / 6.35mm',
            anc: false, // passive
            weight: '280g'
        },
        award: null
    },
    {
        id: 'head-2',
        name: 'Silence Pro Hybrid ANC',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200',
        price: '$349.00',
        category: 'Headphones',
        specs: {
            freq: '20Hz - 20kHz',
            impedance: '32 Ohms',
            sensitivity: '105 dB/mW',
            pattern: 'N/A',
            connection: 'Bluetooth 5.3 / 3.5mm',
            anc: true,
            weight: '255g'
        },
        award: null
    }
];

let selectedSlots = ['mic-1', 'mic-2', '', ''];

document.addEventListener('DOMContentLoaded', () => {
    initSelectors();
    renderTable();

    document.getElementById('reset-compare').addEventListener('click', () => {
        selectedSlots = ['mic-1', 'mic-2', '', ''];
        updateSelectors();
        renderTable();
    });
});

function initSelectors() {
    for (let i = 1; i <= 4; i++) {
        const select = document.getElementById(`slot-${i}`);
        if (!select) continue;
        
        select.innerHTML = '<option value="">-- Empty Slot --</option>';
        productsData.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });

        select.addEventListener('change', (e) => {
            selectedSlots[i-1] = e.target.value;
            renderTable();
        });
    }
    updateSelectors();
}

function updateSelectors() {
    for (let i = 1; i <= 4; i++) {
        const select = document.getElementById(`slot-${i}`);
        if (select) select.value = selectedSlots[i-1];
    }
}

function renderTable() {
    const table = document.getElementById('compare-table');
    if (!table) return;

    // Filter out empties and map to data
    const activeProducts = selectedSlots
        .map(id => productsData.find(p => p.id === id))
        .filter(p => p !== undefined);

    if (activeProducts.length === 0) {
        table.style.minWidth = '';
        table.innerHTML = '<tr><td class="compare-empty" style="position: static;"><i class="ph ph-scales"></i>Select at least one product to compare.</td></tr>';
        return;
    }

    // Size columns to the number of products so few items don't stretch
    table.style.minWidth = `${220 + activeProducts.length * 220}px`;

    // Only the first award winner gets the highlighted "top pick" column
    const topPick = activeProducts.find(p => p.award);
    const colClass = p => (p === topPick ? 'highlight-col' : '');

    let colgroup = '<colgroup><col class="label-col">';
    activeProducts.forEach(() => { colgroup += '<col>'; });
    colgroup += '</colgroup>';

    // Build Header
    let thead = `<thead><tr><th><div class="features-heading">Features<small>${activeProducts.length} of 4 slots used</small></div></th>`;
    activeProducts.forEach(p => {
        const badge = p.award
            ? `<span class="best-badge"><i class="ph-fill ph-trophy"></i>${p.award}</span>`
            : '<span class="badge-placeholder"></span>';
        thead += `
            <th class="${colClass(p)}">
                <div class="product-head">
                    ${badge}
                    <img src="${p.image}" class="product-img-small" alt="${p.name}">
                    <div class="product-name">${p.name}</div>
                    <span class="category-chip">${p.category}</span>
                    <div class="head-price tabular">${p.price}</div>
                    <button class="remove-btn" onclick="removeSlot('${p.id}')" aria-label="Remove ${p.name}"><i class="ph ph-x"></i></button>
                </div>
            </th>
        `;
    });
    thead += '</tr></thead>';

    // Build Rows
    const rows = [
        { label: 'Frequency Response', key: 'specs.freq', icon: 'ph-wave-sine' },
        { label: 'Impedance', key: 'specs.impedance', icon: 'ph-lightning' },
        { label: 'Sensitivity', key: 'specs.sensitivity', icon: 'ph-speaker-high' },
        { label: 'Polar Pattern', key: 'specs.pattern', icon: 'ph-target' },
        { label: 'Connection', key: 'specs.connection', icon: 'ph-plugs-connected' },
        { label: 'Active Noise Cancellation', key: 'specs.anc', icon: 'ph-ear-slash', isBool: true },
        { label: 'Weight', key: 'specs.weight', icon: 'ph-scales' }
    ];

    let tbody = '<tbody>';
    rows.forEach(row => {
        tbody += `<tr><td><span class="spec-label"><i class="ph ${row.icon}"></i>${row.label}</span></td>`;
        activeProducts.forEach(p => {
            let val = getNestedValue(p, row.key);

            if (row.isBool) {
                val = val
                    ? '<span class="spec-bool spec-true"><i class="ph-bold ph-check"></i>Yes</span>'
                    : '<span class="spec-bool spec-false"><i class="ph-bold ph-minus"></i>No</span>';
            }

            tbody += `<td class="${colClass(p)}">${val}</td>`;
        });
        tbody += '</tr>';
    });
    tbody += '</tbody>';

    // Build Actions Row
    let tfoot = '<tfoot><tr><td></td>';
    activeProducts.forEach(p => {
        const btnClass = p === topPick ? 'btn-primary' : 'btn-secondary';
        tfoot += `<td class="${colClass(p)}">
            <a href="product-detail.html?id=${p.id}" class="btn ${btnClass}">View Details</a>
        </td>`;
    });
    tfoot += '</tr></tfoot>';

    table.innerHTML = colgroup + thead + tbody + tfoot;
}

function removeSlot(id) {
    const index = selectedSlots.indexOf(id);
    if (index > -1) {
        selectedSlots[index] = '';
        updateSelectors();
        renderTable();
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
