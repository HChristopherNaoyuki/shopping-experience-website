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

function showModal(title, content, buttons)
{
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close">&times;</button>
    `;
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = content;
    
    if (buttons && buttons.length > 0)
    {
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.padding = '1.5rem';
        modalFooter.style.borderTop = '1px solid #d2d2d7';
        modalFooter.style.display = 'flex';
        modalFooter.style.gap = '1rem';
        
        buttons.forEach(button => 
        {
            const btn = document.createElement('button');
            btn.className = `btn ${button.primary ? 'btn-primary' : 'btn-secondary'}`;
            btn.textContent = button.text;
            btn.addEventListener('click', button.action);
            modalFooter.appendChild(btn);
        });
        
        modalContent.appendChild(modalFooter);
    }
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalOverlay.appendChild(modalContent);
    
    document.body.appendChild(modalOverlay);
    
    // Add close handler
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => 
    {
        modalOverlay.classList.remove('active');
        setTimeout(() => 
        {
            modalOverlay.remove();
        }, 300);
    });
    
    // Trigger animation
    setTimeout(() => 
    {
        modalOverlay.classList.add('active');
    }, 10);
}

function generateOrderNumber()
{
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Shopping Page Functionality
function setupShoppingPage()
{
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cartIcon');
    
    // Setup quantity controls
    document.querySelectorAll('.quantity-btn').forEach(button => 
    {
        button.addEventListener('click', function()
        {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus') && value > 1)
            {
                input.value = value - 1;
            }
            else if (this.classList.contains('plus'))
            {
                input.value = value + 1;
            }
        });
    });
    
    if (addToCartButtons.length > 0)
    {
        addToCartButtons.forEach((button, index) => 
        {
            button.addEventListener('click', function()
            {
                const card = this.closest('.card');
                const title = card.querySelector('.card__title').textContent;
                const price = parseFloat(card.querySelector('.card__price').textContent.replace('$', ''));
                const quantity = parseInt(card.querySelector('.quantity-input').value);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.title === title);
                
                if (existingItem)
                {
                    existingItem.quantity += quantity;
                }
                else
                {
                    cart.push(
                    {
                        id: Date.now(),
                        title: title,
                        price: price,
                        quantity: quantity
                    });
                }
                
                saveCartToStorage();
                updateCartCount();
                
                showModal(
                    'Added to Cart',
                    `<p>${quantity} ${title}(s) added to your cart.</p>`,
                    [
                        {
                            text: 'Continue Shopping',
                            primary: false,
                            action: function() 
                            {
                                document.querySelector('.modal-overlay').classList.remove('active');
                                setTimeout(() => 
                                {
                                    document.querySelector('.modal-overlay').remove();
                                }, 300);
                            }
                        },
                        {
                            text: 'Go to Cart',
                            primary: true,
                            action: function() 
                            {
                                window.location.href = 'cart.html';
                            }
                        }
                    ]
                );
            });
        });
    }
    
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
    const editDetailsBtn = document.getElementById('editDetailsBtn');
    
    function renderCartItems()
    {
        if (cart.length === 0)
        {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
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
    
    function updateTotals()
    {
        const { subtotal, tax, total } = calculateCartTotals();
        
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('tax').textContent = formatPrice(tax);
        document.getElementById('total').textContent = formatPrice(total);
    }
    
    renderCartItems();
    updateTotals();
    
    if (checkoutBtn)
    {
        checkoutBtn.addEventListener('click', function()
        {
            window.location.href = 'checkout.html';
        });
    }
    
    if (editDetailsBtn)
    {
        editDetailsBtn.addEventListener('click', function()
        {
            showModal(
                'Edit Your Details',
                `
                <form id="detailsForm">
                    <div class="form-group">
                        <label class="form-label" for="name">Full Name</label>
                        <input type="text" class="form-input" id="name" value="${orderDetails.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="email">Email Address</label>
                        <input type="email" class="form-input" id="email" value="${orderDetails.email}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="address">Shipping Address</label>
                        <input type="text" class="form-input" id="address" value="${orderDetails.address}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="paymentMethod">Payment Method</label>
                        <select class="form-select" id="paymentMethod">
                            <option value="Visa" ${orderDetails.paymentMethod === 'Visa' ? 'selected' : ''}>Visa</option>
                            <option value="MasterCard" ${orderDetails.paymentMethod === 'MasterCard' ? 'selected' : ''}>MasterCard</option>
                        </select>
                    </div>
                </form>
                `,
                [
                    {
                        text: 'Cancel',
                        primary: false,
                        action: function() 
                        {
                            document.querySelector('.modal-overlay').classList.remove('active');
                            setTimeout(() => 
                            {
                                document.querySelector('.modal-overlay').remove();
                            }, 300);
                        }
                    },
                    {
                        text: 'Save',
                        primary: true,
                        action: function() 
                        {
                            orderDetails = 
                            {
                                name: document.getElementById('name').value,
                                email: document.getElementById('email').value,
                                address: document.getElementById('address').value,
                                paymentMethod: document.getElementById('paymentMethod').value
                            };
                            
                            saveOrderDetailsToStorage();
                            document.querySelector('.modal-overlay').classList.remove('active');
                            setTimeout(() => 
                            {
                                document.querySelector('.modal-overlay').remove();
                            }, 300);
                        }
                    }
                ]
            );
        });
    }
}

// Checkout Page Functionality
function setupCheckoutPage()
{
    const completePurchaseBtn = document.getElementById('completePurchase');
    const editDetailsBtn = document.getElementById('editDetailsBtn');
    
    function updateOrderDetails()
    {
        document.getElementById('shippingName').textContent = orderDetails.name || 'Not provided';
        document.getElementById('shippingAddress').textContent = orderDetails.address || 'Not provided';
        document.getElementById('paymentMethod').textContent = orderDetails.paymentMethod || 'Not selected';
    }
    
    function updateTotals()
    {
        const { subtotal, tax, total } = calculateCartTotals();
        const shipping = 10.00;
        
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('tax').textContent = formatPrice(tax);
        document.getElementById('shipping').textContent = formatPrice(shipping);
        document.getElementById('total').textContent = formatPrice(total + shipping);
    }
    
    updateOrderDetails();
    updateTotals();
    
    if (editDetailsBtn)
    {
        editDetailsBtn.addEventListener('click', function()
        {
            showModal(
                'Edit Your Details',
                `
                <form id="detailsForm">
                    <div class="form-group">
                        <label class="form-label" for="name">Full Name</label>
                        <input type="text" class="form-input" id="name" value="${orderDetails.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="email">Email Address</label>
                        <input type="email" class="form-input" id="email" value="${orderDetails.email}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="address">Shipping Address</label>
                        <input type="text" class="form-input" id="address" value="${orderDetails.address}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="paymentMethod">Payment Method</label>
                        <select class="form-select" id="paymentMethod">
                            <option value="Visa" ${orderDetails.paymentMethod === 'Visa' ? 'selected' : ''}>Visa</option>
                            <option value="MasterCard" ${orderDetails.paymentMethod === 'MasterCard' ? 'selected' : ''}>MasterCard</option>
                        </select>
                    </div>
                </form>
                `,
                [
                    {
                        text: 'Cancel',
                        primary: false,
                        action: function() 
                        {
                            document.querySelector('.modal-overlay').classList.remove('active');
                            setTimeout(() => 
                            {
                                document.querySelector('.modal-overlay').remove();
                            }, 300);
                        }
                    },
                    {
                        text: 'Save',
                        primary: true,
                        action: function() 
                        {
                            orderDetails = 
                            {
                                name: document.getElementById('name').value,
                                email: document.getElementById('email').value,
                                address: document.getElementById('address').value,
                                paymentMethod: document.getElementById('paymentMethod').value
                            };
                            
                            saveOrderDetailsToStorage();
                            updateOrderDetails();
                            document.querySelector('.modal-overlay').classList.remove('active');
                            setTimeout(() => 
                            {
                                document.querySelector('.modal-overlay').remove();
                            }, 300);
                        }
                    }
                ]
            );
        });
    }
    
    if (completePurchaseBtn)
    {
        completePurchaseBtn.addEventListener('click', function()
        {
            if (!orderDetails.address || !orderDetails.paymentMethod)
            {
                showModal(
                    'Missing Information',
                    '<p>Please provide your shipping address and payment method before completing your purchase.</p>',
                    [
                        {
                            text: 'OK',
                            primary: true,
                            action: function() 
                            {
                                document.querySelector('.modal-overlay').classList.remove('active');
                                setTimeout(() => 
                                {
                                    document.querySelector('.modal-overlay').remove();
                                }, 300);
                            }
                        }
                    ]
                );
                return;
            }
            
            // Generate random order number
            const orderNumber = generateOrderNumber();
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
    const backToHomeBtn = document.getElementById('backToHome');
    
    if (orderNumber)
    {
        document.getElementById('orderNumber').textContent = orderNumber;
    }
    
    if (backToHomeBtn)
    {
        backToHomeBtn.addEventListener('click', function()
        {
            window.location.href = 'index.html';
        });
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