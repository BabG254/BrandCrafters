// BrandCrafters E-commerce JavaScript

// Cart functionality
let cart = JSON.parse(localStorage.getItem('brandcrafters_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('brandcrafters_wishlist')) || [];

// Update cart counter
function updateCartCounter() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-counter, #cart-counter');
    cartCounters.forEach(counter => {
        if (counter) {
            counter.textContent = cartCount;
            if (cartCount > 0) {
                counter.style.display = 'inline';
                counter.classList.remove('d-none');
            } else {
                counter.style.display = 'none';
                counter.classList.add('d-none');
            }
        }
    });
    
    // Update cart page if it exists
    if (typeof updateCartPage === 'function') {
        updateCartPage();
    }
}

// Initialize cart counter on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    
    // Add event listeners to add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(this);
        });
    });
    
    // Add event listeners to wishlist buttons
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            const price = parseInt(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image') || 'assets/img/shop_01.jpg';
            addToWishlist(productName, price, image);
        });
    });
});

// Add to cart function - Enhanced but simple
function addToCart(button) {
    const productName = button.getAttribute('data-product');
    const price = parseInt(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image') || 'assets/img/shop_01.jpg';
    
    if (!productName || !price) {
        console.error('Product name or price not found');
        return;
    }
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            image: image
        });
    }
    
    localStorage.setItem('brandcrafters_cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Add pulse animation to cart counter
    const cartCounters = document.querySelectorAll('.cart-counter, #cart-counter');
    cartCounters.forEach(counter => {
        if (counter) {
            counter.classList.add('pulse');
            setTimeout(() => {
                counter.classList.remove('pulse');
            }, 600);
        }
    });
    
    showNotification(`${productName} added to cart!`, 'success');
}

// Add to wishlist function
function addToWishlist(productName, price, image = 'assets/img/shop_01.jpg') {
    const existingItem = wishlist.find(item => item.name === productName);
    
    if (!existingItem) {
        wishlist.push({
            name: productName,
            price: parseInt(price),
            image: image
        });
        localStorage.setItem('brandcrafters_wishlist', JSON.stringify(wishlist));
        showNotification(`${productName} added to wishlist!`, 'success');
    } else {
        showNotification(`${productName} is already in your wishlist!`, 'info');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// WhatsApp Chat Widget functionality
function initWhatsAppWidget() {
    // Create WhatsApp prompt
    const prompt = document.createElement('div');
    prompt.className = 'whatsapp-prompt';
    prompt.innerHTML = 'Need Help? <strong>Chat with us</strong>';
    prompt.onclick = toggleWhatsAppChat;
    document.body.appendChild(prompt);
    
    // Create WhatsApp chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'whatsapp-chat-widget';
    chatWidget.id = 'whatsapp-chat-widget';
    chatWidget.innerHTML = `
        <div class="whatsapp-chat-header">
            <div class="whatsapp-chat-info">
                <div class="whatsapp-chat-avatar">B</div>
                <div class="whatsapp-chat-details">
                    <h4>BrandCrafters</h4>
                    <p>The team typically replies in a few minutes</p>
                </div>
            </div>
            <button class="close-chat" onclick="toggleWhatsAppChat()">×</button>
        </div>
        <div class="whatsapp-chat-body">
            <div class="chat-message">
                <strong>BrandCrafters Team</strong><br>
                Hi there! 👋<br>
                How can we help you today?
            </div>
        </div>
        <div class="whatsapp-chat-footer">
            <a href="https://wa.me/254703767699?text=Hello%20BrandCrafters,%20I%20would%20like%20to%20inquire%20about%20your%20products" 
               class="whatsapp-start-btn" target="_blank">
                <i class="fab fa-whatsapp"></i>
                Start a Conversation
            </a>
        </div>
    `;
    document.body.appendChild(chatWidget);
    
    // Hide prompt after 5 seconds
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.style.display = 'none';
        }
    }, 5000);
}

