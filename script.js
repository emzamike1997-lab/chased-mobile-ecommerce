// ===== Product Data =====
const products = [
    { id: 1, name: 'Classic Black Ankle Boots', price: 89.99, category: 'boots', image: 'assets/boot1.png' },
    { id: 2, name: 'Brown Suede Knee-High Boots', price: 129.99, category: 'boots', image: 'assets/boot2.png' },
    { id: 3, name: 'White Leather Sneaker Boots', price: 79.99, category: 'boots', image: 'assets/boot3.png' },
    { id: 4, name: 'Luxury Camel Leather Handbag', price: 199.99, category: 'bags', image: 'assets/bag1.png' },
    { id: 5, name: 'Black Crossbody Bag', price: 69.99, category: 'bags', image: 'assets/bag2.png' },
    { id: 6, name: 'Burgundy Leather Tote', price: 149.99, category: 'bags', image: 'assets/bag3.png' }
];

// ===== State Management =====
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
let viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let currentCategory = 'all';
let currentSection = 'home';

// ===== DOM Elements =====
const authModal = document.getElementById('authModal');
const negotiatorModal = document.getElementById('negotiatorModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeAuthModal = document.getElementById('closeAuthModal');
const closeNegotiatorModal = document.getElementById('closeNegotiatorModal');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const productGrid = document.getElementById('productGrid');
const sellProductGrid = document.getElementById('sellProductGrid');
const cartItems = document.getElementById('cartItems');
const wishlistItems = document.getElementById('wishlistItems');
const purchaseHistoryEl = document.getElementById('purchaseHistory');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    updateUI();
});

function initializeApp() {
    renderProducts();
    renderSellProducts();
    updateCartDisplay();
    updateWishlistDisplay();
    updatePurchaseHistory();
    showSection('home');
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Auth modal
    closeAuthModal.addEventListener('click', () => authModal.classList.remove('active'));
    closeNegotiatorModal.addEventListener('click', () => negotiatorModal.classList.remove('active'));
    showRegister.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    showLogin.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
    userBtn.addEventListener('click', handleUserAction);
    cartBtn.addEventListener('click', () => showSection('cart'));
    wishlistBtn.addEventListener('click', () => showSection('wishlist'));
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            showSection(section);
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts();
        });
    });
    
    // Negotiator submit
    document.getElementById('submitNegotiation').addEventListener('click', handleNegotiation);
}

// ===== Authentication =====
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        authModal.classList.remove('active');
        updateUI();
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid credentials');
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    authModal.classList.remove('active');
    updateUI();
    alert(`Welcome, ${name}!`);
}

function handleUserAction() {
    if (currentUser) {
        if (confirm(`Logged in as ${currentUser.name}. Logout?`)) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUI();
            alert('Logged out successfully');
        }
    } else {
        authModal.classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
}

// ===== Navigation =====
function showSection(section) {
    currentSection = section;
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    const sectionMap = {
        'home': 'homeSection',
        'buy': 'buySection',
        'sell': 'sellSection',
        'refund': 'refundSection',
        'cart': 'cartSection',
        'wishlist': 'wishlistSection'
    };
    
    const sectionId = sectionMap[section];
    if (sectionId) {
        document.getElementById(sectionId).classList.add('active');
    }
}

// ===== Product Rendering =====
function renderProducts() {
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-actions">
                    <button class="action-btn wishlist-toggle ${isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        ❤️
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    <span class="product-price">£${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Track view history
    filteredProducts.forEach(p => trackView(p.id));
}

function renderSellProducts() {
    sellProductGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    <span class="product-price">£${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="openNegotiator(${product.id})">
                        Negotiate
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Cart Functions =====
function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        authModal.classList.add('active');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        alert('Item already in cart');
        return;
    }
    
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateUI();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateUI();
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        cartTotal.innerHTML = '';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.innerHTML = `
        <h3>Total</h3>
        <div class="total-amount">£${total.toFixed(2)}</div>
        <button class="btn-primary" onclick="checkout()" style="margin-top: 15px;">Checkout</button>
    `;
}

function checkout() {
    if (!currentUser) {
        alert('Please login to checkout');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Add to purchase history
    const purchase = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };
    
    purchaseHistory.push(purchase);
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
    updatePurchaseHistory();
    updateUI();
    
    alert('Purchase successful! Thank you for shopping with CHASED.');
    showSection('refund');
}

// ===== Wishlist Functions =====
function toggleWishlist(productId) {
    if (!currentUser) {
        alert('Please login to use wishlist');
        authModal.classList.add('active');
        return;
    }
    
    const index = wishlist.findIndex(id => id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
    renderProducts();
    updateUI();
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishlistDisplay() {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    if (wishlistProducts.length === 0) {
        wishlistItems.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
        return;
    }
    
    wishlistItems.innerHTML = wishlistProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-actions">
                    <button class="action-btn active" onclick="toggleWishlist(${product.id})">
                        ❤️
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    <span class="product-price">£${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Price Negotiator =====
function openNegotiator(productId) {
    if (!currentUser) {
        alert('Please login to negotiate prices');
        authModal.classList.add('active');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('negotiatorImage').src = product.image;
    document.getElementById('negotiatorProductName').textContent = product.name;
    document.getElementById('negotiatorOriginalPrice').textContent = product.price.toFixed(2);
    document.getElementById('negotiatorPrice').value = '';
    document.getElementById('negotiatorPrice').dataset.productId = productId;
    
    negotiatorModal.classList.add('active');
}

function handleNegotiation() {
    const priceInput = document.getElementById('negotiatorPrice');
    const offeredPrice = parseFloat(priceInput.value);
    const productId = parseInt(priceInput.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (!offeredPrice || offeredPrice <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    if (offeredPrice >= product.price) {
        alert('Your offer should be lower than the original price');
        return;
    }
    
    // Simulate negotiation (in real app, this would go to backend)
    const acceptance = Math.random() > 0.5;
    
    if (acceptance) {
        alert(`Offer accepted! £${offeredPrice.toFixed(2)} for ${product.name}`);
    } else {
        alert(`Offer declined. Seller suggests £${(product.price * 0.9).toFixed(2)}`);
    }
    
    negotiatorModal.classList.remove('active');
}

// ===== Purchase History =====
function updatePurchaseHistory() {
    if (purchaseHistory.length === 0) {
        purchaseHistoryEl.innerHTML = '<p class="empty-message">No purchase history</p>';
        return;
    }
    
    purchaseHistoryEl.innerHTML = purchaseHistory.map(purchase => `
        <div class="cart-item">
            <div class="cart-item-details" style="width: 100%;">
                <div class="cart-item-name">Order #${purchase.id}</div>
                <div style="color: var(--heavenly-grey); font-size: 12px; margin: 5px 0;">
                    ${new Date(purchase.date).toLocaleDateString()}
                </div>
                <div class="cart-item-price">£${purchase.total.toFixed(2)}</div>
                <div style="margin-top: 8px; font-size: 13px; color: var(--white);">
                    ${purchase.items.length} item(s)
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Tracking Functions =====
function trackView(productId) {
    if (!viewHistory.includes(productId)) {
        viewHistory.push(productId);
        localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
    }
}

// ===== UI Updates =====
function updateUI() {
    cartCount.textContent = cart.length;
    wishlistCount.textContent = wishlist.length;
}
