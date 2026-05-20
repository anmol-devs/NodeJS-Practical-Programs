// Global State
let products = [];
let cart = JSON.parse(localStorage.getItem('nexshop_cart')) || [];

// DOM Elements
const cartBadge = document.getElementById('cart-count');
const toastEl = document.getElementById('toast');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateAuthUI();
    
    // Only fetch products on the home page
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        fetchProducts();
        
        // Setup sort listener
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortProducts(e.target.value);
            });
        }
    }
});

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p>Failed to load products. Please try again later.</p>
            </div>
        `;
    }
}

// Render products to grid
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Render stars
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        const emptyStars = 5 - Math.ceil(product.rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }

        productCard.innerHTML = `
            <div class="product-img-container">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
            </div>
            <div class="product-info">
                <a href="product.html?id=${product.id}">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                <div class="product-rating">
                    <div class="stars">${starsHtml}</div>
                    <span>${product.rating} (${product.reviews.toLocaleString()})</span>
                </div>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})" title="Add to Cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Sort products
function sortProducts(sortType) {
    let sortedProducts = [...products];
    
    if (sortType === 'price-low') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-high') {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else {
        // Featured (default ID sort)
        sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    renderProducts(sortedProducts);
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
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
    
    saveCart();
    updateCartBadge();
    showToast(`Added ${product.name} to cart`);
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCartPage(); // Re-render if on cart page
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartPage(); // Re-render if on cart page
}

// Save cart to local storage
function saveCart() {
    localStorage.setItem('nexshop_cart', JSON.stringify(cart));
}

// Update cart badge counter
function updateCartBadge() {
    if (!cartBadge) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Hide badge if empty
    if (totalItems === 0) {
        cartBadge.style.display = 'none';
    } else {
        cartBadge.style.display = 'flex';
    }
}

