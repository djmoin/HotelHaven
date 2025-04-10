/**
 * Luxury Hotel & Resorts
 * Main Application JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Initialize components
    initMobileMenu();
    initQuickBookingForm();
    initTestimonialSlider();
    initNewsletterForm();

    // Add scroll event listener for header changes
    window.addEventListener('scroll', handleScroll);
}

/**
 * Handle scroll events (for header styling)
 */
function handleScroll() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'var(--background-color)';
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Toggle hamburger menu animation
        const spans = menuToggle.querySelectorAll('span');
        if (mainNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            
            // Reset hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            
            // Reset hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Initialize the quick booking form
 */
function initQuickBookingForm() {
    const quickBookingForm = document.getElementById('quick-booking-form');
    if (!quickBookingForm) return;
    
    // Set min dates for check-in and check-out
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput && checkOutInput) {
        // Set minimum date to today
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        checkInInput.min = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        
        // Default values
        checkInInput.value = formatDate(today);
        checkOutInput.value = formatDate(tomorrow);
        
        // Update check-out min date when check-in changes
        checkInInput.addEventListener('change', function() {
            const newMinDate = new Date(this.value);
            newMinDate.setDate(newMinDate.getDate() + 1);
            checkOutInput.min = formatDate(newMinDate);
            
            // If current check-out date is before new min date, update it
            if (new Date(checkOutInput.value) <= new Date(this.value)) {
                checkOutInput.value = formatDate(newMinDate);
            }
        });
    }
    
    // Handle form submission
    quickBookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const guests = document.getElementById('guests').value;
        const rooms = document.getElementById('rooms').value;
        
        // Create search parameters object
        const searchParams = {
            checkIn,
            checkOut,
            guests,
            rooms
        };
        
        // Store search parameters in session storage
        sessionStorage.setItem('bookingSearch', JSON.stringify(searchParams));
        
        // Redirect to room search results page
        window.location.href = 'pages/booking.html';
    });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides and deactivate all indicators
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });
        indicators.forEach((indicator) => {
            indicator.classList.remove('active');
        });
        
        // Show the selected slide and activate the corresponding indicator
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Add event listeners to controls
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // Add event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showFormMessage(newsletterForm, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // In a real application, you would send this to a server
        // For this example, we'll just simulate a successful subscription
        
        // Clear the input
        emailInput.value = '';
        
        // Show success message
        showFormMessage(newsletterForm, 'Thank you for subscribing to our newsletter!', 'success');
        
        // Store subscriber in localStorage for demo purposes
        let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        subscribers.push({
            email,
            date: new Date().toISOString()
        });
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    });
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
 * Validate email format
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    // Simple email validation without regular expressions
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
