/**
 * Luxury Hotel & Resorts
 * Concierge Services JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize concierge functionality
    initConcierge();
});

/**
 * Initialize the concierge system
 */
function initConcierge() {
    // Load services
    loadConciergeServices();
    
    // Initialize service request form if it exists
    const requestForm = document.getElementById('service-request-form');
    if (requestForm) {
        initServiceRequestForm(requestForm);
    }
    
    // Load user's service requests if on the user account page
    const requestsContainer = document.getElementById('user-service-requests');
    if (requestsContainer) {
        loadUserServiceRequests();
    }
    
    // Initialize service category tabs if they exist
    const categoryTabs = document.getElementById('service-categories');
    if (categoryTabs) {
        initServiceCategories(categoryTabs);
    }
}

/**
 * Load and display concierge services
 * @param {string} category - Optional category filter
 */
function loadConciergeServices(category = null) {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    // Get services
    let services = [];
    
    if (category && category !== 'all') {
        services = db.getServicesByCategory(category);
    } else {
        services = db.getAllServices();
    }
    
    // Group services by category if no specific category is selected
    if (!category || category === 'all') {
        const servicesByCategory = {};
        
        services.forEach(service => {
            if (!servicesByCategory[service.category]) {
                servicesByCategory[service.category] = [];
            }
            servicesByCategory[service.category].push(service);
        });
        
        let servicesHTML = '';
        
        for (const [category, categoryServices] of Object.entries(servicesByCategory)) {
            servicesHTML += `
                <div class="service-category-section">
                    <h2 class="category-title">${formatCategoryName(category)}</h2>
                    <div class="services-grid">
            `;
            
            categoryServices.forEach(service => {
                servicesHTML += createServiceCard(service);
            });
            
            servicesHTML += `
                    </div>
                </div>
            `;
        }
        
        servicesContainer.innerHTML = servicesHTML;
    } else {
        // Display services for a specific category
        let servicesHTML = `<div class="services-grid">`;
        
        services.forEach(service => {
            servicesHTML += createServiceCard(service);
        });
        
        servicesHTML += `</div>`;
        servicesContainer.innerHTML = servicesHTML;
    }
    
    // Add event listeners to request buttons
    const requestButtons = servicesContainer.querySelectorAll('.request-service-btn');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            openServiceRequestModal(serviceId);
        });
    });
}

/**
 * Create HTML for a service card
 * @param {Object} service - The service object
 * @returns {string} - HTML for the service card
 */
function createServiceCard(service) {
    return `
        <div class="service-card">
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}">
            </div>
            <div class="service-details">
                <h3>${service.name}</h3>
                <p class="service-description">${service.description}</p>
                <div class="service-meta">
                    <div class="service-price">
                        <i class="fas fa-tag"></i> ${service.price}
                    </div>
                    <div class="service-availability">
                        <i class="fas fa-clock"></i> ${service.availability}
                    </div>
                </div>
                <button class="btn btn-primary request-service-btn" data-service-id="${service.id}">Request Service</button>
            </div>
        </div>
    `;
}

/**
 * Format category name for display
 * @param {string} category - Category key
 * @returns {string} - Formatted category name
 */
function formatCategoryName(category) {
    const categoryNames = {
        'dining': 'Dining Services',
        'wellness': 'Wellness & Spa',
        'transportation': 'Transportation',
        'business': 'Business Services',
        'childcare': 'Child Care',
        'special': 'Special Requests'
    };
    
    return categoryNames[category] || capitalizeWords(category);
}

/**
 * Initialize service category tabs
 * @param {HTMLElement} tabsContainer - Container for the category tabs
 */
function initServiceCategories(tabsContainer) {
    const tabs = tabsContainer.querySelectorAll('.category-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Load services for the selected category
            const category = this.getAttribute('data-category');
            loadConciergeServices(category);
        });
    });
}

/**
 * Initialize the service request form
 * @param {HTMLElement} form - The request form element
 */
