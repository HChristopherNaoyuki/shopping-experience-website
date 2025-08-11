// Shopping Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || 
{
    name: '',
    email: '',
    address: '',
    paymentMethod: 'Visa'
};

// Utility Functions
function formatPrice(price)
{
    return '$' + price.toFixed(2);
}

function calculateCartTotals()
{
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
}

function updateCartCount()
{
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement)
    {
        cartCountElement.textContent = count;
    }
}

function saveCartToStorage()
{
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveOrderDetailsToStorage()
{
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
}

function showLoadingScreen()
{
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-inner">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
            <div class="bar4"></div>
            <div class="bar5"></div>
            <div class="bar6"></div>
            <div class="bar7"></div>
            <div class="bar8"></div>
            <div class="bar9"></div>
            <div class="bar10"></div>
            <div class="bar11"></div>
            <div class="bar12"></div>
        </div>
    `;
    document.body.appendChild(loader);
    
    setTimeout(() => 
    {
        loader.remove();
    }, 1500);
}

function showModal(content)
{
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    modal.querySelector('.modal-close').addEventListener('click', () => 
    {
        modal.remove();
    });
}

function generateOrderNumber()
{
    return Math.floor(1000000 + Math.random() * 9000000);
}

// Shopping Page Functionality
function setupShoppingPage()
{
    const addToCartButtons = document.querySelectorAll('.card__add-to-cart');
    const cartIcon = document.getElementById('cartIcon');
    
    if (addToCartButtons.length > 0)
    {
        addToCartButtons.forEach((button, index) => 
        {
            button.addEventListener('click', function()
            {
                const card = this.closest('.card');
                const title = card.querySelector('.card__title').textContent;
                const price = parseFloat(card.querySelector('.card__price').textContent.replace('$', ''));
                const quantity = parseInt(card.querySelector('.card__quantity input').value);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.title === title);
                
                if (existingItem)
                {
                    existingItem.quantity += quantity;
                }
                else
                {
                    cart.push({
                        id: Date.now(),
                        title: title,
                        price: price,
                        quantity: quantity
                    });
                }
                
                saveCartToStorage();
                updateCartCount();
                
                // Show feedback
                showModal(`
                    <h3 class="modal-title">Added to Cart</h3>
                    <p>${quantity} ${title}(s) added to your cart.</p>
                    <button class="form-submit" id="continueShopping">Continue Shopping</button>
                    <button class="form-submit" id="goToCart">Go to Cart</button>
                `);
                
                document.getElementById('continueShopping').addEventListener('click', () => 
                {
                    document.querySelector('.modal').remove();
                });
                
                document.getElementById('goToCart').addEventListener('click', () => 
                {
                    window.location.href = 'cart.html';
                });
            });
        });
    }
    
    if (cartIcon)
    {
        cartIcon.addEventListener('click', function()
        {
            showLoadingScreen();
            setTimeout(() => 
            {
                window.location.href = 'cart.html';
            }, 1500);
        });
    }
    
    updateCartCount();
}

// Cart Page Functionality
function setupCartPage()
{
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartItemsContainer)
    {
        if (cart.length === 0)
        {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        }
        else
        {
            cartItemsContainer.innerHTML = '';
            
            cart.forEach(item => 
            {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} each</div>
                        <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-total">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
    }
    
    // Update totals
    const { subtotal, tax, total } = calculateCartTotals();
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
    
    if (checkoutBtn)
    {
        checkoutBtn.addEventListener('click', function()
        {
            showLoadingScreen();
            setTimeout(() => 
            {
                window.location.href = 'checkout.html';
            }, 1500);
        });
    }
}

// Checkout Page Functionality
function setupCheckoutPage()
{
    const completePurchaseBtn = document.getElementById('completePurchase');
    const editDetailsBtn = document.getElementById('editDetailsBtn');
    const { subtotal, tax, total } = calculateCartTotals();
    
    // Set shipping address
    document.getElementById('shippingAddress').textContent = orderDetails.address || 'No address provided';
    
    // Set payment method
    document.getElementById('paymentMethod').textContent = orderDetails.paymentMethod || 'No payment method selected';
    
    // Update totals
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkoutTax').textContent = formatPrice(tax);
    document.getElementById('checkoutTotal').textContent = formatPrice(total + 10); // +$10 shipping
    
    if (editDetailsBtn)
    {
        editDetailsBtn.addEventListener('click', function()
        {
            showModal(`
                <h3 class="modal-title">Edit Your Details</h3>
                <form id="detailsForm">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" value="${orderDetails.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" value="${orderDetails.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Shipping Address</label>
                        <input type="text" id="address" value="${orderDetails.address}" required>
                    </div>
                    <div class="form-group">
                        <label for="paymentMethod">Payment Method</label>
                        <select id="paymentMethodSelect">
                            <option value="Visa" ${orderDetails.paymentMethod === 'Visa' ? 'selected' : ''}>Visa</option>
                            <option value="MasterCard" ${orderDetails.paymentMethod === 'MasterCard' ? 'selected' : ''}>MasterCard</option>
                        </select>
                    </div>
                    <button type="submit" class="form-submit">Save Details</button>
                </form>
            `);
            
            document.getElementById('detailsForm').addEventListener('submit', function(e)
            {
                e.preventDefault();
                
                orderDetails = 
                {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    paymentMethod: document.getElementById('paymentMethodSelect').value
                };
                
                saveOrderDetailsToStorage();
                document.querySelector('.modal').remove();
                
                // Refresh displayed details
                document.getElementById('shippingAddress').textContent = orderDetails.address;
                document.getElementById('paymentMethod').textContent = orderDetails.paymentMethod;
            });
        });
    }
    
    if (completePurchaseBtn)
    {
        completePurchaseBtn.addEventListener('click', function()
        {
            if (!orderDetails.address || !orderDetails.paymentMethod)
            {
                alert('Please provide your shipping address and payment method before completing your purchase.');
                return;
            }
            
            // Generate random order number
            const orderNumber = generateOrderNumber();
            localStorage.setItem('orderNumber', orderNumber);
            
            // Clear cart
            cart = [];
            saveCartToStorage();
            
            showLoadingScreen();
            setTimeout(() => 
            {
                window.location.href = 'confirmation.html';
            }, 1500);
        });
    }
}

// Confirmation Page Functionality
function setupConfirmationPage()
{
    const orderNumber = localStorage.getItem('orderNumber');
    const backToHomeBtn = document.getElementById('backToHome');
    
    if (orderNumber)
    {
        document.getElementById('orderNumber').textContent = orderNumber;
    }
    
    if (backToHomeBtn)
    {
        backToHomeBtn.addEventListener('click', function()
        {
            showLoadingScreen();
            setTimeout(() => 
            {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// Initialize appropriate page
document.addEventListener('DOMContentLoaded', function()
{
    showLoadingScreen();
    
    setTimeout(() => 
    {
        if (document.querySelector('.products-container'))
        {
            setupShoppingPage();
        }
        else if (document.getElementById('cartItems'))
        {
            setupCartPage();
        }
        else if (document.getElementById('checkoutTotal'))
        {
            setupCheckoutPage();
        }
        else if (document.getElementById('orderNumber'))
        {
            setupConfirmationPage();
        }
    }, 1500);
});