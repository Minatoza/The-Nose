// Sample product data based on the context (e.g., from Home.html and image files)
const products = [
    { id: 1, name: 'Tom Ford Fucking Fabulous Parfum', price: 145, image: 'image/Tom Ford Fucking Fabulous Parfum.png', gender: 'Unisex' },
    { id: 2, name: 'Kayali Fleur Majesty Rose Royale', price: 128, image: 'image/Kayali Fleur Majesty Rose Royale.png', gender: 'Women' },
    { id: 3, name: 'Phlur Golden Rule', price: 165, image: 'image/Phlur Golden Rule.png', gender: 'Women' },
    { id: 4, name: 'Maison Francis Kurkdjian Baccarat Rouge 540', price: 132, image: 'image/Maison Francis Kurkdjian Baccarat Rouge 540.png', gender: 'Unisex' },
    // Add more products as needed; you can expand this array
];

// Function to render products in the grid
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;  // Safety check
    grid.innerHTML = '';  // Clear existing content
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <h4>${product.name}</h4>
            <p class="price">$${product.price}</p>
        `;
        productCard.onclick = () => openModal(product);  // Open modal on click
        grid.appendChild(productCard);
    });
}

// Function to handle modal
function openModal(product) {
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price}`;
    document.getElementById('modalGender').textContent = `Gender: ${product.gender}`;
    document.getElementById('modalBottle').style.backgroundImage = `url(${product.image})`;
    document.getElementById('productModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Quantity handlers for modal
function increaseQty() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

function updateQty(value) {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(value) > 0 ? parseInt(value) : 1;  // Ensure it's at least 1
}

// Cart functionality
let cart = [];  // Array to hold cart items

function addToCart() {
    const productName = document.getElementById('modalTitle').textContent;
    const quantity = document.getElementById('quantityInput').value;
    const product = products.find(p => p.name === productName);
    if (product) {
        cart.push({ ...product, quantity: parseInt(quantity) });
        updateCart();
        alert('Item added to cart!');  // Simple feedback
    }
    closeModal();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');  // Assuming you have a badge in navigation
    if (cartItems) cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        if (cartItems) {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `${item.name} x ${item.quantity} - $${item.price * item.quantity}`;
            cartItems.appendChild(itemElement);
        }
        total += item.price * item.quantity;
    });
    if (cartTotal) cartTotal.textContent = `$${total}`;
    if (cartBadge) cartBadge.textContent = cart.length;  // Update badge with item count
}

// Function to toggle cart sidebar (e.g., when clicking the cart icon)
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.style.right = cartSidebar.style.right === '0px' ? '-300px' : '0px';  // Slide in/out
    }
}

// Initial load: Run when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    // Add event listener for cart icon if needed
    const cartIcon = document.querySelector('.icons span:nth-child(2)');  // Assuming the cart icon is the second span
    if (cartIcon) cartIcon.onclick = toggleCart;
});
