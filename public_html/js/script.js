// Shopping Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
    {
        id: 1,
        title: "Premium Chair",
        price: 199.99,
        description: "Ergonomic design with premium materials for maximum comfort."
    },
    {
        id: 2,
        title: "Modern Desk",
        price: 299.99,
        description: "Sleek design with ample workspace and built-in cable management."
    },
    {
        id: 3,
        title: "Minimal Lamp",
        price: 99.99,
        description: "Adjustable lighting with touch controls and energy-efficient LED."
    }
];

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

// Shopping Page Functionality
function setupShoppingPage()
{
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cartIcon');
    
    if (addToCartButtons.length > 0)
    {
        addToCartButtons.forEach((button, index) => 
        {
            button.addEventListener('click', function()
            {
                const product = products[index];
                const quantityInput = this.parentElement.querySelector('.quantity-input');
                const quantity = parseInt(quantityInput.value);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem)
                {
                    existingItem.quantity += quantity;
                }
                else
                {
                    cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        quantity: quantity
                    });
                }
                
                saveCartToStorage();
                updateCartCount();
                
                // Show feedback
                alert(`${quantity} ${product.title}(s) added to cart`);
            });
        });
    }
    
    // Quantity controls
    const quantityMinusButtons = document.querySelectorAll('.quantity-btn.minus');
    const quantityPlusButtons = document.querySelectorAll('.quantity-btn.plus');
    
    quantityMinusButtons.forEach(button => 
    {
        button.addEventListener('click', function()
        {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 1)
            {
                input.value = parseInt(input.value) - 1;
            }
        });
    });
    
    quantityPlusButtons.forEach(button => 
    {
        button.addEventListener('click', function()
        {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });
    
    if (cartIcon)
    {
        cartIcon.addEventListener('click', function()
        {
            window.location.href = 'cart.html';
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
                    </div>
                    <div class="cart-item-quantity">
                        <span>${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}</span>
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
            window.location.href = 'checkout.html';
        });
    }
}

// Checkout Page Functionality
function setupCheckoutPage()
{
    const completePurchaseBtn = document.getElementById('completePurchase');
    const { subtotal, tax, total } = calculateCartTotals();
    
    // Set shipping address (static for demo)
    document.getElementById('shippingAddress').textContent = '123 Main St, Anytown, USA';
    
    // Set payment method (static for demo)
    document.getElementById('paymentMethod').textContent = 'Visa ending in 4242';
    
    // Update totals
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkoutTax').textContent = formatPrice(tax);
    document.getElementById('checkoutTotal').textContent = formatPrice(total + 10); // +$10 shipping
    
    if (completePurchaseBtn)
    {
        completePurchaseBtn.addEventListener('click', function()
        {
            // Generate random order number
            const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);
            localStorage.setItem('orderNumber', orderNumber);
            
            // Clear cart
            cart = [];
            saveCartToStorage();
            
            window.location.href = 'confirmation.html';
        });
    }
}

// Confirmation Page Functionality
function setupConfirmationPage()
{
    const orderNumber = localStorage.getItem('orderNumber');
    
    if (orderNumber)
    {
        document.getElementById('orderNumber').textContent = orderNumber;
    }
}

// Initialize appropriate page
document.addEventListener('DOMContentLoaded', function()
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
});