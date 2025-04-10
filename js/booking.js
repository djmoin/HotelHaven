/**
 * Luxury Hotel & Resorts
 * Booking System JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking functionality
    initBookingSystem();
});

/**
 * Initialize the booking system
 */
function initBookingSystem() {
    // Load the appropriate booking functionality based on the page
    if (document.getElementById('booking-search-form')) {
        initBookingSearch();
    }
    
    if (document.getElementById('room-booking-form')) {
        initRoomBooking();
    }
    
    if (document.getElementById('booking-management')) {
        loadUserBookings();
    }
    
    if (document.getElementById('group-booking-form')) {
        initGroupBooking();
    }
    
    if (document.getElementById('cancellation-policy')) {
        initCancellationPolicy();
    }
    
    if (document.getElementById('billing-summary')) {
        loadBillingSummary();
    }
}

/**
 * Initialize booking search functionality
 */
function initBookingSearch() {
    const searchForm = document.getElementById('booking-search-form');
    const resultsContainer = document.getElementById('search-results');
    
    // Load any existing search parameters from session storage
    const storedSearch = sessionStorage.getItem('bookingSearch');
    if (storedSearch) {
        const searchParams = JSON.parse(storedSearch);
        
        // Fill the form with stored search parameters
        document.getElementById('search-check-in').value = searchParams.checkIn;
        document.getElementById('search-check-out').value = searchParams.checkOut;
        document.getElementById('search-guests').value = searchParams.guests;
        document.getElementById('search-rooms').value = searchParams.rooms;
        
        // Perform search with stored parameters
        performSearch(searchParams);
    }
    
    // Handle search form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const checkIn = document.getElementById('search-check-in').value;
        const checkOut = document.getElementById('search-check-out').value;
        const guests = document.getElementById('search-guests').value;
        const rooms = document.getElementById('search-rooms').value;
        
        // Validate dates
        if (new Date(checkIn) >= new Date(checkOut)) {
            showFormMessage(searchForm, 'Check-out date must be after check-in date.', 'error');
            return;
        }
        
        // Create search parameters object
        const searchParams = {
            checkIn,
            checkOut,
            guests,
            rooms
        };
        
        // Store search parameters in session storage
        sessionStorage.setItem('bookingSearch', JSON.stringify(searchParams));
        
        // Perform search
        performSearch(searchParams);
    });
    
    // Function to perform search
    function performSearch(params) {
        // Clear previous results
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="loading">Searching for available rooms...</div>';
        }
        
        // Calculate stay duration
        const checkInDate = new Date(params.checkIn);
        const checkOutDate = new Date(params.checkOut);
        const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        // Get available rooms from database
        const availableRooms = db.getRoomsAvailability(params.checkIn, params.checkOut, params.rooms);
        
        // Display loading state briefly for better UX
        setTimeout(() => {
            displaySearchResults(availableRooms, params, nights);
        }, 800);
    }
    
    // Function to display search results
    function displaySearchResults(rooms, params, nights) {
        if (!resultsContainer) return;
        
        if (rooms.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No Available Rooms</h3>
                    <p>We couldn't find any rooms matching your criteria. Please try different dates or room preferences.</p>
                </div>
            `;
            return;
        }
        
        // Display search summary
        const searchSummary = document.createElement('div');
        searchSummary.className = 'search-summary';
        searchSummary.innerHTML = `
            <h3>Available Accommodations</h3>
            <p>
                <strong>${formatDate(params.checkIn)}</strong> to 
                <strong>${formatDate(params.checkOut)}</strong> · 
                <strong>${nights}</strong> night${nights !== 1 ? 's' : ''} · 
                <strong>${params.guests}</strong> guest${params.guests !== '1' ? 's' : ''} · 
                <strong>${params.rooms}</strong> room${params.rooms !== '1' ? 's' : ''}
            </p>
        `;
        
        // Create results HTML
        let resultsHTML = '';
        
        rooms.forEach(room => {
            const totalPrice = room.price * nights;
            
            resultsHTML += `
                <div class="room-card search-result">
                    <div class="room-image">
                        <img src="${room.image}" alt="${room.name}">
                    </div>
                    <div class="room-details">
                        <h3>${room.name}</h3>
                        <p class="room-description">${room.description}</p>
                        <div class="room-features">
                            ${room.features.map(feature => `<span><i class="fas fa-${feature.icon}"></i> ${feature.name}</span>`).join('')}
                        </div>
                        <div class="room-capacity">
                            <span><i class="fas fa-user"></i> Max ${room.capacity} guests</span>
                        </div>
                        <div class="room-price">
                            <span class="price">$${room.price}</span> per night
                            <span class="total-price">$${totalPrice} total for ${nights} night${nights !== 1 ? 's' : ''}</span>
                        </div>
                        <a href="room-details.html?id=${room.id}&checkIn=${params.checkIn}&checkOut=${params.checkOut}&guests=${params.guests}" class="btn btn-secondary">View Details</a>
                        <button class="btn btn-primary book-now-btn" data-room-id="${room.id}">Book Now</button>
                    </div>
                </div>
            `;
        });
        
        // Update results container
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(searchSummary);
        
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'search-results-grid';
        resultsGrid.innerHTML = resultsHTML;
        resultsContainer.appendChild(resultsGrid);
        
        // Add event listeners to "Book Now" buttons
        const bookButtons = resultsContainer.querySelectorAll('.book-now-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', function() {
                const roomId = this.getAttribute('data-room-id');
                
                // Store booking details in session storage
                sessionStorage.setItem('pendingBooking', JSON.stringify({
                    roomId,
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    guests: params.guests,
                    nights
                }));
                
                // Redirect to booking form
                window.location.href = `room-details.html?id=${roomId}&booking=true&checkIn=${params.checkIn}&checkOut=${params.checkOut}&guests=${params.guests}`;
            });
        });
    }
}

/**
 * Initialize individual room booking
 */
function initRoomBooking() {
    const bookingForm = document.getElementById('room-booking-form');
    if (!bookingForm) return;
    
    // Get room ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    
    if (!roomId) {
        window.location.href = 'booking.html';
        return;
    }
    
    // Get room details
    const room = db.getRoomById(roomId);
    if (!room) {
        showFormMessage(bookingForm, 'Room not found. Please try again.', 'error');
        return;
    }
    
    // Display room details in the form
    const roomDetailsElement = document.getElementById('booking-room-details');
    if (roomDetailsElement) {
        roomDetailsElement.innerHTML = `
            <h3>${room.name}</h3>
            <p class="room-description">${room.description}</p>
            <div class="room-price">
                <span class="price">$${room.price}</span> per night
            </div>
        `;
    }
    
    // Fill form with data from URL parameters or session storage
    const pendingBooking = JSON.parse(sessionStorage.getItem('pendingBooking') || '{}');
    
    if (urlParams.get('checkIn')) {
        document.getElementById('booking-check-in').value = urlParams.get('checkIn');
    } else if (pendingBooking.checkIn) {
        document.getElementById('booking-check-in').value = pendingBooking.checkIn;
    }
    
    if (urlParams.get('checkOut')) {
        document.getElementById('booking-check-out').value = urlParams.get('checkOut');
    } else if (pendingBooking.checkOut) {
        document.getElementById('booking-check-out').value = pendingBooking.checkOut;
    }
    
    if (urlParams.get('guests')) {
        document.getElementById('booking-guests').value = urlParams.get('guests');
    } else if (pendingBooking.guests) {
        document.getElementById('booking-guests').value = pendingBooking.guests;
    }
    
    // Update booking summary whenever form changes
    const updateBookingSummary = function() {
        const checkIn = document.getElementById('booking-check-in').value;
        const checkOut = document.getElementById('booking-check-out').value;
        
        if (!checkIn || !checkOut) return;
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) return;
        
        const roomPrice = room.price;
        const roomTotal = roomPrice * nights;
        const taxRate = 0.12; // 12% tax
        const taxAmount = roomTotal * taxRate;
        const grandTotal = roomTotal + taxAmount;
        
        const summaryElement = document.getElementById('booking-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <h3>Booking Summary</h3>
                <div class="summary-item">
                    <span>Room Rate:</span>
                    <span>$${roomPrice} per night</span>
                </div>
                <div class="summary-item">
                    <span>Stay Duration:</span>
                    <span>${nights} night${nights !== 1 ? 's' : ''}</span>
                </div>
                <div class="summary-item">
                    <span>Room Total:</span>
                    <span>$${roomTotal.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span>Taxes (12%):</span>
                    <span>$${taxAmount.toFixed(2)}</span>
                </div>
                <div class="summary-item total">
                    <span>Grand Total:</span>
                    <span>$${grandTotal.toFixed(2)}</span>
                </div>
            `;
        }
    };
    
    // Initial update
    updateBookingSummary();
    
    // Update on form field changes
    document.getElementById('booking-check-in').addEventListener('change', updateBookingSummary);
    document.getElementById('booking-check-out').addEventListener('change', updateBookingSummary);
    
    // Handle form submission
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('booking-first-name').value.trim();
        const lastName = document.getElementById('booking-last-name').value.trim();
        const email = document.getElementById('booking-email').value.trim();
        const phone = document.getElementById('booking-phone').value.trim();
        const checkIn = document.getElementById('booking-check-in').value;
        const checkOut = document.getElementById('booking-check-out').value;
        const guests = document.getElementById('booking-guests').value;
        const specialRequests = document.getElementById('booking-special-requests').value.trim();
        
        // Form validation
        if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut) {
            showFormMessage(bookingForm, 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage(bookingForm, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Calculate stay duration and price
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) {
            showFormMessage(bookingForm, 'Check-out date must be after check-in date.', 'error');
            return;
        }
        
        const roomPrice = room.price;
        const roomTotal = roomPrice * nights;
        const taxRate = 0.12; // 12% tax
        const taxAmount = roomTotal * taxRate;
        const grandTotal = roomTotal + taxAmount;
        
        // Create booking object
        const bookingData = {
            id: generateBookingId(),
            roomId,
            roomName: room.name,
            roomImage: room.image,
            firstName,
            lastName,
            email,
            phone,
            checkIn,
            checkOut,
            nights,
            guests,
            specialRequests,
            price: {
                roomRate: roomPrice,
                roomTotal,
                tax: taxAmount,
                grandTotal
            },
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save booking to database
        db.createBooking(bookingData);
        
        // Clear session storage
        sessionStorage.removeItem('pendingBooking');
        
        // Show success message
        showFormMessage(bookingForm, 'Your booking has been confirmed! Redirecting to your bookings page...', 'success');
        
        // Redirect to bookings management page
        setTimeout(() => {
            window.location.href = 'account.html?view=bookings';
        }, 2500);
    });
}