function initServiceRequestForm(form) {
    // Check if there's a booking ID in the URL
    const urlParams = getUrlParams();
    if (urlParams.booking) {
        const bookingSelect = document.getElementById('request-booking');
        if (bookingSelect) {
            // Create option for the booking
            const booking = db.getBookingById(urlParams.booking);
            if (booking) {
                const option = document.createElement('option');
                option.value = booking.id;
                option.textContent = `${booking.roomName} - ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}`;
                option.selected = true;
                bookingSelect.appendChild(option);
            }
        }
    } else {
        // Load user bookings
        loadUserBookingsForSelect();
    }
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const bookingId = document.getElementById('request-booking').value;
        const serviceId = document.getElementById('request-service').value;
        const requestDate = document.getElementById('request-date').value;
        const requestTime = document.getElementById('request-time').value;
        const requestNotes = document.getElementById('request-notes').value.trim();
        
        // Validation
        if (!bookingId) {
            showFormMessage(form, 'Please select a booking or make a booking first.', 'error');
            return;
        }
        
        if (!serviceId) {
            showFormMessage(form, 'Please select a service.', 'error');
            return;
        }
        
        if (!requestDate) {
            showFormMessage(form, 'Please select a date for the service.', 'error');
            return;
        }
        
        // Get booking and service details
        const booking = db.getBookingById(bookingId);
        const service = db.getServiceById(serviceId);
        
        if (!booking) {
            showFormMessage(form, 'Selected booking not found. Please try again.', 'error');
            return;
        }
        
        if (!service) {
            showFormMessage(form, 'Selected service not found. Please try again.', 'error');
            return;
        }
        
        // Validate request date against booking dates
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const serviceDate = new Date(requestDate);
        
        if (serviceDate < bookingCheckIn || serviceDate >= bookingCheckOut) {
            showFormMessage(form, 'Service date must be during your stay.', 'error');
            return;
        }
        
        // Create service request object
        const requestData = {
            id: generateId('REQ'),
            bookingId,
            roomName: booking.roomName,
            guestName: `${booking.firstName} ${booking.lastName}`,
            serviceId,
            serviceName: service.name,
            serviceCategory: service.category,
            servicePrice: service.price,
            requestDate,
            requestTime: requestTime || 'Any time',
            notes: requestNotes,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save request to database
        db.createConciergeRequest(requestData);
        
        // Show success message
        showFormMessage(form, 'Your service request has been submitted! Our concierge team will confirm shortly.', 'success');
        
        // Reset form
        form.reset();
        
        // Reload user service requests if on the account page
        if (document.getElementById('user-service-requests')) {
            loadUserServiceRequests();
        }
    });
}

/**
 * Load user bookings for the booking select dropdown
 */
function loadUserBookingsForSelect() {
    const bookingSelect = document.getElementById('request-booking');
    if (!bookingSelect) return;
    
    // Get user bookings
    const bookings = db.getUserBookings().filter(booking => booking.status === 'confirmed');
    
    // Clear current options (except the placeholder)
    while (bookingSelect.options.length > 1) {
        bookingSelect.remove(1);
    }
    
    if (bookings.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No active bookings - Please make a booking first";
        option.disabled = true;
        bookingSelect.appendChild(option);
        return;
    }
    
    // Add bookings to select
    bookings.forEach(booking => {
        const option = document.createElement('option');
        option.value = booking.id;
        option.textContent = `${booking.roomName} - ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}`;
        bookingSelect.appendChild(option);
    });
}

/**
 * Load services for the service select dropdown
 * @param {string} category - Optional category filter
 */
