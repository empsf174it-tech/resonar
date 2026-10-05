const shopProducts = [
    { id: 'mic-1', name: 'Aether M-1 Condenser', price: 299, category: 'microphones', brand: 'aether', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600', badge: 'Best Seller' },
    { id: 'mic-2', name: 'Echo V-Dynamic', price: 199, category: 'microphones', brand: 'void', image: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?auto=format&fit=crop&q=80&w=600' },
    { id: 'int-1', name: 'Synapse Core Interface', price: 189, category: 'interfaces', brand: 'synapse', image: 'https://images.unsplash.com/photo-1640756883978-e9b6ddc8f91f?auto=format&fit=crop&q=80&w=600' },
    { id: 'head-1', name: 'Void 7X Reference Cans', price: 249, category: 'headphones', brand: 'void', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
    { id: 'head-2', name: 'Silence Pro Hybrid ANC', price: 349, category: 'headphones', brand: 'aether', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600' },
    { id: 'mix-1', name: 'Nexus 4-Channel Desk', price: 499, category: 'mixers', brand: 'synapse', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get('category');
    if (urlCat) {
        const cb = document.querySelector(`input[value="${urlCat}"]`);
        if (cb) cb.checked = true;
    }

    // Attach listeners
    document.querySelectorAll('.filter-cb').forEach(cb => {
        cb.addEventListener('change', renderGrid);
    });
    
    document.getElementById('min-price').addEventListener('input', renderGrid);
    document.getElementById('max-price').addEventListener('input', renderGrid);
    document.getElementById('sort').addEventListener('change', renderGrid);
    
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('.filter-cb').forEach(cb => cb.checked = false);
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('sort').value = 'featured';
        // clear url params without reload
        window.history.pushState({}, document.title, window.location.pathname);
        renderGrid();
    });

    // Collapsible filter panel (toggle is only visible at 768px and below)
    const filterToggle = document.getElementById('filter-toggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            const open = filterToggle.getAttribute('aria-expanded') !== 'true';
            filterToggle.setAttribute('aria-expanded', String(open));
            filterToggle.closest('.shop-sidebar').classList.toggle('filters-open', open);
        });
    }

    renderGrid();
});

// Badge on the Filters toggle showing how many filters are active
function updateFilterCount() {
    const countEl = document.getElementById('filter-count');
    if (!countEl) return;
    let count = document.querySelectorAll('.filter-cb:checked').length;
    if (document.getElementById('min-price').value) count++;
    if (document.getElementById('max-price').value) count++;
    countEl.textContent = count;
    countEl.hidden = count === 0;
}

function renderGrid() {
    updateFilterCount();
    const grid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    // Get active filters
    const activeCats = Array.from(document.querySelectorAll('input[id^="cat-"]:checked')).map(cb => cb.value);
    const activeBrands = Array.from(document.querySelectorAll('input[id^="b-"]:checked')).map(cb => cb.value);
    const minP = parseFloat(document.getElementById('min-price').value) || 0;
    const maxP = parseFloat(document.getElementById('max-price').value) || Infinity;
    const sort = document.getElementById('sort').value;

    // Filter
    let filtered = shopProducts.filter(p => {
        if (activeCats.length > 0 && !activeCats.includes(p.category)) return false;
        if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) return false;
        if (p.price < minP || p.price > maxP) return false;
        return true;
    });

    // Sort
    if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } // 'featured' keeps original order

    // Render
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        resultsCount.textContent = '0 items found';
    } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
        resultsCount.textContent = `Showing ${filtered.length} item${filtered.length > 1 ? 's' : ''}`;
        
        filtered.forEach(p => {
            const badgeStr = p.badge ? `<div class="badge badge-primary">${p.badge}</div>` : '';
            grid.innerHTML += `
                <div class="card">
                    <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy">
                    ${badgeStr}
                    <h3 class="card-title" style="font-size: 1.125rem;">${p.name}</h3>
                    <p class="price tabular">$${p.price.toFixed(2)}</p>
                    <a href="product-detail.html?id=${p.id}" class="btn btn-secondary" style="width: 100%;">View Details</a>
                </div>
            `;
        });
    }
}
