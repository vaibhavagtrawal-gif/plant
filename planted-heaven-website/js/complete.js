// PLANTED HEAVEN - COMPLETE WORKING JAVASCRIPT

console.log('🌿 Planted Heaven loaded!');

// ============================================
// MOBILE MENU
// ============================================
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
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

// ============================================
// HERO SLIDER - WORKING
// ============================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(n) {
    if (!slides.length) return;
    
    // Remove active from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Calculate with wrap
    currentSlide = ((n % slides.length) + slides.length) % slides.length;
    
    // Add active
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    console.log('Slide:', currentSlide + 1);
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetInterval();
}

function goToSlide(n) {
    showSlide(n);
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval);
    startAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Initialize slider
if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
    console.log('✅ Slider initialized:', slides.length, 'slides');
}

// ============================================
// SEARCH TOGGLE
// ============================================
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            const input = document.getElementById('mainSearch');
            if (input) input.focus();
        }
    }
}

// ============================================
// CART MANAGEMENT
// ============================================
let cart = JSON.parse(localStorage.getItem('plantedHeavenCart')) || [];

function updateCartCount() {
    const badges = document.querySelectorAll('.cart-badge, .cart-count');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => badge.textContent = total);
}

function addToCart(productId) {
    if (typeof productsDatabase === 'undefined') {
        console.log('Products not loaded yet');
        return;
    }
    
    const product = productsDatabase.find(p => p.id == productId);
    if (!product) return;

    const existing = cart.find(item => item.id == productId);
    
    if (existing) {
        existing.quantity += 1;
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
    showNotification('✅ Added to cart!');
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 1.5rem 2.5rem;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(46, 204, 113, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ============================================
// SCROLL TO TOP
// ============================================
const scrollBtn = document.getElementById('scrollTop');

if (scrollBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// LOAD TRENDING PRODUCTS
// ============================================
function loadTrendingProducts() {
    const container = document.getElementById('trendingProducts');
    if (!container || typeof productsDatabase === 'undefined') return;

    const trending = productsDatabase.filter(p => p.badge === 'BESTSELLER').slice(0, 8);

    container.innerHTML = trending.map(p => `
        <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="min-width: 280px; margin-right: 2rem;">
            <div class="product-badge bestseller">BESTSELLER</div>
            <div class="product-image" style="background-image: url('${p.image}')"></div>
            <div class="product-info">
                <div class="product-category">${p.category.split(' ')[0]}</div>
                <h3>${p.name}</h3>
                <div class="product-rating">
                    <div class="stars">${'⭐'.repeat(Math.floor(p.rating))}</div>
                    <div class="rating-count">(${p.reviews})</div>
                </div>
                <div class="product-price">
                    <span class="price">₹${p.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛒</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// ANIMATIONS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadTrendingProducts();
    console.log('✅ All features initialized!');
});

// Make functions global
window.toggleSearch = toggleSearch;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.addToCart = addToCart;