function toggleWhatsAppChat() {
    const chatWidget = document.getElementById('whatsapp-chat-widget');
    const prompt = document.querySelector('.whatsapp-prompt');
    
    if (chatWidget.style.display === 'none' || !chatWidget.style.display) {
        chatWidget.style.display = 'block';
        if (prompt) prompt.style.display = 'none';
    } else {
        chatWidget.style.display = 'none';
    }
}

// Payment simulation functions
function simulateSTKPush() {
    showNotification('STK Push sent to your phone. Please check your M-Pesa messages.', 'success');
    setTimeout(() => {
        showNotification('Payment processing... Please wait.', 'info');
    }, 2000);
    setTimeout(() => {
        showNotification('Payment successful! Order confirmed.', 'success');
    }, 5000);
}

function simulateVISAPayment() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiryDate = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;
    
    if (!cardNumber || !expiryDate || !cvv) {
        showNotification('Please fill in all card details.', 'error');
        return;
    }
    
    showNotification('Processing VISA payment...', 'info');
    setTimeout(() => {
        showNotification('Payment successful! Order confirmed.', 'success');
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart counter on page load
    updateCartCounter();
    
    // Initialize WhatsApp widget
    initWhatsAppWidget();
    
    // Load cart items if on cart page
    loadCartItems();
    
    // Add cart functionality to buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-cart');
            const productName = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            const image = button.closest('.card').querySelector('img')?.src || 'assets/img/shop_01.jpg';
            
            addToCart(productName, price, image);
        }
        
        if (e.target.closest('.add-to-wishlist')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-wishlist');
            const productName = button.getAttribute('data-product') || 
                               button.closest('.card-body').querySelector('a').textContent;
            const price = button.getAttribute('data-price') || 
                         button.closest('.card-body').querySelector('p').textContent.replace(/[^\d]/g, '');
            const image = button.closest('.card').querySelector('img')?.src || 'assets/img/shop_01.jpg';
            
            addToWishlist(productName, price, image);
        }
        
        // Cart page functionality
        if (e.target.closest('.qty-increase')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const currentQty = cart[index].quantity;
            updateCartQuantity(index, currentQty + 1);
        }
        
        if (e.target.closest('.qty-decrease')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const currentQty = cart[index].quantity;
            updateCartQuantity(index, currentQty - 1);
        }
        
        if (e.target.closest('.remove-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
        }
    });
    
    // Handle quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('qty-input')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const newQty = parseInt(e.target.value);
            updateCartQuantity(index, newQty);
        }
    });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        }
        
        .cart-counter {
            background: #F95700;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 5px;
            min-width: 18px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
});