// Show toast notification
function showToast(message) {
    if (!toastEl) return;
    
    toastEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Render Cart Page (called specifically on cart.html)
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.querySelector('.empty-cart-msg');
    
    if (!container) return; // Not on cart page
    
    // Update badge (in case we're rendering after a change)
    updateCartBadge();
    
    if (cart.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
        
        // Reset summary
        document.getElementById('summary-items-total').textContent = '$0.00';
        document.getElementById('summary-tax').textContent = '$0.00';
        document.getElementById('summary-total').textContent = '$0.00';
        
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    
    // Keep reference to empty msg before clearing
    const emptyMsgNode = emptyMsg.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(emptyMsgNode);
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        
        itemEl.innerHTML = `
            <div class="cart-product-info">
                <img src="${item.image}" alt="${item.name}" class="cart-product-img">
                <div class="cart-product-title">${item.name}</div>
            </div>
            <div class="cart-price">$${item.price.toFixed(2)}</div>
            <div class="cart-quantity">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-subtotal">$${itemTotal.toFixed(2)}</div>
            <div class="cart-action">
                <button class="btn-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(itemEl);
    });
    
    // Calculate and render summary
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax; // Shipping is free
    
    document.getElementById('summary-items-total').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.onclick = () => {
            window.location.href = 'checkout.html';
        };
    }
}

// Authentication Logic
let currentUser = JSON.parse(localStorage.getItem('nexshop_user')) || null;

function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    if (currentUser) {
        authLink.innerHTML = `<i class="fa-regular fa-user"></i> ${currentUser.name.split(' ')[0]} (Sign Out)`;
        authLink.href = "#";
        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('nexshop_user');
            currentUser = null;
            updateAuthUI();
            showToast("Successfully signed out");
        };
    } else {
        authLink.innerHTML = `<i class="fa-regular fa-user"></i> Sign In`;
        authLink.href = "login.html";
        authLink.onclick = null;
    }
}

function setupAuthPage() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');
    
    if (!tabLogin) return; // Not on auth page
    
    // Tab switching
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
    });
    
    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
    });
    
    // Login Submission
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = '';
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('nexshop_user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                errorEl.textContent = data.error || 'Login failed';
            }
        } catch (err) {
            errorEl.textContent = 'Server error. Please try again.';
        }
    });
    
    // Register Submission
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const errorEl = document.getElementById('reg-error');
        errorEl.textContent = '';
        
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('nexshop_user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                errorEl.textContent = data.error || 'Registration failed';
            }
        } catch (err) {
            errorEl.textContent = 'Server error. Please try again.';
        }
    });
}

// ==========================================
// 1. PRODUCT DETAIL PAGE LOGIC
// ==========================================
async function initProductDetailPage() {
    updateCartBadge();
    updateAuthUI();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const container = document.getElementById('product-detail-container');
    
    if (!id || !container) return;

    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const product = await response.json();
        
        // Render stars
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
        if (hasHalfStar) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        const emptyStars = 5 - Math.ceil(product.rating);
        for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';

        // Features list items
        let featuresHtml = '';
        if (product.features && product.features.length) {
            product.features.forEach(feat => {
                featuresHtml += `<li>${feat}</li>`;
            });
        }

        // Specifications rows
        let specsHtml = '';
        if (product.specifications) {
            for (const [key, val] of Object.entries(product.specifications)) {
                specsHtml += `
                    <tr>
                        <td class="spec-name">${key}</td>
                        <td class="spec-value">${val}</td>
                    </tr>
                `;
            }
        }

        container.innerHTML = `
            <div class="product-detail-gallery">
                <img src="${product.image}" alt="${product.name}" class="product-detail-img">
            </div>
            <div class="product-detail-info">
                <span class="stock-badge in-stock">In Stock</span>
                <h1 class="product-detail-title">${product.name}</h1>
                
                <div class="product-rating" style="font-size: 1.05rem;">
                    <div class="stars">${starsHtml}</div>
                    <span><strong>${product.rating}</strong> (${product.reviews.toLocaleString()} global reviews)</span>
                </div>
                
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                
                <div>
                    <h3 class="detail-section-title">Product Description</h3>
                    <p style="font-size: 1rem; line-height: 1.6; color: var(--text-main);">${product.longDescription || product.description}</p>
                </div>

                ${featuresHtml ? `
                <div>
                    <h3 class="detail-section-title">Key Features</h3>
                    <ul class="features-list">
                        ${featuresHtml}
                    </ul>
                </div>` : ''}

                ${specsHtml ? `
                <div>
                    <h3 class="detail-section-title">Specifications</h3>
                    <table class="specs-table">
                        <tbody>
                            ${specsHtml}
                        </tbody>
                    </table>
                </div>` : ''}

                <div class="detail-actions">
                    <button class="btn-primary" onclick="addToCart(${product.id})" style="flex: 1; padding: 1rem; font-size: 1.1rem;">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn-primary btn-buy-now" onclick="buyNow(${product.id})" style="flex: 1; padding: 1rem; font-size: 1.1rem;">
                        <i class="fa-solid fa-bolt"></i> Buy Now
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3>Product Not Found</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">The product you are looking for does not exist or has been removed.</p>
                <a href="index.html" class="btn-primary" style="margin-top: 1.5rem; display: inline-block;">Back to Home</a>
            </div>
        `;
    }
}

function buyNow(productId) {
    // Add to cart if not present
    const existing = cart.find(item => item.id === productId);
    if (!existing) {
        const prod = products.find(p => p.id === productId);
        if (prod) {
            cart.push({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                quantity: 1
            });
            saveCart();
        } else {
            fetch(`/api/products/${productId}`)
                .then(r => r.json())
                .then(p => {
                    cart.push({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image: p.image,
                        quantity: 1
                    });
                    saveCart();
                    window.location.href = 'checkout.html';
                });
            return;
        }
    }
    window.location.href = 'checkout.html';
}

// ==========================================
// 2. CHECKOUT PAGE LOGIC
// ==========================================
function initCheckoutPage() {
    updateCartBadge();
    updateAuthUI();

    if (cart.length === 0) {
        showToast("Your cart is empty. Redirecting...");
        setTimeout(() => { window.location.href = 'cart.html'; }, 1500);
        return;
    }

    // Pre-fill user details if logged in
    if (currentUser) {
        const nameInput = document.getElementById('shipping-name');
        const emailInput = document.getElementById('shipping-email');
        if (nameInput) nameInput.value = currentUser.name;
        if (emailInput) emailInput.value = currentUser.email;
    }

    // Render summary items
    const summaryList = document.getElementById('checkout-items-list');
    let subtotal = 0;
    
    if (summaryList) {
        summaryList.innerHTML = '';
        cart.forEach(item => {
            const rowTotal = item.price * item.quantity;
            subtotal += rowTotal;
            
            const itemRow = document.createElement('div');
            itemRow.className = 'checkout-item-row';
            itemRow.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">$${rowTotal.toFixed(2)}</div>
            `;
            summaryList.appendChild(itemRow);
        });
    }

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('checkout-subtotal');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    // Payment tab switcher
    const tabs = {
        card: document.getElementById('tab-card'),
        upi: document.getElementById('tab-upi'),
        cod: document.getElementById('tab-cod')
    };

    const forms = {
        card: document.getElementById('form-card'),
        upi: document.getElementById('form-upi'),
        cod: document.getElementById('form-cod')
    };

    let selectedPayment = 'Card';

    if (tabs.card && tabs.upi && tabs.cod) {
        tabs.card.addEventListener('click', () => {
            switchPaymentTab('card');
            selectedPayment = 'Card';
        });
        tabs.upi.addEventListener('click', () => {
            switchPaymentTab('upi');
            selectedPayment = 'UPI';
        });
        tabs.cod.addEventListener('click', () => {
            switchPaymentTab('cod');
            selectedPayment = 'Cash on Delivery';
        });
    }

    function switchPaymentTab(type) {
        Object.keys(tabs).forEach(k => {
            tabs[k].classList.remove('active');
            forms[k].classList.remove('active');
        });
        tabs[type].classList.add('active');
        forms[type].classList.add('active');
        
        // Add/remove required fields
        const cardInputs = forms.card.querySelectorAll('input');
        const upiInput = forms.upi.querySelector('input');
        
        if (type === 'card') {
            cardInputs.forEach(i => i.required = true);
            if (upiInput) upiInput.required = false;
        } else if (type === 'upi') {
            cardInputs.forEach(i => i.required = false);
            if (upiInput) upiInput.required = true;
        } else {
            cardInputs.forEach(i => i.required = false);
            if (upiInput) upiInput.required = false;
        }
    }

    // Initialize required fields for card by default
    const cardInputs = forms.card.querySelectorAll('input');
    cardInputs.forEach(i => i.required = true);

    // Format Card Expiry automatically (MM/YY)
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) {
                e.target.value = val.slice(0, 2) + '/' + val.slice(2, 4);
            } else {
                e.target.value = val;
            }
        });
    }

    // Submit Checkout
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const shippingAddress = {
                name: document.getElementById('shipping-name').value,
                email: document.getElementById('shipping-email').value,
                phone: document.getElementById('shipping-phone').value,
                address: document.getElementById('shipping-address').value,
                city: document.getElementById('shipping-city').value,
                zip: document.getElementById('shipping-zip').value
            };

            const payload = {
                userEmail: currentUser ? currentUser.email : shippingAddress.email,
                userName: currentUser ? currentUser.name : shippingAddress.name,
                items: cart,
                shippingAddress,
                paymentMethod: selectedPayment,
                total: total
            };

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error('Order creation failed');
                
                const data = await response.json();
                
                if (data.success) {
                    // Save placed order ID to guest tracking history in localStorage
                    let placedOrders = JSON.parse(localStorage.getItem('nexshop_placed_orders')) || [];
                    placedOrders.push(data.order.id);
                    localStorage.setItem('nexshop_placed_orders', JSON.stringify(placedOrders));

                    // Empty cart
                    cart = [];
                    saveCart();
                    
                    showToast('Order placed successfully! Redirecting...');
                    setTimeout(() => {
                        window.location.href = `orders.html?id=${data.order.id}`;
                    }, 1500);
                } else {
                    showToast('Failed to place order: ' + data.error);
                }
            } catch (err) {
                console.error(err);
                showToast('Server error placing order. Please try again.');
            }
        });
    }
}

