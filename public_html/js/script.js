// Global Data Store
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || 
{
    name: '',
    email: '',
    address: '',
    paymentMethod: 'Visa'
};

// Utility Class
class Utils 
{
    static formatPrice(price) 
    {
        return '$' + price.toFixed(2);
    }

    static calculateCartTotals() 
    {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        return { subtotal, tax, total };
    }

    static generateOrderNumber() 
    {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    }

    static saveCartToStorage() 
    {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static saveOrderDetailsToStorage() 
    {
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
}

// Modal Class
class Modal 
{
    static show(title, content, buttons = []) 
    {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        if (buttons.length > 0) 
        {
            const modalFooter = document.createElement('div');
            modalFooter.className = 'modal-footer';
            
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
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        modalOverlay.querySelector('.modal-close').addEventListener('click', () => 
        {
            modalOverlay.remove();
        });
        
        return modalOverlay;
    }
}

// Product Page Class
class ProductPage 
{
    static init() 
    {
        this.setupAddToCartButtons();
        this.setupCartIcon();
        this.updateCartCount();
    }

    static setupAddToCartButtons() 
    {
        document.querySelectorAll('.add-to-cart').forEach((button, index) => 
        {
            button.addEventListener('click', () => 
            {
                const card = button.closest('.card');
                const title = card.querySelector('.card__title').textContent;
                const price = parseFloat(card.querySelector('.card__price').textContent.replace('$', ''));
                const quantity = parseInt(card.querySelector('.quantity-input').value);
                
                this.addToCart(title, price, quantity);
            });
        });
    }

    static addToCart(title, price, quantity) 
    {
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
                title,
                price,
                quantity
            });
        }
        
        Utils.saveCartToStorage();
        this.updateCartCount();
        
        Modal.show(
            'Added to Cart',
            `<p>${quantity} ${title}(s) added to your cart.</p>`,
            [
                {
                    text: 'Continue Shopping',
                    primary: false,
                    action: () => document.querySelector('.modal-overlay').remove()
                },
                {
                    text: 'Go to Cart',
                    primary: true,
                    action: () => window.location.href = 'cart.html'
                }
            ]
        );
    }

    static setupCartIcon() 
    {
        const cartIcon = document.getElementById('cartIcon');
        
        if (cartIcon) 
        {
            cartIcon.addEventListener('click', () => 
            {
                window.location.href = 'cart.html';
            });
        }
    }

    static updateCartCount() 
    {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        
        if (cartCountElement) 
        {
            cartCountElement.textContent = count;
        }
    }
}

// Cart Page Class
class CartPage 
{
    static init() 
    {
        this.renderCartItems();
        this.setupCheckoutButton();
        this.updateCartTotals();
    }