// Load cart items on cart page
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h3>Your cart is empty</h3>
                <p class="text-muted">Start shopping to add items to your cart</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.innerHTML = `
                <h4>Order Summary</h4>
                <p>Total: KES 0</p>
            `;
        }
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="row border-bottom py-3" data-cart-index="${index}">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                </div>
                <div class="col-md-4">
                    <h5>${item.name}</h5>
                    <p class="text-muted">KES ${item.price.toLocaleString()}</p>
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary qty-decrease" data-index="${index}">-</button>
                        <input type="number" class="form-control text-center qty-input" value="${item.quantity}" data-index="${index}" min="1">
                        <button class="btn btn-outline-secondary qty-increase" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="col-md-2">
                    <strong>KES ${itemTotal.toLocaleString()}</strong>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-danger btn-sm remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    if (cartSummary) {
        const delivery = total > 0 ? 500 : 0;
        const finalTotal = total + delivery;
        
        cartSummary.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>KES ${total.toLocaleString()}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <span>KES ${delivery.toLocaleString()}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong class="text-success">KES ${finalTotal.toLocaleString()}</strong>
            </div>

            <!-- Proceed to Checkout Button -->
            <div class="d-grid gap-2 mb-3">
                <button class="btn btn-success btn-lg" onclick="proceedToCheckout()" ${total === 0 ? 'disabled' : ''}>
                    <i class="fas fa-credit-card"></i> Proceed to Checkout
                </button>
            </div>

            <!-- Alternative Actions -->
            <div class="d-flex gap-2 mb-3">
                <a href="https://wa.me/254703767699?text=Hi! I'm interested in ordering products from my cart. Total: KES ${finalTotal.toLocaleString()}" 
                   class="btn btn-outline-success flex-fill" target="_blank">
                    <i class="fab fa-whatsapp"></i> WhatsApp Order
                </a>
                <a href="tel:+254703767699" class="btn btn-outline-primary flex-fill">
                    <i class="fas fa-phone"></i> Call Us
                </a>
            </div>

            <!-- Till Number Info -->
            <div class="alert alert-info">
                <h6><i class="fas fa-mobile-alt"></i> Pay via M-Pesa</h6>
                <strong>Till Number: 12345678</strong><br>
                <small class="text-muted">Pay on Delivery Also Accepted</small>
            </div>
        `;
    }
    
    // Update checkout button total
    const checkoutButtons = document.querySelectorAll('.checkout-total');
    checkoutButtons.forEach(btn => {
        btn.textContent = `KES ${total.toLocaleString()}`;
    });
}

// Cart quantity management
function updateCartQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        localStorage.setItem('brandcrafters_cart', JSON.stringify(cart));
        updateCartCounter();
        loadCartItems();
    }
}

// Proceed to checkout function
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('brandcrafters_cart', JSON.stringify(cart));
    updateCartCounter();
    loadCartItems();
    showNotification('Item removed from cart', 'success');
}

// Load more related products function
function loadMoreRelatedProducts() {
    const relatedProductsData = [
        {
            name: "Acrylic Display Stand",
            price: 2800,
            image: "assets/img/shop_06.jpg",
            description: "A4 size acrylic display stand for brochures and documents",
            rating: 4,
            badges: ["Clear", "Frosted"]
        },
        {
            name: "Custom Business Cards",
            price: 800,
            image: "assets/img/shop_01.jpg", 
            description: "Premium business cards with UV coating",
            rating: 5,
            badges: ["Matte", "Glossy"]
        },
        {
            name: "LED Light Box Sign",
            price: 12000,
            image: "assets/img/shop_11.jpg",
            description: "Energy efficient LED illuminated signage",
            rating: 5,
            badges: ["Indoor", "Outdoor"]
        }
    ];

    const grid = document.getElementById('related-products-grid');
    const button = event.target;
    
    // Add new products to grid
    relatedProductsData.forEach(product => {
        const productHTML = `
            <div class="col-12 col-md-4 p-2 pb-3">
                <div class="product-wap card rounded-0 h-100">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${product.image}" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white add-to-wishlist" href="#" data-product="${product.name}" data-price="${product.price}"><i class="far fa-heart"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html?product=${product.name.toLowerCase().replace(/\s+/g, '-')}"><i class="far fa-eye"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2 add-to-cart" href="#" data-product="${product.name}" data-price="${product.price}" data-image="${product.image}" onclick="addToCart(this)"><i class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html?product=${product.name.toLowerCase().replace(/\s+/g, '-')}" class="h3 text-decoration-none text-dark">${product.name}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li class="text-muted">${product.description}</li>
                            <li class="pt-2">
                                ${product.badges.map(badge => `<span class="badge bg-secondary">${badge}</span>`).join(' ')}
                            </li>
                        </ul>
                        <ul class="list-unstyled d-flex justify-content-center mb-1">
                            <li>
                                ${Array(5).fill().map((_, i) => 
                                    `<i class="${i < product.rating ? 'text-warning' : 'text-muted'} fa fa-star"></i>`
                                ).join('')}
                            </li>
                        </ul>
                        <p class="text-center mb-0 h5 text-success">KSh ${product.price.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', productHTML);
    });
    
    // Hide the "Load More" button after loading
    button.style.display = 'none';
    
    // Show success message
    showNotification('More related products loaded!', 'success');
}

// Global functions for external access
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.simulateSTKPush = simulateSTKPush;
window.simulateVISAPayment = simulateVISAPayment;
window.toggleWhatsAppChat = toggleWhatsAppChat;
window.loadCartItems = loadCartItems;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.loadMoreRelatedProducts = loadMoreRelatedProducts;