// ==========================================
// 3. ORDERS & TRACKING PAGE LOGIC
// ==========================================
async function initOrdersPage() {
    updateCartBadge();
    updateAuthUI();

    const urlParams = new URLSearchParams(window.location.search);
    const trackingId = urlParams.get('id');
    const container = document.getElementById('orders-page-content');
    
    if (!container) return;

    if (trackingId) {
        renderOrderTracking(trackingId, container);
    } else {
        renderOrdersList(container);
    }
}

async function renderOrderTracking(orderId, container) {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Order not found');
        const order = await response.json();

        // Calculate visual timeline progress bar widths & active states
        const stages = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];
        const currentIndex = stages.indexOf(order.status);
        const isCancelled = order.status === "Cancelled";

        let stepperHtml = '';
        let progressWidth = 0;
        
        if (!isCancelled) {
            progressWidth = currentIndex === -1 ? 0 : (currentIndex / (stages.length - 1)) * 100;
            
            const icons = {
                "Ordered": "fa-receipt",
                "Packed": "fa-box-open",
                "Shipped": "fa-truck",
                "Out for Delivery": "fa-truck-ramp-box",
                "Delivered": "fa-house-chimney-user"
            };

            stages.forEach((stage, idx) => {
                let statusClass = '';
                if (idx < currentIndex) statusClass = 'completed';
                else if (idx === currentIndex) statusClass = 'active';
                
                stepperHtml += `
                    <div class="tracking-step ${statusClass}">
                        <div class="step-icon-container">
                            <i class="fa-solid ${icons[stage]}"></i>
                        </div>
                        <div class="step-label">${stage}</div>
                    </div>
                `;
            });
        }

        // Render status history logs
        let logsHtml = '';
        if (order.statusHistory && order.statusHistory.length) {
            const sortedHistory = [...order.statusHistory].reverse();
            sortedHistory.forEach((log, idx) => {
                const formattedTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const formattedDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
                
                logsHtml += `
                    <div class="log-item ${idx === 0 ? 'latest' : ''}">
                        <div class="log-dot"></div>
                        <div class="log-content">
                            <div>
                                <div class="log-text">${log.status}</div>
                                <div class="log-comment">${log.comment}</div>
                            </div>
                            <div class="log-time">
                                <div>${formattedTime}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${formattedDate}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Render items list
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-card-item">
                    <img src="${item.image}" alt="${item.name}" class="order-card-item-img">
                    <div class="order-card-item-details">
                        <div class="order-card-item-name">${item.name}</div>
                        <div class="order-card-item-meta">Qty: ${item.quantity} • $${item.price.toFixed(2)} each</div>
                    </div>
                    <div style="font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });

        const canCancel = ["Ordered", "Packed"].includes(order.status);
        const dateStr = new Date(order.createdAt).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        container.innerHTML = `
            <a href="orders.html" class="back-link">
                <i class="fa-solid fa-arrow-left"></i> View All Orders
            </a>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-wrap:wrap; gap:1rem;">
                <div>
                    <h1 style="font-size: 1.8rem; font-weight:800;">Track Shipment</h1>
                    <p style="color:var(--text-muted); margin-top:0.25rem;">Placed on ${dateStr}</p>
                </div>
                <div style="text-align:right;">
                    <span class="order-status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                    <p style="color:var(--primary); font-weight:600; font-size:1.1rem; margin-top:0.5rem;">Order ID: ${order.id}</p>
                </div>
            </div>

            <!-- SIMULATOR CONTROL PANEL -->
            ${!isCancelled && order.status !== "Delivered" ? `
            <div class="simulator-panel">
                <div class="simulator-info">
                    <h4><i class="fa-solid fa-circle-play"></i> 🚚 NexShop Shipment Simulator Control</h4>
                    <p>Since this is a simulated warehouse, you can manually speed up shipping steps to test the real-time tracker.</p>
                </div>
                <div class="simulator-actions">
                    <button class="btn-simulator" onclick="advanceSimulatedStatus('${order.id}')">
                        <i class="fa-solid fa-forward-step"></i> Advance Next Stage
                    </button>
                </div>
            </div>` : ''}

            <!-- TIMELINE VISUAL TRACKER -->
            ${isCancelled ? `
            <div class="tracking-container" style="background:#fef2f2; border-color:#fee2e2; text-align:center; padding: 3rem 2rem;">
                <i class="fa-solid fa-circle-xmark" style="font-size:4rem; color:#ef4444; margin-bottom: 1rem;"></i>
                <h3 style="color:#b91c1c; font-size: 1.5rem; font-weight:700;">This order has been cancelled</h3>
                <p style="color:#7f1d1d; margin-top:0.5rem; font-size:0.95rem;">If you charged a card, a refund will be initiated to your account in 3-5 business days.</p>
            </div>
            ` : `
            <div class="tracking-container">
                <h3 style="font-size:1.25rem; font-weight:700;">Delivery Progress</h3>
                <div class="tracking-stepper">
                    <div class="tracking-progress-bar" style="width: ${progressWidth}%;"></div>
                    ${stepperHtml}
                </div>
            </div>
            `}

            <div class="checkout-container">
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    
                    <div class="tracking-logs-card">
                        <h3 class="tracking-logs-title">Detailed Tracking Details</h3>
                        <div class="tracking-logs-list">
                            ${logsHtml}
                        </div>
                    </div>

                    <div class="tracking-logs-card" style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem;">
                        <div>
                            <h4 style="font-weight:700; margin-bottom:0.75rem; font-size:1rem;">Delivery Address</h4>
                            <p style="font-size:0.95rem; line-height:1.5; color:var(--text-main);">
                                <strong>${order.shippingAddress.name}</strong><br>
                                ${order.shippingAddress.address}<br>
                                ${order.shippingAddress.city}, ${order.shippingAddress.zip}<br>
                                Phone: ${order.shippingAddress.phone}
                            </p>
                        </div>
                        <div>
                            <h4 style="font-weight:700; margin-bottom:0.75rem; font-size:1rem;">Payment Method</h4>
                            <p style="font-size:0.95rem; color:var(--text-main);">
                                <i class="fa-solid fa-credit-card" style="color:var(--primary); margin-right:0.25rem;"></i>
                                ${order.paymentMethod}
                            </p>
                        </div>
                    </div>

                </div>

                <div style="display:flex; flex-direction:column; gap:1.5rem; position:sticky; top:100px;">
                    <div class="checkout-summary-card" style="position:static;">
                        <h3>Items in this Shipment</h3>
                        <div class="checkout-items-list" style="max-height: 300px;">
                            ${itemsHtml}
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-row total-row">
                            <span>Grand Total:</span>
                            <span>$${order.total.toFixed(2)}</span>
                        </div>
                        
                        ${canCancel ? `
                        <button class="btn-cancel-order w-100" style="margin-top:1.5rem;" onclick="cancelOrder('${order.id}')">
                            <i class="fa-solid fa-trash-can"></i> Cancel Order
                        </button>
                        ` : `
                        <button class="btn-cancel-order w-100" style="margin-top:1.5rem;" disabled title="Orders cannot be cancelled once shipped.">
                            Cannot Cancel Order
                        </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3.5rem; color: #eab308; margin-bottom: 1.5rem;"></i>
                <h3>Unable to load tracking details</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">We couldn't retrieve order status for ID: "<strong>${orderId}</strong>". Please check that the URL is correct or try again later.</p>
                <a href="orders.html" class="btn-primary" style="margin-top: 1.5rem; display: inline-block;">Back to My Orders</a>
            </div>
        `;
    }
}

async function advanceSimulatedStatus(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}/advance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to advance simulated status');
        
        const data = await response.json();
        if (data.success) {
            showToast(`Shipment status advanced: ${data.order.status}`);
            initOrdersPage();
        }
    } catch (error) {
        console.error(error);
        showToast('Error simulating shipment advance.');
    }
}