    static renderCartItems() 
    {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (cart.length === 0) 
        {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => 
        {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${Utils.formatPrice(item.price)} each</div>
                    <div class="cart-item-quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
                <div class="cart-item-total">
                    ${Utils.formatPrice(item.price * item.quantity)}
                </div>
            `;
            
            this.setupQuantityControls(itemElement, item.id);
            cartItemsContainer.appendChild(itemElement);
        });
    }

    static setupQuantityControls(element, itemId) 
    {
        const minusBtn = element.querySelector('.minus');
        const plusBtn = element.querySelector('.plus');
        const quantityInput = element.querySelector('.quantity-input');
        const removeBtn = element.querySelector('.remove-btn');
        
        minusBtn.addEventListener('click', () => 
        {
            const newQuantity = parseInt(quantityInput.value) - 1;
            this.updateCartItem(itemId, newQuantity);
        });
        
        plusBtn.addEventListener('click', () => 
        {
            const newQuantity = parseInt(quantityInput.value) + 1;
            this.updateCartItem(itemId, newQuantity);
        });
        
        quantityInput.addEventListener('change', () => 
        {
            const newQuantity = parseInt(quantityInput.value) || 1;
            this.updateCartItem(itemId, newQuantity);
        });
        
        removeBtn.addEventListener('click', () => 
        {
            this.updateCartItem(itemId, 0);
        });
    }

    static updateCartItem(itemId, newQuantity) 
    {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (newQuantity > 0) 
        {
            cart[itemIndex].quantity = newQuantity;
        } 
        else 
        {
            cart.splice(itemIndex, 1);
        }
        
        Utils.saveCartToStorage();
        this.renderCartItems();
        this.updateCartTotals();
        ProductPage.updateCartCount();
    }

    static updateCartTotals() 
    {
        const { subtotal, tax, total } = Utils.calculateCartTotals();
        
        document.getElementById('subtotal').textContent = Utils.formatPrice(subtotal);
        document.getElementById('tax').textContent = Utils.formatPrice(tax);
        document.getElementById('total').textContent = Utils.formatPrice(total);
    }

    static setupCheckoutButton() 
    {
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (checkoutBtn) 
        {
            checkoutBtn.addEventListener('click', () => 
            {
                window.location.href = 'checkout.html';
            });
        }
    }
}

// Checkout Page Class
class CheckoutPage 
{
    static init() 
    {
        this.renderOrderDetails();
        this.renderOrderSummary();
        this.setupEditDetailsButton();
        this.setupCompletePurchaseButton();
    }

    static renderOrderDetails() 
    {
        document.getElementById('shippingName').textContent = orderDetails.name || 'Not provided';
        document.getElementById('shippingAddress').textContent = orderDetails.address || 'Not provided';
        document.getElementById('paymentMethod').textContent = orderDetails.paymentMethod || 'Not selected';
    }

    static renderOrderSummary() 
    {
        const { subtotal, tax, total } = Utils.calculateCartTotals();
        const shipping = 10.00;
        
        document.getElementById('checkoutSubtotal').textContent = Utils.formatPrice(subtotal);
        document.getElementById('checkoutTax').textContent = Utils.formatPrice(tax);
        document.getElementById('checkoutShipping').textContent = Utils.formatPrice(shipping);
        document.getElementById('checkoutTotal').textContent = Utils.formatPrice(total + shipping);
    }

    static setupEditDetailsButton() 
    {
        const editBtn = document.getElementById('editDetailsBtn');
        
        if (editBtn) 
        {
            editBtn.addEventListener('click', () => 
            {
                Modal.show(
                    'Edit Details',
                    `
                    <form id="detailsForm">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" id="editName" value="${orderDetails.name}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="editEmail" value="${orderDetails.email}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <input type="text" class="form-input" id="editAddress" value="${orderDetails.address}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Payment Method</label>
                            <select class="form-select" id="editPaymentMethod">
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
                            action: () => document.querySelector('.modal-overlay').remove()
                        },
                        {
                            text: 'Save',
                            primary: true,
                            action: () => this.saveDetails()
                        }
                    ]
                );
            });
        }
    }

    static saveDetails() 
    {
        orderDetails = 
        {
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            address: document.getElementById('editAddress').value,
            paymentMethod: document.getElementById('editPaymentMethod').value
        };
        
        Utils.saveOrderDetailsToStorage();
        this.renderOrderDetails();
        document.querySelector('.modal-overlay').remove();
    }

    static setupCompletePurchaseButton() 
    {
        const completeBtn = document.getElementById('completePurchaseBtn');
        
        if (completeBtn) 
        {
            completeBtn.addEventListener('click', () => 
            {
                if (!orderDetails.address || !orderDetails.paymentMethod) 
                {
                    Modal.show(
                        'Missing Information',
                        '<p>Please provide shipping address and payment method.</p>',
                        [
                            {
                                text: 'OK',
                                primary: true,
                                action: () => document.querySelector('.modal-overlay').remove()
                            }
                        ]
                    );
                    return;
                }
                
                this.completePurchase();
            });
        }
    }

    static completePurchase() 
    {
        const orderNumber = Utils.generateOrderNumber();
        localStorage.setItem('orderNumber', orderNumber);
        
        cart = [];
        Utils.saveCartToStorage();
        
        window.location.href = 'confirmation.html';
    }
}

// Confirmation Page Class
class ConfirmationPage 
{
    static init() 
    {
        this.displayOrderNumber();
        this.setupBackToHomeButton();
    }

    static displayOrderNumber() 
    {
        const orderNumber = localStorage.getItem('orderNumber');
        
        if (orderNumber) 
        {
            document.getElementById('orderNumber').textContent = orderNumber;
        }
    }

    static setupBackToHomeButton() 
    {
        const backBtn = document.getElementById('backToHome');
        
        if (backBtn) 
        {
            backBtn.addEventListener('click', () => 
            {
                window.location.href = 'index.html';
            });
        }
    }
}

// Page Initialization
document.addEventListener('DOMContentLoaded', function() 
{
    if (document.querySelector('.products-container')) 
    {
        ProductPage.init();
    } 
    else if (document.getElementById('cartItems')) 
    {
        CartPage.init();
    } 
    else if (document.getElementById('checkoutTotal')) 
    {
        CheckoutPage.init();
    } 
    else if (document.getElementById('orderNumber')) 
    {
        ConfirmationPage.init();
    }
});