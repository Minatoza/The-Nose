// ==========================================
// SHOPPING CART SYSTEM - cart.js
// ==========================================

class ShoppingCart {
  constructor() {
    this.cart = [];
    this.loadCart();
    this.createOverlay();
    this.initializeEventListeners();
  }

  // Create the overlay element
  createOverlay() {
    const existingOverlay = document.getElementById('cartOverlay');
    if (!existingOverlay) {
      const overlay = document.createElement('div');
      overlay.id = 'cartOverlay';
      overlay.className = 'cart-overlay';
      document.body.appendChild(overlay);
    }
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const productCard = e.target.closest('.product-card');
        this.addToCartFromCard(productCard);
      }
      
      // Cart icon click
      if (e.target.closest('.cart-icon')) {
        this.toggleCartSidebar();
      }

      // Close cart button
      if (e.target.classList.contains('close-cart')) {
        this.toggleCartSidebar();
      }

      // Click on dark overlay to close cart
      if (e.target.id === 'cartSidebar' && e.target.classList.contains('open')) {
        // Only close if clicking directly on the overlay background, not the sidebar content
        if (e.target === e.currentTarget) {
          this.toggleCartSidebar();
        }
      }

      // Checkout button
      if (e.target.classList.contains('checkout-btn')) {
        this.proceedToCheckout();
      }

      // Remove from cart
      if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.dataset.itemId;
        this.removeFromCart(itemId);
      }
    });

    // Quantity controls in cart sidebar
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('qty-increase')) {
        const itemId = e.target.dataset.itemId;
        this.updateQuantity(itemId, 1);
      }
      if (e.target.classList.contains('qty-decrease')) {
        const itemId = e.target.dataset.itemId;
        this.updateQuantity(itemId, -1);
      }
    });
  }

  // Add product to cart from product card
  addToCartFromCard(productCard) {
    const productName = productCard.querySelector('h4').textContent;
    const priceText = productCard.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
    const image = productCard.querySelector('.product-image img').src;

    const product = {
      id: Date.now(), // Simple unique ID
      name: productName,
      price: price,
      image: image,
      quantity: 1
    };

    this.addToCart(product);
  }

  // Add item to cart
  addToCart(product) {
    // Check if product already in cart
    const existingItem = this.cart.find(item => item.name === product.name);
    
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cart.push(product);
    }

    this.saveCart();
    this.updateCartUI();
    this.showNotification(`${product.name} added to cart!`);
  }

  // Remove item from cart
  removeFromCart(itemId) {
    const index = this.cart.findIndex(item => item.id == itemId);
    if (index > -1) {
      const itemName = this.cart[index].name;
      this.cart.splice(index, 1);
      this.saveCart();
      this.updateCartUI();
      this.showNotification(`${itemName} removed from cart`);
    }
  }

  // Update quantity
  updateQuantity(itemId, change) {
    const item = this.cart.find(i => i.id == itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  // Toggle cart sidebar visibility
  toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const body = document.body;
    if (sidebar) {
      sidebar.classList.toggle('open');
      // Prevent body scroll when cart is open
      if (sidebar.classList.contains('open')) {
        body.classList.add('cart-open');
        body.style.overflow = 'hidden';
      } else {
        body.classList.remove('cart-open');
        body.style.overflow = 'auto';
      }
    }
  }

  // Update cart UI
  updateCartUI() {
    this.updateCartBadge();
    this.renderCartSidebar();
  }

  // Update cart badge count
  updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  // Render cart sidebar
  renderCartSidebar() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (this.cart.length === 0) {
      cartContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
      if (cartTotal) cartTotal.textContent = '₱0.00';
      return;
    }

    let total = 0;

    this.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemHTML = `
        <div class="cart-item" data-item-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h5>${item.name}</h5>
            <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
            <div class="cart-item-controls">
            <button class="qty-decrease" data-item-id="${item.id}"><i class="fas fa-minus"></i></button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-increase" data-item-id="${item.id}"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          <div class="cart-item-total">
            <p>₱${itemTotal.toFixed(2)}</p>
            <button class="remove-item" data-item-id="${item.id}"><i class="fas fa-times"></i></button>
          </div>
        </div>
      `;
      cartContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    if (cartTotal) {
      cartTotal.textContent = `₱${total.toFixed(2)}`;
    }
  }

  // Calculate total
  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Save cart to browser storage (in-memory only for Claude.ai)
  saveCart() {
    window.cartData = this.cart;
  }

  // Load cart from storage
  loadCart() {
    if (window.cartData) {
      this.cart = window.cartData;
    }
  }

  // Proceed to checkout
  proceedToCheckout() {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = this.getTotal();
    alert(`Proceeding to checkout with total: ₱${total.toFixed(2)}\n\nThis would redirect to your payment system.`);
    
    // In a real application, you would:
    // window.location.href = '/checkout';
  }

  // Show notification
  showNotification(message) {
    // Remove existing notification
    const existing = document.getElementById('cartNotification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'cartNotification';
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.shoppingCart = new ShoppingCart();
});