// Mobile Products Data for Pagination
const mobileProductsData = {
    1: [
        {
            title: "Customizable Big Size Insulated Travel Mug",
            image: "./assets/img/feature_prod_01.jpg",
            price: 2499,
            oldPrice: 3000
        },
        {
            title: "Personalized Coffee Brown Wooden Desk Organizer",
            image: "./assets/img/feature_prod_02.jpg",
            price: 2499,
            oldPrice: 3500
        },
        {
            title: "Golden Soccer Ball Champion's Trophy",
            image: "./assets/img/feature_prod_03.jpg",
            price: 7999,
            oldPrice: 8500
        },
        {
            title: "Classic White Mug for Sublimation Printing",
            image: "./assets/img/shop_01.jpg",
            price: 799,
            oldPrice: 1000
        },
        {
            title: "Premium Crystal Award Trophy",
            image: "./assets/img/shop_02.jpg",
            price: 12500,
            oldPrice: 15000
        },
        {
            title: "Custom Branded Vinyl Stickers",
            image: "./assets/img/shop_03.jpg",
            price: 350,
            oldPrice: 500
        }
    ],
    2: [
        {
            title: "Roll-Up Banner Stand Premium",
            image: "./assets/img/shop_04.jpg",
            price: 6500,
            oldPrice: 7500
        },
        {
            title: "PVC Outdoor Banner Weather Resistant",
            image: "./assets/img/shop_05.jpg",
            price: 3200,
            oldPrice: 4000
        },
        {
            title: "Professional PVC Foam Board",
            image: "./assets/img/shop_06.jpg",
            price: 6500,
            oldPrice: 7000
        },
        {
            title: "Custom Branded Gazebo Tent",
            image: "./assets/img/shop_07.jpg",
            price: 28000,
            oldPrice: 32000
        },
        {
            title: "3D Acrylic Letter Signage",
            image: "./assets/img/shop_08.jpg",
            price: 1200,
            oldPrice: 1500
        },
        {
            title: "Premium Aluminium Composite Sheets",
            image: "./assets/img/shop_09.jpg",
            price: 450,
            oldPrice: 600
        }
    ],
    3: [
        {
            title: "Corporate Executive Plaques",
            image: "./assets/img/feature_prod_01.jpg",
            price: 4500,
            oldPrice: 5500
        },
        {
            title: "Digital Printed Fabric Banners",
            image: "./assets/img/shop_05.jpg",
            price: 2800,
            oldPrice: 3500
        },
        {
            title: "Acrylic Photo Frames Premium",
            image: "./assets/img/shop_01.jpg",
            price: 1800,
            oldPrice: 2200
        },
        {
            title: "Custom Metal Name Badges",
            image: "./assets/img/shop_02.jpg",
            price: 650,
            oldPrice: 800
        },
        {
            title: "LED Illuminated Channel Letters",
            image: "./assets/img/shop_08.jpg",
            price: 15000,
            oldPrice: 18000
        },
        {
            title: "Professional Display Stands",
            image: "./assets/img/shop_04.jpg",
            price: 5200,
            oldPrice: 6000
        }
    ],
    4: [
        {
            title: "Luxury Crystal Trophy Awards",
            image: "./assets/img/feature_prod_03.jpg",
            price: 9500,
            oldPrice: 11000
        },
        {
            title: "Heavy Duty Vinyl Floor Graphics",
            image: "./assets/img/shop_03.jpg",
            price: 580,
            oldPrice: 750
        },
        {
            title: "Outdoor LED Light Box Signs",
            image: "./assets/img/shop_07.jpg",
            price: 22000,
            oldPrice: 25000
        },
        {
            title: "Corporate Wooden Desk Accessories",
            image: "./assets/img/feature_prod_02.jpg",
            price: 3200,
            oldPrice: 4000
        },
        {
            title: "Premium Acrylic Sheet Materials",
            image: "./assets/img/shop_06.jpg",
            price: 1200,
            oldPrice: 1500
        },
        {
            title: "Custom Fabric Pop-up Displays",
            image: "./assets/img/shop_09.jpg",
            price: 12500,
            oldPrice: 15000
        }
    ],
    5: [
        {
            title: "Professional Sublimation Mugs Set",
            image: "./assets/img/feature_prod_01.jpg",
            price: 1200,
            oldPrice: 1500
        },
        {
            title: "Corporate Event Banners",
            image: "./assets/img/shop_05.jpg",
            price: 4500,
            oldPrice: 5500
        },
        {
            title: "Premium Gold Medal Collection",
            image: "./assets/img/shop_02.jpg",
            price: 2500,
            oldPrice: 3000
        },
        {
            title: "Architectural Signage Solutions",
            image: "./assets/img/shop_08.jpg",
            price: 18000,
            oldPrice: 22000
        },
        {
            title: "Custom Acrylic Display Cases",
            image: "./assets/img/shop_01.jpg",
            price: 7500,
            oldPrice: 9000
        },
        {
            title: "Professional Gazebo Package",
            image: "./assets/img/shop_07.jpg",
            price: 35000,
            oldPrice: 40000
        }
    ]
};

