/**
 * Luxury Hotel & Resorts
 * Utility Functions
 */

/**
 * Format a date string to a more readable format
 * 
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format date to YYYY-MM-DD for input fields
 * 
 * @param {Date} date - The date object to format
 * @returns {string} - The formatted date string
 */
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Generate a random ID with a specified prefix
 * 
 * @param {string} prefix - The prefix for the ID
 * @returns {string} - The generated ID
 */
function generateId(prefix = 'ID') {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}${random}`;
}

/**
 * Validate email format without using regular expressions
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    if (!email) return false;
    if (!email.includes('@')) return false;
    if (email.indexOf('@') === 0) return false;
    if (email.indexOf('@') === email.length - 1) return false;
    if (!email.includes('.')) return false;
    if (email.indexOf('.') === email.length - 1) return false;
    
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
    
    if (dotIndex < atIndex) return false;
    if (dotIndex === atIndex + 1) return false;
    
    return true;
}

/**
 * Validate phone number format without using regular expressions
 * 
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
function isValidPhone(phone) {
    if (!phone) return false;
    
    // Remove common characters from phone numbers
    const chars = [' ', '-', '(', ')', '+', '.'];
    let cleaned = phone;
    
    for (let i = 0; i < chars.length; i++) {
        cleaned = cleaned.split(chars[i]).join('');
    }
    
    // Check if it's all digits
    for (let i = 0; i < cleaned.length; i++) {
        const charCode = cleaned.charCodeAt(i);
        if (charCode < 48 || charCode > 57) {
            return false;
        }
    }
    
    // Check if it's a reasonable length
    return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Calculate the number of nights between two dates
 * 
 * @param {string} checkIn - The check-in date string
 * @param {string} checkOut - The check-out date string
 * @returns {number} - The number of nights
 */
function calculateNights(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Format currency amount
 * 
 * @param {number} amount - The amount to format
 * @returns {string} - The formatted amount
 */
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

/**
 * Capitalize the first letter of each word in a string
 * 
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeWords(string) {
    return string.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Truncate text to a specified length and add ellipsis
 * 
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length before truncation
 * @returns {string} - The truncated text
 */
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Get URL parameters as an object
 * 
 * @returns {Object} - The URL parameters
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
        if (!pairs[i]) continue;
        
        const pair = pairs[i].split('=');
        const key = decodeURIComponent(pair[0]);
        let value = pair.length > 1 ? decodeURIComponent(pair[1]) : null;
        
        if (key) {
            params[key] = value;
        }
    }
    
    return params;
}

/**
 * Show form message (success or error)
 * 
 * @param {HTMLElement} form - The form element
 * @param {string} message - The message to display
 * @param {string} type - The message type ('success' or 'error')
 */
function showFormMessage(form, message, type) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert after the form
    form.insertAdjacentElement('afterend', messageElement);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

/**
 * Format star rating as HTML
 * 
 * @param {number} rating - The rating value
 * @returns {string} - HTML for the star rating
 */
function formatStarRating(rating) {
    let html = '<div class="star-rating">';
    
    // Full stars
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    // Half star if needed
    if (rating % 1 !== 0) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Set minimum date constraints for date inputs
 * 
 * @param {HTMLElement} checkInInput - The check-in date input
 * @param {HTMLElement} checkOutInput - The check-out date input
 */
function setupDateConstraints(checkInInput, checkOutInput) {
    if (!checkInInput || !checkOutInput) return;
    
    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    checkInInput.min = formatDateForInput(today);
    checkOutInput.min = formatDateForInput(tomorrow);
    
    // Default values if not already set
    if (!checkInInput.value) {
        checkInInput.value = formatDateForInput(today);
    }
    
    if (!checkOutInput.value) {
        checkOutInput.value = formatDateForInput(tomorrow);
    }
    
    // Update check-out min date when check-in changes
    checkInInput.addEventListener('change', function() {
        const newMinDate = new Date(this.value);
        newMinDate.setDate(newMinDate.getDate() + 1);
        checkOutInput.min = formatDateForInput(newMinDate);
        
        // If current check-out date is before new min date, update it
        if (new Date(checkOutInput.value) <= new Date(this.value)) {
            checkOutInput.value = formatDateForInput(newMinDate);
        }
    });
}

/**
 * Close a modal
 * 
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Remove modal from the document after transition
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * Create a confirmation modal with specified content
 * 
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message
 * @param {string} options.confirmText - Text for confirm button
 * @param {string} options.cancelText - Text for cancel button
 * @param {Function} options.onConfirm - Function to call on confirmation
 * @returns {HTMLElement} - The created modal
 */
function createConfirmationModal(options) {
    const modal = document.createElement('div');
    modal.className = 'modal confirmation-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${options.title || 'Confirm Action'}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="confirmation-message">${options.message || 'Are you sure you want to proceed?'}</p>
                
                <div class="modal-actions">
                    <button class="btn btn-tertiary cancel-modal-btn">${options.cancelText || 'Cancel'}</button>
                    <button class="btn btn-primary confirm-modal-btn">${options.confirmText || 'Confirm'}</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Add event listeners
    const closeButton = modal.querySelector('.modal-close');
    const cancelButton = modal.querySelector('.cancel-modal-btn');
    const confirmButton = modal.querySelector('.confirm-modal-btn');
    
    closeButton.addEventListener('click', () => closeModal(modal));
    cancelButton.addEventListener('click', () => closeModal(modal));
    
    confirmButton.addEventListener('click', () => {
        if (typeof options.onConfirm === 'function') {
            options.onConfirm();
        }
        closeModal(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal(modal);
        }
    });
    
    return modal;
}
