# Minimal Shop - E-commerce Application

## Overview

Minimal Shop is a clean, responsive e-commerce web application built with HTML, 
CSS, and JavaScript. The application features a product listing page, shopping 
cart functionality, checkout process, and order confirmation.

## Features

### Product Page
- Displays products in a responsive grid layout
- Each product card includes:
  - Product title and description
  - Price information
  - Quantity controls (increment/decrement)
  - Add to cart button
- Persistent cart icon with item count

### Shopping Cart
- Lists all added products with:
  - Product details (name, price)
  - Adjustable quantity controls
  - Remove item option
  - Individual item totals
- Calculates and displays:
  - Subtotal
  - Tax (10%)
  - Order total
- Checkout button to proceed to payment

### Checkout Process
- Displays shipping information
- Shows selected payment method
- Order summary with:
  - Item subtotal
  - Calculated tax
  - Shipping cost
  - Final total
- Edit details functionality
- Complete purchase button

### Order Confirmation
- Displays order confirmation message
- Shows unique order number
- Provides return to home button

## Technical Implementation

### Data Management
- Uses localStorage to persist:
  - Shopping cart items
  - Customer details
  - Order information
- Utility functions for:
  - Price formatting
  - Cart total calculations
  - Order number generation

### UI Components
- Responsive design with mobile considerations
- Modal dialog system for:
  - Edit details form
  - Notifications
- Consistent styling across all pages
- Interactive elements with hover/focus states

### JavaScript Classes
- ProductPage: Handles product display and cart additions
- CartPage: Manages cart functionality and updates
- CheckoutPage: Processes order details and payment
- ConfirmationPage: Displays order completion
- Modal: Reusable modal dialog system
- Utils: Shared utility functions

## Setup Instructions

1. Clone or download the repository
2. Open index.html in a web browser
3. No additional dependencies or build steps required

## Browser Compatibility

The application is designed to work in modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Notes

- This is a frontend-only implementation
- No actual payment processing is included
- All data persists in browser localStorage

## DISCLAIMER

UNDER NO CIRCUMSTANCES SHOULD IMAGES OR EMOJIS BE INCLUDED DIRECTLY 
IN THE README FILE. ALL VISUAL MEDIA, INCLUDING SCREENSHOTS AND IMAGES 
OF THE APPLICATION, MUST BE STORED IN A DEDICATED FOLDER WITHIN THE 
PROJECT DIRECTORY. THIS FOLDER SHOULD BE CLEARLY STRUCTURED AND NAMED 
ACCORDINGLY TO INDICATE THAT IT CONTAINS ALL VISUAL CONTENT RELATED TO 
THE APPLICATION (FOR EXAMPLE, A FOLDER NAMED IMAGES, SCREENSHOTS, OR MEDIA).

I AM NOT LIABLE OR RESPONSIBLE FOR ANY MALFUNCTIONS, DEFECTS, OR ISSUES 
THAT MAY OCCUR AS A RESULT OF COPYING, MODIFYING, OR USING THIS SOFTWARE. 
IF YOU ENCOUNTER ANY PROBLEMS OR ERRORS, PLEASE DO NOT ATTEMPT TO FIX THEM 
SILENTLY OR OUTSIDE THE PROJECT. INSTEAD, KINDLY SUBMIT A PULL REQUEST 
OR OPEN AN ISSUE ON THE CORRESPONDING GITHUB REPOSITORY, SO THAT IT CAN 
BE ADDRESSED APPROPRIATELY BY THE MAINTAINERS OR CONTRIBUTORS.

---
