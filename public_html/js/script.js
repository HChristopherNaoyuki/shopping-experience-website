// Shopping Page Functionality
document.addEventListener('DOMContentLoaded', function()
{
    // Check if we're on the shopping page
    if (document.querySelector('.products-container'))
    {
        const cartIcon = document.getElementById('cartIcon');
        
        cartIcon.addEventListener('click', function()
        {
            window.location.href = 'cart.html';
        });

        // Add to cart buttons (just for show in this static demo)
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => 
        {
            button.addEventListener('click', function(e)
            {
                e.preventDefault();
                alert('Item added to cart (demo)');
            });
        });
    }

    // Cart Page Functionality
    if (document.getElementById('checkoutBtn'))
    {
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        checkoutBtn.addEventListener('click', function()
        {
            window.location.href = 'checkout.html';
        });
    }

    // Checkout Page Functionality
    if (document.getElementById('completePurchase'))
    {
        const completePurchase = document.getElementById('completePurchase');
        const checkoutForm = document.querySelector('.checkout-form');
        
        checkoutForm.addEventListener('submit', function(e)
        {
            e.preventDefault();
            window.location.href = 'confirmation.html';
        });
    }
});