// Load products for specific page
function loadPage(pageNumber) {
    const productsGrid = document.getElementById('mobile-products-grid');
    const pageButtons = document.querySelectorAll('.mobile-page-btn');
    
    if (!productsGrid || !mobileProductsData[pageNumber]) {
        console.error('Page data not found for page:', pageNumber);
        return;
    }
    
    // Update active button
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-page')) === pageNumber) {
            btn.classList.add('active');
        }
    });
    
    // Generate HTML for products
    let productsHTML = '';
    mobileProductsData[pageNumber].forEach(product => {
        productsHTML += `
            <div class="col-6">
                <div class="mobile-product-card" onclick="viewProduct('${product.title}')">
                    <div class="mobile-product-image">
                        <img src="${product.image}" alt="${product.title}" class="img-fluid">
                        <div class="mobile-product-badge">KSh${product.price.toLocaleString()}</div>
                    </div>
                    <div class="mobile-product-info">
                        <h6 class="mobile-product-title">${product.title}</h6>
                        <div class="mobile-product-price-row">
                            <span class="mobile-product-price-old">KSh${product.oldPrice.toLocaleString()}</span>
                            <span class="mobile-product-price-new">KSh${product.price.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update grid with fade effect
    productsGrid.style.opacity = '0.5';
    setTimeout(() => {
        productsGrid.innerHTML = productsHTML;
        productsGrid.style.opacity = '1';
        
        // Scroll to top of products section
        const productsSection = document.querySelector('.mobile-products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 150);
    
    // Show loading notification
    showNotification(`Loading page ${pageNumber} products...`, 'info');
}

// View product function
function viewProduct(productTitle) {
    // Convert product title to URL-friendly format
    const productSlug = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Redirect to product page
    window.location.href = `shop-single.html?product=${productSlug}`;
}

// Mobile search functionality
function initializeMobileSearch() {
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    
    if (mobileSearchInput && mobileSearchBtn) {
        // Search on button click
        mobileSearchBtn.addEventListener('click', function() {
            const searchTerm = mobileSearchInput.value.trim();
            if (searchTerm) {
                window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
        
        // Search on Enter key
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
}

// Initialize mobile functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile search
    initializeMobileSearch();
    
    // Add smooth transitions to mobile product cards
    const style = document.createElement('style');
    style.textContent += `
        .mobile-product-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        #mobile-products-grid {
            transition: opacity 0.3s ease;
        }
        
        .mobile-page-btn {
            transition: all 0.2s ease;
        }
        
        .mobile-search-input:focus {
            border-color: #F95700;
            box-shadow: 0 0 0 0.2rem rgba(249, 87, 0, 0.25);
        }
    `;
    document.head.appendChild(style);
});

// Export functions for global access
window.loadPage = loadPage;
window.viewProduct = viewProduct;