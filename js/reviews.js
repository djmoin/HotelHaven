/**
 * Luxury Hotel & Resorts
 * Reviews JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reviews functionality
    initReviews();
});

/**
 * Initialize the reviews system
 */
function initReviews() {
    loadReviews();
    
    // Initialize review form if it exists
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        initReviewForm(reviewForm);
    }
    
    // Initialize review filters if they exist
    const filterForm = document.getElementById('review-filters');
    if (filterForm) {
        initReviewFilters(filterForm);
    }
    
    // Initialize rating distribution if it exists
    const ratingDistribution = document.getElementById('rating-distribution');
    if (ratingDistribution) {
        updateRatingDistribution();
    }
}

/**
 * Load and display reviews
 * @param {Object} filters - Optional filter criteria
 */
function loadReviews(filters = {}) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    // Get reviews
    let reviews = [];
    
    // Check if we're on a room detail page
    const urlParams = getUrlParams();
    if (urlParams.id) {
        // Room-specific reviews
        reviews = db.getRoomReviews(urlParams.id);
    } else {
        // All reviews
        reviews = db.getAllReviews();
    }
    
    // Apply filters if provided
    if (filters) {
        if (filters.rating && filters.rating !== 'all') {
            const ratingValue = parseFloat(filters.rating);
            reviews = reviews.filter(review => {
                if (filters.rating === '5') {
                    return review.rating === 5;
                } else if (filters.rating === '4') {
                    return review.rating >= 4 && review.rating < 5;
                } else if (filters.rating === '3') {
                    return review.rating >= 3 && review.rating < 4;
                } else if (filters.rating === '2') {
                    return review.rating >= 2 && review.rating < 3;
                } else if (filters.rating === '1') {
                    return review.rating >= 1 && review.rating < 2;
                }
                return true;
            });
        }
        
        if (filters.tripType && filters.tripType !== 'all') {
            reviews = reviews.filter(review => review.tripType === filters.tripType);
        }
        
        if (filters.sortBy) {
            if (filters.sortBy === 'date-desc') {
                reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (filters.sortBy === 'date-asc') {
                reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (filters.sortBy === 'rating-desc') {
                reviews.sort((a, b) => b.rating - a.rating);
            } else if (filters.sortBy === 'rating-asc') {
                reviews.sort((a, b) => a.rating - b.rating);
            }
        }
    } else {
        // Default sort by most recent
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Display no reviews message if none found
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience!</p>
                <a href="#review-form" class="btn btn-secondary">Write a Review</a>
            </div>
        `;
        return;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update average rating display if it exists
    const averageRatingElement = document.getElementById('average-rating');
    if (averageRatingElement) {
        averageRatingElement.innerHTML = `
            <div class="average-rating-value">${averageRating.toFixed(1)}</div>
            ${formatStarRating(averageRating)}
            <div class="total-reviews">${reviews.length} reviews</div>
        `;
    }
    
    // Create reviews HTML
    let reviewsHTML = '';
    
    reviews.forEach(review => {
        const reviewDate = formatDate(review.createdAt);
        const stayDate = formatDate(review.stayDate);
        
        reviewsHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-meta">
                        <h3 class="review-title">${review.title}</h3>
                        <div class="review-rating">
                            ${formatStarRating(review.rating)}
                        </div>
                    </div>
                    <div class="review-info">
                        <div class="reviewer">
                            <div class="reviewer-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="reviewer-name">${review.guestName}</div>
                        </div>
                        <div class="review-details">
                            <span class="review-date">Reviewed on ${reviewDate}</span>
                            <span class="stay-date">Stayed in ${stayDate}</span>
                            <span class="trip-type">${review.tripType} trip</span>
                            ${review.roomName ? `<span class="room-type">Room: ${review.roomName}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
            </div>
        `;
    });
    
    // Update reviews container
    reviewsContainer.innerHTML = reviewsHTML;
}

/**
 * Initialize the review submission form
 * @param {HTMLElement} form - The review form element
 */
function initReviewForm(form) {
    // Setup star rating selection in the form
    const ratingStars = form.querySelectorAll('.rating-select .star');
    const ratingInput = document.getElementById('review-rating');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ratingInput.value = value;
            
            // Update stars
            ratingStars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
        
        // Hover effects
        star.addEventListener('mouseenter', function() {
            const value = this.getAttribute('data-value');
            
            ratingStars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
    });
    
    const ratingContainer = form.querySelector('.rating-select');
    ratingContainer.addEventListener('mouseleave', function() {
        ratingStars.forEach(s => s.classList.remove('hover'));
    });
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const rating = ratingInput.value;
        const title = document.getElementById('review-title').value.trim();
        const comment = document.getElementById('review-comment').value.trim();
        const guestName = document.getElementById('review-name').value.trim();
        const email = document.getElementById('review-email').value.trim();
        const stayDate = document.getElementById('review-stay-date').value;
        const tripType = document.getElementById('review-trip-type').value;
        
        // Validation
        if (!rating) {
            showFormMessage(form, 'Please select a rating.', 'error');
            return;
        }
        
        if (!title || !comment || !guestName || !email || !stayDate || !tripType) {
            showFormMessage(form, 'Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Get room ID if on a room detail page
        const urlParams = getUrlParams();
        let roomId = null;
        let roomName = null;
        
        if (urlParams.id) {
            roomId = urlParams.id;
            const room = db.getRoomById(roomId);
            if (room) {
                roomName = room.name;
            }
        }
        
        // Create review object
        const reviewData = {
            id: generateId('REV'),
            roomId: roomId,
            roomName: roomName,
            guestName,
            rating: parseFloat(rating),
            title,
            comment,
            email, // Not displayed but stored for admin purposes
            stayDate,
            createdAt: new Date().toISOString(),
            tripType
        };
        
        // Save review to database
        db.createReview(reviewData);
        
        // Show success message
        showFormMessage(form, 'Thank you for your review! It has been submitted successfully.', 'success');
        
        // Reset form
        form.reset();
        ratingStars.forEach(s => s.classList.remove('selected'));
        ratingInput.value = '';
        
        // Reload reviews
        loadReviews();
        
        // Update rating distribution
        updateRatingDistribution();
    });
}

/**
 * Initialize the review filters
 * @param {HTMLElement} filterForm - The filter form element
 */
function initReviewFilters(filterForm) {
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get filter values
        const rating = document.getElementById('filter-rating').value;
        const tripType = document.getElementById('filter-trip-type').value;
        const sortBy = document.getElementById('filter-sort').value;
        
        // Apply filters
        loadReviews({
            rating,
            tripType,
            sortBy
        });
    });
    
    // Add event listener to reset button if it exists
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            filterForm.reset();
            loadReviews();
        });
    }
    
    // Add event listeners to filter inputs for immediate filtering
    const filterInputs = filterForm.querySelectorAll('select');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            filterForm.dispatchEvent(new Event('submit'));
        });
    });
}

/**
 * Update the rating distribution chart
 */
function updateRatingDistribution() {
    const distributionContainer = document.getElementById('rating-distribution');
    if (!distributionContainer) return;
    
    // Get all reviews
    let reviews = [];
    
    // Check if we're on a room detail page
    const urlParams = getUrlParams();
    if (urlParams.id) {
        // Room-specific reviews
        reviews = db.getRoomReviews(urlParams.id);
    } else {
        // All reviews
        reviews = db.getAllReviews();
    }
    
    if (reviews.length === 0) {
        distributionContainer.style.display = 'none';
        return;
    }
    
    // Count ratings
    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };
    
    reviews.forEach(review => {
        const rating = Math.floor(review.rating);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
        }
    });
    
    // Calculate percentages
    const percentages = {};
    for (let rating = 5; rating >= 1; rating--) {
        percentages[rating] = (ratingCounts[rating] / reviews.length) * 100;
    }
    
    // Create HTML for distribution
    let distributionHTML = '';
    
    for (let rating = 5; rating >= 1; rating--) {
        distributionHTML += `
            <div class="rating-bar">
                <div class="rating-label">${rating} stars</div>
                <div class="rating-progress">
                    <div class="rating-progress-bar" style="width: ${percentages[rating]}%"></div>
                </div>
                <div class="rating-count">${ratingCounts[rating]}</div>
            </div>
        `;
    }
    
    // Update container
    distributionContainer.innerHTML = distributionHTML;
    distributionContainer.style.display = 'block';
}