function loadServicesForSelect(category = null) {
    const serviceSelect = document.getElementById('request-service');
    if (!serviceSelect) return;
    
    // Get services
    let services = [];
    
    if (category && category !== 'all') {
        services = db.getServicesByCategory(category);
    } else {
        services = db.getAllServices();
    }
    
    // Clear current options (except the placeholder)
    while (serviceSelect.options.length > 1) {
        serviceSelect.remove(1);
    }
    
    // Group services by category
    const servicesByCategory = {};
    
    services.forEach(service => {
        if (!servicesByCategory[service.category]) {
            servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push(service);
    });
    
    // Add services to select, grouped by category
    for (const [category, categoryServices] of Object.entries(servicesByCategory)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = formatCategoryName(category);
        
        categoryServices.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            optgroup.appendChild(option);
        });
        
        serviceSelect.appendChild(optgroup);
    }
}

/**
 * Load and display user's service requests
 */
function loadUserServiceRequests() {
    const requestsContainer = document.getElementById('user-service-requests');
    if (!requestsContainer) return;
    
    // Get user's service requests
    const requests = db.getUserConciergeRequests();
    
    if (requests.length === 0) {
        requestsContainer.innerHTML = `
            <div class="no-requests">
                <h3>No Service Requests</h3>
                <p>You haven't made any concierge service requests yet.</p>
                <a href="concierge.html" class="btn btn-primary">Explore Services</a>
            </div>
        `;
        return;
    }
    
    // Sort requests by date (most recent first)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Create HTML for each request
    let requestsHTML = '';
    
    requests.forEach(request => {
        const requestDate = formatDate(request.requestDate);
        const createdDate = formatDate(request.createdAt);
        
        requestsHTML += `
            <div class="request-card">
                <div class="request-header">
                    <h3>${request.serviceName}</h3>
                    <span class="request-status request-status-${request.status}">${capitalizeWords(request.status)}</span>
                </div>
                <div class="request-details">
                    <div class="request-info">
                        <p><strong>Booking:</strong> ${request.roomName}</p>
                        <p><strong>Requested for:</strong> ${requestDate} ${request.requestTime !== 'Any time' ? `at ${request.requestTime}` : ''}</p>
                        <p><strong>Request made on:</strong> ${createdDate}</p>
                    </div>
                    ${request.notes ? `
                    <div class="request-notes">
                        <h4>Special Instructions:</h4>
                        <p>${request.notes}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="request-actions">
                    ${request.status === 'pending' ? `
                    <button class="btn btn-tertiary cancel-request-btn" data-request-id="${request.id}">Cancel Request</button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    // Update requests container
    requestsContainer.innerHTML = requestsHTML;
    
    // Add event listeners to cancel buttons
    const cancelButtons = requestsContainer.querySelectorAll('.cancel-request-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            confirmCancelRequest(requestId);
        });
    });
}

/**
 * Open service request modal
 * @param {string} serviceId - ID of the selected service
 */
function openServiceRequestModal(serviceId) {
    // Get service details
    const service = db.getServiceById(serviceId);
    if (!service) return;
    
    // Check if user has any active bookings
    const bookings = db.getUserBookings().filter(booking => booking.status === 'confirmed');
    
    if (bookings.length === 0) {
        createConfirmationModal({
            title: 'Booking Required',
            message: 'You need to have an active booking to request this service. Would you like to make a booking now?',
            confirmText: 'Make a Booking',
            cancelText: 'Not Now',
            onConfirm: () => {
                window.location.href = 'booking.html';
            }
        });
        return;
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal service-request-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Request ${service.name}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="service-details-header">
                    <div class="service-image">
                        <img src="${service.image}" alt="${service.name}">
                    </div>
                    <div class="service-overview">
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                        <div class="service-meta">
                            <div class="service-price">
                                <i class="fas fa-tag"></i> ${service.price}
                            </div>
                            <div class="service-availability">
                                <i class="fas fa-clock"></i> ${service.availability}
                            </div>
                        </div>
                    </div>
                </div>
                
                <form id="modal-request-form" class="service-request-form">
                    <input type="hidden" id="modal-service-id" value="${service.id}">
                    
                    <div class="form-group">
                        <label for="modal-booking">Select Your Booking</label>
                        <select id="modal-booking" required>
                            <option value="">Select a booking</option>
                            ${bookings.map(booking => `
                                <option value="${booking.id}">${booking.roomName} - ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-date">Requested Date</label>
                        <input type="date" id="modal-date" required>
                        <p class="form-help">Please select a date during your stay.</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-time">Preferred Time (Optional)</label>
                        <input type="time" id="modal-time">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-notes">Special Instructions (Optional)</label>
                        <textarea id="modal-notes" rows="3" placeholder="Any specific requirements or preferences..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-tertiary cancel-modal-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Setup date constraints based on selected booking
    const bookingSelect = modal.querySelector('#modal-booking');
    const dateInput = modal.querySelector('#modal-date');
    
    bookingSelect.addEventListener('change', function() {
        const bookingId = this.value;
        if (!bookingId) return;
        
        const booking = db.getBookingById(bookingId);
        if (booking) {
            dateInput.min = booking.checkIn;
            dateInput.max = booking.checkOut;
            
            // Set default date to check-in date
            dateInput.value = booking.checkIn;
        }
    });
    
    // Form submission
    const requestForm = modal.querySelector('#modal-request-form');
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const serviceId = modal.querySelector('#modal-service-id').value;
        const bookingId = modal.querySelector('#modal-booking').value;
        const requestDate = modal.querySelector('#modal-date').value;
        const requestTime = modal.querySelector('#modal-time').value;
        const requestNotes = modal.querySelector('#modal-notes').value.trim();
        
        // Validation
        if (!bookingId) {
            showFormMessage(requestForm, 'Please select a booking.', 'error');
            return;
        }
        
        if (!requestDate) {
            showFormMessage(requestForm, 'Please select a date for the service.', 'error');
            return;
        }
        
        // Get booking and service details
        const booking = db.getBookingById(bookingId);
        
        if (!booking) {
            showFormMessage(requestForm, 'Selected booking not found. Please try again.', 'error');
            return;
        }
        
        // Create service request object
        const requestData = {
            id: generateId('REQ'),
            bookingId,
            roomName: booking.roomName,
            guestName: `${booking.firstName} ${booking.lastName}`,
            serviceId,
            serviceName: service.name,
            serviceCategory: service.category,
            servicePrice: service.price,
            requestDate,
            requestTime: requestTime || 'Any time',
            notes: requestNotes,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save request to database
        db.createConciergeRequest(requestData);
        
        // Show success message
        showFormMessage(requestForm, 'Your service request has been submitted! Our concierge team will confirm shortly.', 'success');
        
        // Close modal after a delay
        setTimeout(() => {
            closeModal(modal);
            
            // Reload user service requests if on the account page
            if (document.getElementById('user-service-requests')) {
                loadUserServiceRequests();
            }
        }, 2000);
    });
    
    // Add event listeners to close and cancel buttons
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function() {
        closeModal(modal);
    });
    
    const cancelButton = modal.querySelector('.cancel-modal-btn');
    cancelButton.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal(modal);
        }
    });
}

/**
 * Confirm cancellation of a service request
 * @param {string} requestId - ID of the request to cancel
 */
function confirmCancelRequest(requestId) {
    // Get request details
    const request = db.getConciergeRequestById(requestId);
    if (!request) return;
    
    createConfirmationModal({
        title: 'Cancel Service Request',
        message: `Are you sure you want to cancel your request for ${request.serviceName} on ${formatDate(request.requestDate)}?`,
        confirmText: 'Yes, Cancel Request',
        cancelText: 'No, Keep Request',
        onConfirm: () => {
            // Update request status
            request.status = 'cancelled';
            db.saveConciergeRequests();
            
            // Reload user service requests
            loadUserServiceRequests();
            
            // Show success message
            const requestsContainer = document.getElementById('user-service-requests');
            if (requestsContainer) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'form-message success';
                messageDiv.textContent = 'Your service request has been cancelled.';
                requestsContainer.insertAdjacentElement('beforebegin', messageDiv);
                
                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);
            }
        }
    });
}
