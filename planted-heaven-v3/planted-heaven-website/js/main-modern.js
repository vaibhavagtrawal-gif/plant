// MODERN JAVASCRIPT FOR PLANTED HEAVEN V2

// Mobile Menu
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Search Toggle
function toggleSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        document.getElementById('mainSearch').focus();
    }
}

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(n) {
    showSlide(n);
}

// Auto-rotate slider
setInterval(() => {
    changeSlide(1);
}, 5000);

// Load Trending Products
function loadTrendingProducts() {
    const container = document.getElementById('trendingProducts');
    if (!container) return;

    const trending = productsDatabase
        .filter(p => p.badge === 'BESTSELLER')
        .slice(0, 8);

    container.innerHTML = trending.map(product => `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'" style="min-width: 280px; margin-right: 2rem;">
            <div class="product-badge bestseller">BESTSELLER</div>
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

// Cart Management
let cart = JSON.parse(localStorage.getItem('plantedHeavenCart')) || [];

function updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

function addToCart(productId) {
    const product = productsDatabase.find(p => p.id == productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('plantedHeavenCart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart! 🛒');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(46, 204, 113, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll to Top
const scrollTop = document.getElementById('scrollTop');

if (scrollTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadTrendingProducts();
});
