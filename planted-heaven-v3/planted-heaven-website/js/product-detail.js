// PRODUCT DETAIL PAGE JAVASCRIPT

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProduct(productId);
        loadRelatedProducts(productId);
    }
});

function loadProduct(productId) {
    const product = productsDatabase.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Update page title
    document.title = `${product.name} - Planted Heaven`;
    
    // Update breadcrumb
    document.getElementById('productName').textContent = product.name;
    
    // Update main image
    document.getElementById('mainImage').innerHTML = `
        <img src="${product.image}" alt="${product.name}">
    `;
    
    // Update thumbnails
    const thumbnails = document.getElementById('thumbnails');
    const images = [product.image, product.image, product.image, product.image]; // Placeholder
    thumbnails.innerHTML = images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
            <img src="${img}" alt="View ${index + 1}">
        </div>
    `).join('');
    
    // Update badge
    if (product.badge) {
        document.getElementById('productBadge').textContent = product.badge;
        document.getElementById('productBadge').style.display = 'inline-block';
    }
    
    // Update title
    document.getElementById('productTitle').textContent = product.name;
    
    // Update price
    document.getElementById('productPrice').textContent = `₹${product.price.toLocaleString()}`;
    
    // Update description
    document.getElementById('productDescription').innerHTML = `<p>${product.description}</p>`;
    document.getElementById('fullDescription').innerHTML = `
        <p>${product.description}</p>
        <p>This beautiful plant is perfect for homes, offices, and gifting. Carefully selected and nurtured to ensure the highest quality.</p>
        <p><strong>What's Included:</strong> ${product.specs}</p>
    `;
    
    // Update specs
    document.getElementById('productSpecs').innerHTML = `
        <h4>Specifications</h4>
        <div class="spec-item">
            <span>Size:</span>
            <span>${product.specs}</span>
        </div>
        <div class="spec-item">
            <span>Category:</span>
            <span>${product.category}</span>
        </div>
        <div class="spec-item">
            <span>Care Level:</span>
            <span>Easy to Moderate</span>
        </div>
    `;
    
    // Update category and SKU
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productSKU').textContent = `PH-${product.id.toString().padStart(4, '0')}`;
}

function changeMainImage(imageSrc, thumbnail) {
    document.getElementById('mainImage').innerHTML = `
        <img src="${imageSrc}" alt="Product Image">
    `;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

function loadRelatedProducts(currentProductId) {
    const currentProduct = productsDatabase.find(p => p.id === currentProductId);
    const related = productsDatabase
        .filter(p => p.id !== currentProductId && p.category.split(' ').some(cat => currentProduct.category.includes(cat)))
        .slice(0, 4);
    
    const grid = document.getElementById('relatedProducts');
    grid.innerHTML = related.map(product => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image" style="background-image: url('${product.image}')"></div>
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
}

function increaseQty() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const quantity = parseInt(document.getElementById('quantity').value);
    
    for (let i = 0; i < quantity; i++) {
        addToCart(productId);
    }
}

function toggleWishlist() {
    const btn = document.querySelector('.btn-wishlist-detail');
    btn.textContent = btn.textContent === '❤️' ? '💚' : '❤️';
    showNotification(btn.textContent === '💚' ? 'Added to wishlist!' : 'Removed from wishlist');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}