/**
 * Initialize group booking functionality
 */
function initGroupBooking() {
    const groupBookingForm = document.getElementById('group-booking-form');
    if (!groupBookingForm) return;
    
    // Handle adding additional rooms
    const addRoomButton = document.getElementById('add-room-btn');
    const roomsContainer = document.getElementById('group-rooms-container');
    
    if (addRoomButton && roomsContainer) {
        let roomCount = 1;
        
        addRoomButton.addEventListener('click', function() {
            roomCount++;
            
            // Create new room section
            const roomSection = document.createElement('div');
            roomSection.className = 'group-room-section';
            roomSection.innerHTML = `
                <h3>Room ${roomCount}</h3>
                <div class="form-group">
                    <label for="room-type-${roomCount}">Room Type</label>
                    <select id="room-type-${roomCount}" name="room-type-${roomCount}" required>
                        <option value="">Select Room Type</option>
                        <option value="1">Deluxe King Room</option>
                        <option value="2">Executive Suite</option>
                        <option value="3">Family Suite</option>
                        <option value="4">Standard Queen Room</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="room-guests-${roomCount}">Number of Guests</label>
                    <select id="room-guests-${roomCount}" name="room-guests-${roomCount}" required>
                        <option value="1">1 Guest</option>
                        <option value="2" selected>2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="guest-name-${roomCount}">Primary Guest Name</label>
                        <input type="text" id="guest-name-${roomCount}" name="guest-name-${roomCount}" placeholder="Full Name" required>
                    </div>
                </div>
                <div class="remove-room-btn" data-room="${roomCount}">Remove Room</div>
            `;
            
            roomsContainer.appendChild(roomSection);
            
            // Add event listener to remove button
            const removeButton = roomSection.querySelector('.remove-room-btn');
            removeButton.addEventListener('click', function() {
                const roomNumber = this.getAttribute('data-room');
                const roomElement = document.querySelector(`.group-room-section:nth-child(${roomNumber})`);
                if (roomElement) {
                    roomElement.remove();
                    
                    // Renumber remaining rooms
                    const roomSections = document.querySelectorAll('.group-room-section');
                    roomSections.forEach((section, index) => {
                        const heading = section.querySelector('h3');
                        if (heading) {
                            heading.textContent = `Room ${index + 1}`;
                        }
                    });
                    
                    roomCount = roomSections.length;
                }
            });
        });
    }
    
    // Handle form submission
    groupBookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get main form values
        const groupName = document.getElementById('group-name').value.trim();
        const contactName = document.getElementById('contact-name').value.trim();
        const contactEmail = document.getElementById('contact-email').value.trim();
        const contactPhone = document.getElementById('contact-phone').value.trim();
        const checkIn = document.getElementById('group-check-in').value;
        const checkOut = document.getElementById('group-check-out').value;
        
        // Form validation
        if (!groupName || !contactName || !contactEmail || !contactPhone || !checkIn || !checkOut) {
            showFormMessage(groupBookingForm, 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(contactEmail)) {
            showFormMessage(groupBookingForm, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Get room data
        const roomSections = document.querySelectorAll('.group-room-section');
        const rooms = [];
        
        roomSections.forEach((section, index) => {
            const roomNumber = index + 1;
            const roomType = document.getElementById(`room-type-${roomNumber}`);
            const roomGuests = document.getElementById(`room-guests-${roomNumber}`);
            const guestName = document.getElementById(`guest-name-${roomNumber}`);
            
            if (roomType && roomGuests && guestName) {
                rooms.push({
                    roomNumber,
                    roomTypeId: roomType.value,
                    roomTypeName: roomType.options[roomType.selectedIndex].text,
                    guests: roomGuests.value,
                    guestName: guestName.value.trim()
                });
            }
        });
        
        if (rooms.length === 0) {
            showFormMessage(groupBookingForm, 'Please add at least one room.', 'error');
            return;
        }
        
        // Calculate stay duration
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) {
            showFormMessage(groupBookingForm, 'Check-out date must be after check-in date.', 'error');
            return;
        }
        
        // Create group booking object
        const groupBookingData = {
            id: generateBookingId('GROUP'),
            groupName,
            contactName,
            contactEmail,
            contactPhone,
            checkIn,
            checkOut,
            nights,
            rooms,
            specialRequests: document.getElementById('group-special-requests').value.trim(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save group booking to database
        db.createGroupBooking(groupBookingData);
        
        // Show success message
        showFormMessage(groupBookingForm, 'Your group booking request has been submitted! Our team will contact you shortly to confirm details.', 'success');
        
        // Reset form
        groupBookingForm.reset();
        
        // Remove additional room sections
        const additionalRooms = document.querySelectorAll('.group-room-section:not(:first-child)');
        additionalRooms.forEach(room => room.remove());
        
        // Redirect to bookings management page
        setTimeout(() => {
            window.location.href = 'account.html?view=bookings';
        }, 3000);
    });
}

/**
 * Load user bookings and display them
 */
function loadUserBookings() {
    const bookingsContainer = document.getElementById('user-bookings');
    if (!bookingsContainer) return;
    
    // Get bookings from database
    const bookings = db.getUserBookings();
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <h3>No Bookings Found</h3>
                <p>You don't have any bookings yet. Start planning your stay!</p>
                <a href="booking.html" class="btn btn-primary">Book Now</a>
            </div>
        `;
        return;
    }
    
    // Sort bookings by check-in date (most recent first)
    bookings.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
    
    // Create HTML for each booking
    let bookingsHTML = '';
    
    bookings.forEach(booking => {
        const checkInDate = formatDate(booking.checkIn);
        const checkOutDate = formatDate(booking.checkOut);
        
        // Determine if booking can be cancelled (more than 48 hours before check-in)
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        const hoursDiff = Math.round((checkIn - now) / (1000 * 60 * 60));
        const canCancel = hoursDiff > 48 && booking.status !== 'cancelled';
        
        bookingsHTML += `
            <div class="booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}">
                <div class="booking-image">
                    <img src="${booking.roomImage}" alt="${booking.roomName}">
                </div>
                <div class="booking-details">
                    <div class="booking-header">
                        <h3>${booking.roomName}</h3>
                        <span class="booking-status booking-status-${booking.status}">${capitalizeFirstLetter(booking.status)}</span>
                    </div>
                    <div class="booking-info">
                        <p>
                            <strong>Booking ID:</strong> ${booking.id}<br>
                            <strong>Dates:</strong> ${checkInDate} to ${checkOutDate} (${booking.nights} night${booking.nights !== 1 ? 's' : ''})<br>
                            <strong>Guests:</strong> ${booking.guests}<br>
                            <strong>Total Amount:</strong> $${booking.price.grandTotal.toFixed(2)}
                        </p>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-secondary view-booking-btn" data-booking-id="${booking.id}">View Details</button>
                        ${canCancel ? `<button class="btn btn-tertiary cancel-booking-btn" data-booking-id="${booking.id}">Cancel Booking</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update bookings container
    bookingsContainer.innerHTML = bookingsHTML;
    
    // Add event listeners to booking buttons
    const viewButtons = bookingsContainer.querySelectorAll('.view-booking-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            openBookingDetails(bookingId);
        });
    });
    
    const cancelButtons = bookingsContainer.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            confirmCancelBooking(bookingId);
        });
    });
}

/**
 * Open booking details modal
 * 
 * @param {string} bookingId - The booking ID
 */
function openBookingDetails(bookingId) {
    // Get booking from database
    const booking = db.getBookingById(bookingId);
    if (!booking) return;
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal booking-details-modal';
    
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    const createdDate = formatDate(booking.createdAt);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Booking Details</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-detail-header">
                    <div class="booking-image">
                        <img src="${booking.roomImage}" alt="${booking.roomName}">
                    </div>
                    <div class="booking-overview">
                        <h3>${booking.roomName}</h3>
                        <div class="booking-dates">
                            <div class="date-item">
                                <span class="date-label">Check-in</span>
                                <span class="date-value">${checkInDate}</span>
                            </div>
                            <div class="date-separator"></div>
                            <div class="date-item">
                                <span class="date-label">Check-out</span>
                                <span class="date-value">${checkOutDate}</span>
                            </div>
                        </div>
                        <div class="booking-status booking-status-${booking.status}">${capitalizeFirstLetter(booking.status)}</div>
                    </div>
                </div>
                
                <div class="booking-detail-section">
                    <h4>Reservation Information</h4>
                    <div class="detail-item">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${booking.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Booking Date:</span>
                        <span class="detail-value">${createdDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Stay Duration:</span>
                        <span class="detail-value">${booking.nights} night${booking.nights !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Guests:</span>
                        <span class="detail-value">${booking.guests}</span>
                    </div>
                </div>
                
                <div class="booking-detail-section">
                    <h4>Guest Information</h4>
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${booking.firstName} ${booking.lastName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${booking.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${booking.phone}</span>
                    </div>
                </div>
                
                ${booking.specialRequests ? `
                <div class="booking-detail-section">
                    <h4>Special Requests</h4>
                    <p class="special-requests">${booking.specialRequests}</p>
                </div>
                ` : ''}
                
                <div class="booking-detail-section">
                    <h4>Price Details</h4>
                    <div class="price-summary">
                        <div class="price-item">
                            <span class="price-label">Room Rate:</span>
                            <span class="price-value">$${booking.price.roomRate.toFixed(2)} × ${booking.nights} night${booking.nights !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Room Total:</span>
                            <span class="price-value">$${booking.price.roomTotal.toFixed(2)}</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Taxes (12%):</span>
                            <span class="price-value">$${booking.price.tax.toFixed(2)}</span>
                        </div>
                        <div class="price-item total">
                            <span class="price-label">Grand Total:</span>
                            <span class="price-value">$${booking.price.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="booking-detail-actions">
                    <button class="btn btn-secondary print-booking-btn">Print Booking</button>
                    ${booking.status !== 'cancelled' ? `
                    <a href="concierge.html?booking=${booking.id}" class="btn btn-primary">Request Services</a>
                    ` : ''}
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
    
    // Add event listener to close button
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal(modal);
        }
    });
    
    // Add event listener to print button
    const printButton = modal.querySelector('.print-booking-btn');
    printButton.addEventListener('click', function() {
        printBooking(booking);
    });
}

/**
 * Confirm booking cancellation
 * 
 * @param {string} bookingId - The booking ID
 */
function confirmCancelBooking(bookingId) {
    // Get booking from database
    const booking = db.getBookingById(bookingId);
    if (!booking) return;
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal confirmation-modal';
    
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Cancel Booking</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="confirmation-message">Are you sure you want to cancel this booking?</p>
                
                <div class="booking-summary">
                    <p>
                        <strong>${booking.roomName}</strong><br>
                        ${checkInDate} to ${checkOutDate} (${booking.nights} night${booking.nights !== 1 ? 's' : ''})<br>
                        Booking ID: ${booking.id}
                    </p>
                </div>
                
                <div class="cancellation-policy">
                    <h4>Cancellation Policy</h4>
                    <p>If you cancel this booking:</p>
                    <ul>
                        <li>More than 48 hours before check-in: Full refund</li>
                        <li>Less than 48 hours before check-in: No refund</li>
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-tertiary cancel-modal-btn">Go Back</button>
                    <button class="btn btn-primary confirm-cancel-btn">Confirm Cancellation</button>
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
    
    // Add event listener to close button
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Add event listener to cancel button
    const cancelButton = modal.querySelector('.cancel-modal-btn');
    cancelButton.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Add event listener to confirm button
    const confirmButton = modal.querySelector('.confirm-cancel-btn');
    confirmButton.addEventListener('click', function() {
        // Cancel booking in database
        db.cancelBooking(bookingId);
        
        // Close modal
        closeModal(modal);
        
        // Show success message
        const bookingManagement = document.getElementById('booking-management');
        if (bookingManagement) {
            showFormMessage(bookingManagement, 'Your booking has been cancelled successfully.', 'success');
        }
        
        // Reload bookings
        loadUserBookings();
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal(modal);
        }
    });
}

/**
 * Initialize cancellation policy section
 */
function initCancellationPolicy() {
    const policyContainer = document.getElementById('cancellation-policy');
    if (!policyContainer) return;
    
    // Add accordion functionality to policy sections
    const policyHeadings = policyContainer.querySelectorAll('.policy-heading');
    
    policyHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Load billing summary data
 */
function loadBillingSummary() {
    const summaryContainer = document.getElementById('billing-summary');
    if (!summaryContainer) return;
    
    // Get booking ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');
    
    if (!bookingId) {
        summaryContainer.innerHTML = `
            <div class="error-message">
                <h3>Booking Not Found</h3>
                <p>No booking ID was specified. Please try again.</p>
                <a href="account.html?view=bookings" class="btn btn-primary">View Your Bookings</a>
            </div>
        `;
        return;
    }
    
    // Get booking from database
    const booking = db.getBookingById(bookingId);
    if (!booking) {
        summaryContainer.innerHTML = `
            <div class="error-message">
                <h3>Booking Not Found</h3>
                <p>The specified booking could not be found. Please try again.</p>
                <a href="account.html?view=bookings" class="btn btn-primary">View Your Bookings</a>
            </div>
        `;
        return;
    }
    
    // Get additional charges for the booking
    const additionalCharges = db.getBookingCharges(bookingId);
    
    // Calculate totals
    const roomTotal = booking.price.roomTotal;
    const taxAmount = booking.price.tax;
    let additionalTotal = 0;
    
    additionalCharges.forEach(charge => {
        additionalTotal += charge.amount;
    });
    
    const grandTotal = roomTotal + taxAmount + additionalTotal;
    
    // Format dates
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    
    // Create billing summary HTML
    let summaryHTML = `
        <div class="billing-header">
            <h2>Billing Summary</h2>
            <div class="booking-info">
                <p>
                    <strong>Booking ID:</strong> ${booking.id}<br>
                    <strong>Room:</strong> ${booking.roomName}<br>
                    <strong>Dates:</strong> ${checkInDate} to ${checkOutDate} (${booking.nights} night${booking.nights !== 1 ? 's' : ''})<br>
                    <strong>Guest:</strong> ${booking.firstName} ${booking.lastName}
                </p>
            </div>
        </div>
        
        <div class="billing-content">
            <div class="charges-section">
                <h3>Room Charges</h3>
                <div class="charge-item">
                    <div class="charge-details">
                        <span class="charge-name">Room Rate</span>
                        <span class="charge-description">${booking.nights} night${booking.nights !== 1 ? 's' : ''} × $${booking.price.roomRate.toFixed(2)}</span>
                    </div>
                    <div class="charge-amount">
                        $${roomTotal.toFixed(2)}
                    </div>
                </div>
                
                <div class="charge-item">
                    <div class="charge-details">
                        <span class="charge-name">Taxes</span>
                        <span class="charge-description">12% room tax</span>
                    </div>
                    <div class="charge-amount">
                        $${taxAmount.toFixed(2)}
                    </div>
                </div>
            </div>
    `;
    
    // Add additional charges section if there are any
    if (additionalCharges.length > 0) {
        summaryHTML += `
            <div class="charges-section">
                <h3>Additional Charges</h3>
        `;
        
        additionalCharges.forEach(charge => {
            summaryHTML += `
                <div class="charge-item">
                    <div class="charge-details">
                        <span class="charge-name">${charge.name}</span>
                        <span class="charge-description">${charge.description}</span>
                    </div>
                    <div class="charge-amount">
                        $${charge.amount.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        summaryHTML += `
            </div>
        `;
    }
    
    // Add total and payment options
    summaryHTML += `
            <div class="charges-total">
                <div class="charge-item total">
                    <div class="charge-details">
                        <span class="charge-name">Grand Total</span>
                    </div>
                    <div class="charge-amount">
                        $${grandTotal.toFixed(2)}
                    </div>
                </div>
            </div>
            
            <div class="payment-options">
                <h3>Payment Options</h3>
                <p>Your card on file will be charged upon check-out. You can change your payment method at the front desk during your stay.</p>
                <div class="payment-methods">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amex/amex-original.svg" alt="American Express">
                </div>
            </div>
        </div>
        
        <div class="billing-actions">
            <button class="btn btn-secondary print-billing-btn">Print Billing Summary</button>
            <a href="account.html?view=bookings" class="btn btn-primary">Back to Bookings</a>
        </div>
    `;
    
    // Update summary container
    summaryContainer.innerHTML = summaryHTML;
    
    // Add event listener to print button
    const printButton = summaryContainer.querySelector('.print-billing-btn');
    if (printButton) {
        printButton.addEventListener('click', function() {
            printBillingSummary(booking, additionalCharges, grandTotal);
        });
    }
}

/**
 * Print booking details
 * 
 * @param {Object} booking - The booking object
 */
function printBooking(booking) {
    const printWindow = window.open('', '_blank');
    
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Booking Confirmation - ${booking.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #1A4B84;
                }
                .booking-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ccc;
                }
                .booking-details {
                    margin-bottom: 30px;
                }
                .detail-row {
                    display: flex;
                    margin-bottom: 10px;
                }
                .detail-label {
                    font-weight: bold;
                    width: 150px;
                }
                .price-summary {
                    margin-top: 30px;
                    border-top: 1px solid #ccc;
                    padding-top: 20px;
                }
                .price-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .total {
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="booking-header">
                <h1>Booking Confirmation</h1>
                <p>Thank you for choosing Luxury Hotel & Resorts</p>
            </div>
            
            <div class="booking-details">
                <h2>Reservation Details</h2>
                
                <div class="detail-row">
                    <div class="detail-label">Booking ID:</div>
                    <div>${booking.id}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Room:</div>
                    <div>${booking.roomName}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Check-in:</div>
                    <div>${checkInDate}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Check-out:</div>
                    <div>${checkOutDate}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Stay Duration:</div>
                    <div>${booking.nights} night${booking.nights !== 1 ? 's' : ''}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Guests:</div>
                    <div>${booking.guests}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Guest Name:</div>
                    <div>${booking.firstName} ${booking.lastName}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Contact Email:</div>
                    <div>${booking.email}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Contact Phone:</div>
                    <div>${booking.phone}</div>
                </div>
                
                ${booking.specialRequests ? `
                <div class="detail-row">
                    <div class="detail-label">Special Requests:</div>
                    <div>${booking.specialRequests}</div>
                </div>
                ` : ''}
                
                <div class="price-summary">
                    <h3>Price Summary</h3>
                    
                    <div class="price-row">
                        <div>Room Rate:</div>
                        <div>$${booking.price.roomRate.toFixed(2)} × ${booking.nights} night${booking.nights !== 1 ? 's' : ''}</div>
                    </div>
                    
                    <div class="price-row">
                        <div>Room Total:</div>
                        <div>$${booking.price.roomTotal.toFixed(2)}</div>
                    </div>
                    
                    <div class="price-row">
                        <div>Taxes (12%):</div>
                        <div>$${booking.price.tax.toFixed(2)}</div>
                    </div>
                    
                    <div class="price-row total">
                        <div>Grand Total:</div>
                        <div>$${booking.price.grandTotal.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Luxury Hotel & Resorts</strong><br>
                1234 Luxury Avenue, New York, NY 10001<br>
                Phone: +1 (212) 555-1234 | Email: info@luxuryhotel.com</p>
                
                <p>Cancellation Policy: Free cancellation up to 48 hours before check-in.</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

/**
 * Print billing summary
 * 
 * @param {Object} booking - The booking object
 * @param {Array} additionalCharges - Array of additional charges
 * @param {number} grandTotal - The grand total amount
 */
function printBillingSummary(booking, additionalCharges, grandTotal) {
    const printWindow = window.open('', '_blank');
    
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    const currentDate = formatDate(new Date().toISOString());
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Billing Summary - ${booking.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #1A4B84;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ccc;
                }
                .invoice-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }
                .invoice-info-column {
                    flex: 1;
                }
                .charges-section {
                    margin-bottom: 30px;
                }
                .charge-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .charge-details {
                    flex: 1;
                }
                .charge-name {
                    font-weight: bold;
                }
                .charge-description {
                    font-size: 0.9em;
                    color: #666;
                }
                .charge-amount {
                    text-align: right;
                    width: 100px;
                }
                .total {
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>Billing Summary</h1>
                <p>Luxury Hotel & Resorts</p>
            </div>
            
            <div class="invoice-info">
                <div class="invoice-info-column">
                    <h3>Guest Information:</h3>
                    <p>
                        ${booking.firstName} ${booking.lastName}<br>
                        ${booking.email}<br>
                        ${booking.phone}
                    </p>
                </div>
                
                <div class="invoice-info-column">
                    <h3>Booking Details:</h3>
                    <p>
                        Booking ID: ${booking.id}<br>
                        Room: ${booking.roomName}<br>
                        Check-in: ${checkInDate}<br>
                        Check-out: ${checkOutDate}<br>
                        Stay: ${booking.nights} night${booking.nights !== 1 ? 's' : ''}
                    </p>
                </div>
                
                <div class="invoice-info-column">
                    <h3>Invoice Information:</h3>
                    <p>
                        Date: ${currentDate}<br>
                        Invoice #: INV-${booking.id.substring(4)}<br>
                        Payment Status: Pending
                    </p>
                </div>
            </div>
            
            <div class="charges-section">
                <h2>Room Charges</h2>
                
                <div class="charge-row">
                    <div class="charge-details">
                        <div class="charge-name">Room Rate</div>
                        <div class="charge-description">${booking.nights} night${booking.nights !== 1 ? 's' : ''} × $${booking.price.roomRate.toFixed(2)}</div>
                    </div>
                    <div class="charge-amount">
                        $${booking.price.roomTotal.toFixed(2)}
                    </div>
                </div>
                
                <div class="charge-row">
                    <div class="charge-details">
                        <div class="charge-name">Taxes</div>
                        <div class="charge-description">12% room tax</div>
                    </div>
                    <div class="charge-amount">
                        $${booking.price.tax.toFixed(2)}
                    </div>
                </div>
            </div>
    `);
    
    // Add additional charges section if there are any
    if (additionalCharges.length > 0) {
        printWindow.document.write(`
            <div class="charges-section">
                <h2>Additional Charges</h2>
        `);
        
        additionalCharges.forEach(charge => {
            printWindow.document.write(`
                <div class="charge-row">
                    <div class="charge-details">
                        <div class="charge-name">${charge.name}</div>
                        <div class="charge-description">${charge.description}</div>
                    </div>
                    <div class="charge-amount">
                        $${charge.amount.toFixed(2)}
                    </div>
                </div>
            `);
        });
        
        printWindow.document.write(`
            </div>
        `);
    }
    
    // Add total
    printWindow.document.write(`
            <div class="charge-row total">
                <div class="charge-details">
                    <div class="charge-name">Grand Total</div>
                </div>
                <div class="charge-amount">
                    $${grandTotal.toFixed(2)}
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Luxury Hotel & Resorts</strong><br>
                1234 Luxury Avenue, New York, NY 10001<br>
                Phone: +1 (212) 555-1234 | Email: info@luxuryhotel.com</p>
                
                <p>Thank you for choosing Luxury Hotel & Resorts!</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

/**
 * Generate a unique booking ID
 * 
 * @param {string} prefix - Optional prefix for the booking ID
 * @returns {string} - The generated booking ID
 */
function generateBookingId(prefix = 'BKG') {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}${random}`;
}

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
 * Close a modal
 * 
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    modal.classList.remove('active');
    
    // Remove modal from the document after transition
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * Capitalize the first letter of a string
 * 
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