async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

    try {
        const response = await fetch(`/api/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Order cancellation failed');
        
        const data = await response.json();
        if (data.success) {
            showToast(`Order Cancelled Successfully`);
            initOrdersPage();
        }
    } catch (error) {
        console.error(error);
        showToast('Error cancelling order. Please try again.');
    }
}

async function renderOrdersList(container) {
    let storedPlacedOrders = JSON.parse(localStorage.getItem('nexshop_placed_orders')) || [];
    let userEmail = currentUser ? currentUser.email : null;
    let ordersList = [];

    container.innerHTML = `
        <h1 style="font-size: 2rem; font-weight:800; margin-bottom:0.5rem;">Your Orders</h1>
        <p style="color:var(--text-muted); margin-bottom: 2.5rem;">Track shipments, cancel orders, or view past purchases.</p>
        
        <div class="checkout-card" style="margin-bottom: 2.5rem; padding: 1.5rem 2rem;">
            <h4 style="margin-bottom: 0.75rem; font-weight:700;">Track a Specific Order</h4>
            <div style="display:flex; gap:1rem;">
                <input type="text" id="search-order-id" placeholder="Enter Order ID (e.g. NEX-20260520-4321)" style="flex:1; padding:0.75rem 1rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit;">
                <button onclick="trackSpecificOrder()" class="btn-primary" style="padding:0 2rem;">Track Shipment</button>
            </div>
            <div id="search-error" style="color:#ef4444; font-size:0.85rem; margin-top:0.5rem;"></div>
        </div>

        <div id="orders-list-container">
            <div class="loading-spinner"></div>
        </div>
    `;

    const listContainer = document.getElementById('orders-list-container');
    if (!listContainer) return;

    try {
        let apiOrders = [];
        if (userEmail) {
            const response = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
            if (response.ok) {
                apiOrders = await response.json();
            }
        }

        const localOrdersPromises = storedPlacedOrders.map(async (id) => {
            if (apiOrders.some(o => o.id === id)) return null;
            try {
                const r = await fetch(`/api/orders/${id}`);
                if (r.ok) return await r.json();
            } catch (err) {
                return null;
            }
            return null;
        });

        const localOrders = (await Promise.all(localOrdersPromises)).filter(o => o !== null);
        ordersList = [...apiOrders, ...localOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (ordersList.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border:1px solid var(--border-color);">
                    <i class="fa-solid fa-boxes-packing" style="font-size: 4rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                    <h3>No Orders Found</h3>
                    <p style="color:var(--text-muted); margin-top:0.5rem; margin-bottom:2rem;">Looks like you haven't placed any orders yet.</p>
                    <a href="index.html" class="btn-primary">Browse Premium Products</a>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';
        
        ordersList.forEach(order => {
            const dateStr = new Date(order.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
            
            let thumbnailsHtml = '';
            order.items.forEach(item => {
                thumbnailsHtml += `
                    <div style="position:relative; width: 60px; height:60px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color);">
                        <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
                        <span style="position:absolute; bottom:0; right:0; background:rgba(0,0,0,0.75); color:white; font-size:0.7rem; font-weight:700; padding:0.1rem 0.3rem; border-top-left-radius:var(--radius-md);">x${item.quantity}</span>
                    </div>
                `;
            });

            const card = document.createElement('div');
            card.className = 'order-card';
            card.style.marginBottom = '1.5rem';

            card.innerHTML = `
                <div class="order-card-header">
                    <div class="order-meta">
                        <div>
                            ORDER PLACED
                            <strong>${dateStr}</strong>
                        </div>
                        <div>
                            TOTAL
                            <strong>$${order.total.toFixed(2)}</strong>
                        </div>
                        <div>
                            SHIP TO
                            <strong>${order.shippingAddress.name}</strong>
                        </div>
                    </div>
                    <div class="order-id-label">
                        ORDER ID
                        <strong>${order.id}</strong>
                    </div>
                </div>
                <div class="order-card-body" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
                    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                        ${thumbnailsHtml}
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.75rem;">
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <span style="font-size:0.85rem; color:var(--text-muted);">Status:</span>
                            <span class="order-status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                        </div>
                        <a href="orders.html?id=${order.id}" class="btn-primary" style="padding: 0.5rem 1.25rem; font-size:0.9rem;">
                            <i class="fa-solid fa-location-dot"></i> Track Shipment
                        </a>
                    </div>
                </div>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        listContainer.innerHTML = `
            <div style="text-align:center; padding: 2rem; color: #ef4444;">
                <p>Failed to load orders history. Please refresh the page.</p>
            </div>
        `;
    }
}

function trackSpecificOrder() {
    const orderIdInput = document.getElementById('search-order-id');
    const errorEl = document.getElementById('search-error');
    if (!orderIdInput || !errorEl) return;
    
    const id = orderIdInput.value.trim();
    errorEl.textContent = '';

    if (!id) {
        errorEl.textContent = 'Please enter a valid Order ID.';
        return;
    }

    fetch(`/api/orders/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Order not found');
            return response.json();
        })
        .then(order => {
            window.location.href = `orders.html?id=${order.id}`;
        })
        .catch(err => {
            errorEl.textContent = 'Order ID not found. Please double check and try again.';
        });
}
