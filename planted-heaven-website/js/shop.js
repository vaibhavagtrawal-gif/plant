// SHOP PAGE JAVASCRIPT

let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [...productsDatabase];

// Initialize shop
document.addEventListener('DOMContentLoaded', function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Set the checkbox for this category
        const checkbox = document.querySelector(`input[value="${category}"]`);
        if (checkbox) checkbox.checked = true;
    }
    
    filterProducts();
    displayProducts();
});

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedCategories = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .filter(cb => cb.value !== '0-1000' && cb.value !== '1000-2000' && cb.value !== '2000-3000' && cb.value !== '3000-5000' && cb.value !== '5000+' && cb.value !== 'small' && cb.value !== 'medium' && cb.value !== 'large')
        .map(cb => cb.value);
    
    const selectedPriceRanges = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .filter(cb => ['0-1000', '1000-2000', '2000-3000', '3000-5000', '5000+'].includes(cb.value))
        .map(cb => cb.value);
    
    const selectedSizes = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .filter(cb => ['small', 'medium', 'large'].includes(cb.value))
        .map(cb => cb.value);

    filteredProducts = productsDatabase.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = selectedCategories.length === 0 || 
                               selectedCategories.some(cat => product.category.includes(cat));
        
        // Price filter
        let matchesPrice = selectedPriceRanges.length === 0;
        if (!matchesPrice) {
            matchesPrice = selectedPriceRanges.some(range => {
                if (range === '0-1000') return product.price < 1000;
                if (range === '1000-2000') return product.price >= 1000 && product.price < 2000;
                if (range === '2000-3000') return product.price >= 2000 && product.price < 3000;
                if (range === '3000-5000') return product.price >= 3000 && product.price < 5000;
                if (range === '5000+') return product.price >= 5000;
                return false;
            });
        }
        
        // Size filter
        const matchesSize = selectedSizes.length === 0 || 
                           selectedSizes.includes(product.size);
        
        return matchesSearch && matchesCategory && matchesPrice && matchesSize;
    });

    currentPage = 1;
    displayProducts();
    updatePagination();
}

// Sort Products
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        default: // featured
            filteredProducts.sort((a, b) => {
                if (a.badge === 'BESTSELLER' && b.badge !== 'BESTSELLER') return -1;
                if (a.badge !== 'BESTSELLER' && b.badge === 'BESTSELLER') return 1;
                return 0;
            });
    }
    
    displayProducts();
}

// Display Products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            ${product.badge ? `<div class="product-badge ${product.badge === 'BESTSELLER' ? 'bestseller' : ''}">${product.badge}</div>` : ''}
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-quick-view">Quick View</div>
            <div class="product-info">
                <div class="product-category">${product.category.split(' ')[0]}</div>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${'⭐'.repeat(Math.floor(product.rating))}</div>
                    <div class="rating-count">(${product.reviews})</div>
                </div>
                <div class="product-price">
                    <span class="price">₹${product.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">🛒</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update count
    document.getElementById('productCount').textContent = filteredProducts.length;
}

// Update Pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})">← Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<button disabled>...</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})">Next →</button>`;
    }
    
    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayProducts();
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Clear all filters
function clearFilters() {
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('searchInput').value = '';
    filterProducts();
}

// Toggle filters on mobile
function toggleFilters() {
    const sidebar = document.querySelector('.shop-sidebar');
    sidebar.classList.toggle('active');
}
