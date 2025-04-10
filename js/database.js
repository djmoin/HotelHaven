/**
 * Luxury Hotel & Resorts
 * In-Memory Database for Hotel Reservation System
 */

// Create a database object to hold all our data
const db = {
    // ====================================
    // Room Data
    // ====================================
    
    // Room data store
    rooms: [
        {
            id: '1',
            name: 'Deluxe King Room',
            description: 'Spacious room with king-sized bed, city view, and luxurious amenities for a comfortable stay.',
            longDescription: 'Indulge in luxury with our Deluxe King Room. This spacious accommodation features a plush king-sized bed, stunning city views, and elegant decor. The room is equipped with a marble bathroom, walk-in shower, soaking tub, and premium bath products. Enjoy modern amenities including a 55-inch smart TV, high-speed Wi-Fi, in-room safe, and a fully stocked minibar. Perfect for couples or business travelers seeking comfort and style.',
            price: 299,
            capacity: 2,
            size: '400 sq ft',
            bedType: 'King',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            features: [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Breakfast Included', icon: 'coffee' },
                { name: 'Bathtub', icon: 'bath' },
                { name: 'City View', icon: 'city' },
                { name: 'Air Conditioning', icon: 'snowflake' },
                { name: 'Flat-screen TV', icon: 'tv' }
            ],
            amenities: [
                'King-sized bed with premium linens',
                'Marble bathroom with walk-in shower and soaking tub',
                'Premium bath products',
                '55-inch smart TV with streaming services',
                'High-speed Wi-Fi',
                'Work desk with ergonomic chair',
                'In-room safe',
                'Mini-refrigerator',
                'Coffee and tea maker',
                'Iron and ironing board',
                'Individually controlled air conditioning'
            ],
            availability: true
        },
        {
            id: '2',
            name: 'Executive Suite',
            description: 'Luxury suite with separate living area, premium amenities, and panoramic views of the city skyline.',
            longDescription: 'Experience unparalleled luxury in our Executive Suite. This premium accommodation features a spacious bedroom with a king-sized bed and a separate living area, perfect for relaxation or entertaining guests. The suite offers panoramic views of the city skyline, a marble bathroom with a deep soaking tub and separate shower, and a powder room for guests. Additional amenities include a dining area, premium minibar, Nespresso coffee machine, and exclusive access to the Executive Lounge with complimentary breakfast and evening cocktails.',
            price: 499,
            capacity: 2,
            size: '650 sq ft',
            bedType: 'King',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            features: [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Breakfast Included', icon: 'coffee' },
                { name: 'Mini Bar', icon: 'glass-martini-alt' },
                { name: 'City View', icon: 'city' },
                { name: 'Living Area', icon: 'couch' },
                { name: 'Executive Lounge Access', icon: 'concierge-bell' }
            ],
            amenities: [
                'King-sized bed with luxury linens',
                'Separate living area with sofa and armchairs',
                'Dining area with table and chairs',
                'Marble bathroom with deep soaking tub and separate shower',
                'Guest powder room',
                '65-inch smart TV in bedroom and living area',
                'Nespresso coffee machine',
                'Premium minibar',
                'Executive Lounge access',
                'Complimentary pressing of two items daily',
                'Welcome amenity upon arrival'
            ],
            availability: true
        },
        {
            id: '3',
            name: 'Family Suite',
            description: 'Spacious suite with two bedrooms, perfect for families with children and extended stays.',
            longDescription: 'Our Family Suite is designed with your entire family in mind. This spacious accommodation features two bedrooms - a master bedroom with a king-sized bed and a second bedroom with two twin beds. The suite includes a comfortable living area where the family can gather, a dining area, and a fully equipped kitchenette. Both bedrooms have their own smart TVs and the master bathroom features a combination bathtub and shower. Additional amenities include a children\'s welcome pack, board games, and family-friendly toiletries.',
            price: 599,
            capacity: 4,
            size: '800 sq ft',
            bedType: 'King & Twin Beds',
            image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            features: [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Breakfast Included', icon: 'coffee' },
                { name: '2 TVs', icon: 'tv' },
                { name: 'Kitchenette', icon: 'utensils' },
                { name: 'Living Area', icon: 'couch' },
                { name: 'Child-Friendly', icon: 'child' }
            ],
            amenities: [
                'Master bedroom with king-sized bed',
                'Second bedroom with two twin beds',
                'Living area with sofa and armchairs',
                'Dining area with table and chairs',
                'Kitchenette with microwave, mini-refrigerator, and basic cookware',
                'Two smart TVs',
                'Children\'s welcome pack',
                'Board games and children\'s books',
                'Family-friendly toiletries',
                'Baby cot available upon request',
                'Child-proofing kit available upon request'
            ],
            availability: true
        },
        {
            id: '4',
            name: 'Standard Queen Room',
            description: 'Comfortable room with a queen-sized bed, perfect for solo travelers or couples on a budget.',
            longDescription: 'Our Standard Queen Room offers comfort and value for solo travelers or couples. This well-appointed room features a plush queen-sized bed with comfortable linens, a modern bathroom with a walk-in shower, and all the essential amenities for a pleasant stay. The room is decorated in soothing tones and includes a work desk, armchair, and plenty of natural light. Enjoy the convenience of in-room coffee and tea facilities, a mini-refrigerator, and a 42-inch flat-screen TV.',
            price: 199,
            capacity: 2,
            size: '300 sq ft',
            bedType: 'Queen',
            image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            features: [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Breakfast Available', icon: 'coffee' },
                { name: 'Walk-in Shower', icon: 'shower' },
                { name: 'Air Conditioning', icon: 'snowflake' },
                { name: 'Flat-screen TV', icon: 'tv' },
                { name: 'Work Desk', icon: 'briefcase' }
            ],
            amenities: [
                'Queen-sized bed with comfortable linens',
                'Modern bathroom with walk-in shower',
                'Basic bath amenities',
                '42-inch flat-screen TV',
                'Work desk with chair',
                'Armchair',
                'Mini-refrigerator',
                'Coffee and tea making facilities',
                'In-room safe',
                'Iron and ironing board',
                'Climate control'
            ],
            availability: true
        },
        {
            id: '5',
            name: 'Deluxe Ocean View',
            description: 'Elegant room with breathtaking ocean views, a king-sized bed, and a private balcony to enjoy the sea breeze.',
            longDescription: 'Wake up to breathtaking ocean views in our Deluxe Ocean View room. This elegant accommodation features a private balcony where you can relax and enjoy the sea breeze. The room is furnished with a luxurious king-sized bed, a comfortable seating area, and a spacious bathroom with a walk-in shower and separate soaking tub. Large windows maximize the stunning views, and blackout curtains ensure a peaceful night\'s sleep. Additional amenities include a Bluetooth speaker, binoculars for ocean viewing, and plush bathrobes and slippers.',
            price: 399,
            capacity: 2,
            size: '450 sq ft',
            bedType: 'King',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            features: [
                { name: 'Ocean View', icon: 'water' },
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Breakfast Included', icon: 'coffee' },
                { name: 'Private Balcony', icon: 'door-open' },
                { name: 'Bathtub & Shower', icon: 'bath' },
                { name: 'Bluetooth Speaker', icon: 'music' }
            ],
            amenities: [
                'King-sized bed with luxury linens',
                'Private balcony with ocean view',
                'Seating area with armchair and ottoman',
                'Spacious bathroom with walk-in shower and soaking tub',
                'Premium bath products',
                '55-inch smart TV',
                'Bluetooth speaker',
                'Binoculars for ocean viewing',
                'Mini-refrigerator',
                'Nespresso coffee machine',
                'Bathrobes and slippers'
            ],
            availability: true
        }
    ],
    
    // Get all rooms
    getAllRooms: function() {
        return this.rooms;
    },
    
    // Get room by ID
    getRoomById: function(id) {
        return this.rooms.find(room => room.id === id) || null;
    },
    
    // Search rooms availability
    getRoomsAvailability: function(checkIn, checkOut, roomCount = 1) {
        // In a real system, we would check against existing bookings
        // For this demo, we'll just return available rooms
        
        const availableRooms = this.rooms.filter(room => room.availability);
        
        // If roomCount is specified, limit the results
        return availableRooms.slice(0, Math.min(availableRooms.length, parseInt(roomCount) * 3));
    },
    
    // ====================================
    // Booking Data
    // ====================================
    
    // Use localStorage to persist bookings
    bookings: JSON.parse(localStorage.getItem('hotel_bookings') || '[]'),
    
    // Create a new booking
    createBooking: function(bookingData) {
        this.bookings.push(bookingData);
        this.saveBookings();
        return bookingData;
    },
    
    // Get all bookings
    getAllBookings: function() {
        return this.bookings;
    },
    
    // Get user bookings (in a real app this would filter by user ID)
    getUserBookings: function() {
        return this.bookings;
    },
    
    // Get booking by ID
    getBookingById: function(id) {
        return this.bookings.find(booking => booking.id === id) || null;
    },
    
    // Cancel a booking
    cancelBooking: function(id) {
        const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
        if (bookingIndex !== -1) {
            this.bookings[bookingIndex].status = 'cancelled';
            this.saveBookings();
            return true;
        }
        return false;
    },
    
    // Save bookings to localStorage
    saveBookings: function() {
        localStorage.setItem('hotel_bookings', JSON.stringify(this.bookings));
    },
    
    // ====================================
    // Group Booking Data
    // ====================================
    
    // Use localStorage to persist group bookings
    groupBookings: JSON.parse(localStorage.getItem('hotel_group_bookings') || '[]'),
    
    // Create a group booking
    createGroupBooking: function(groupBookingData) {
        this.groupBookings.push(groupBookingData);
        this.saveGroupBookings();
        return groupBookingData;
    },
    
    // Get all group bookings
    getAllGroupBookings: function() {
        return this.groupBookings;
    },
    
    // Get group booking by ID
    getGroupBookingById: function(id) {
        return this.groupBookings.find(booking => booking.id === id) || null;
    },
    
    // Save group bookings to localStorage
    saveGroupBookings: function() {
        localStorage.setItem('hotel_group_bookings', JSON.stringify(this.groupBookings));
    },
    
    // ====================================
    // Reviews Data
    // ====================================
    
    // Use localStorage to persist reviews
    reviews: JSON.parse(localStorage.getItem('hotel_reviews') || '[]'),
    
    // Create a new review
    createReview: function(reviewData) {
        this.reviews.push(reviewData);
        this.saveReviews();
        return reviewData;
    },
    
    // Get all reviews
    getAllReviews: function() {
        return this.reviews;
    },
    
    // Get reviews for a specific room
    getRoomReviews: function(roomId) {
        return this.reviews.filter(review => review.roomId === roomId);
    },
    
    // Get review by ID
    getReviewById: function(id) {
        return this.reviews.find(review => review.id === id) || null;
    },
    
    // Save reviews to localStorage
    saveReviews: function() {
        localStorage.setItem('hotel_reviews', JSON.stringify(this.reviews));
    },
    
    // ====================================
    // Concierge Requests Data
    // ====================================
    
    // Use localStorage to persist concierge requests
    conciergeRequests: JSON.parse(localStorage.getItem('hotel_concierge_requests') || '[]'),
    
    // Create a new concierge request
    createConciergeRequest: function(requestData) {
        this.conciergeRequests.push(requestData);
        this.saveConciergeRequests();
        return requestData;
    },
    
    // Get all concierge requests
    getAllConciergeRequests: function() {
        return this.conciergeRequests;
    },
    
    // Get user concierge requests (in a real app this would filter by user ID)
    getUserConciergeRequests: function() {
        return this.conciergeRequests;
    },
    
    // Get concierge request by ID
    getConciergeRequestById: function(id) {
        return this.conciergeRequests.find(request => request.id === id) || null;
    },
    
    // Save concierge requests to localStorage
    saveConciergeRequests: function() {
        localStorage.setItem('hotel_concierge_requests', JSON.stringify(this.conciergeRequests));
    },
    
    // ====================================
    // Additional Charges Data
    // ====================================
    
    // Use localStorage to persist additional charges
    additionalCharges: JSON.parse(localStorage.getItem('hotel_additional_charges') || '[]'),
    
    // Create a new additional charge
    createAdditionalCharge: function(chargeData) {
        this.additionalCharges.push(chargeData);
        this.saveAdditionalCharges();
        return chargeData;
    },
    
    // Get additional charges for a booking
    getBookingCharges: function(bookingId) {
        return this.additionalCharges.filter(charge => charge.bookingId === bookingId);
    },
    
    // Save additional charges to localStorage
    saveAdditionalCharges: function() {
        localStorage.setItem('hotel_additional_charges', JSON.stringify(this.additionalCharges));
    },
    
    // ====================================
    // Services Data
    // ====================================
    
    // Services offered by the hotel
    services: [
        {
            id: '1',
            category: 'dining',
            name: 'Room Service',
            description: 'Enjoy gourmet meals in the comfort of your room, available 24/7.',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'Varies',
            availability: '24 hours'
        },
        {
            id: '2',
            category: 'dining',
            name: 'Restaurant Reservation',
            description: 'Reserve a table at our award-winning restaurant featuring international cuisine.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'Varies',
            availability: '6:30 AM - 10:30 PM'
        },
        {
            id: '3',
            category: 'wellness',
            name: 'Spa Treatment',
            description: 'Rejuvenate with our luxury spa treatments, including massages, facials, and body wraps.',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'From $120',
            availability: '9:00 AM - 8:00 PM'
        },
        {
            id: '4',
            category: 'wellness',
            name: 'Fitness Center Access',
            description: 'Stay fit with state-of-the-art equipment and optional personal training sessions.',
            image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'Complimentary / PT from $60',
            availability: '24 hours'
        },
        {
            id: '5',
            category: 'transportation',
            name: 'Airport Transfer',
            description: 'Comfortable and reliable transportation between the hotel and airport.',
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'From $75 one-way',
            availability: '24 hours, reservation required'
        },
        {
            id: '6',
            category: 'transportation',
            name: 'Car Rental',
            description: 'Convenient car rental service with a variety of vehicles to choose from.',
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'From $89 per day',
            availability: '8:00 AM - 6:00 PM'
        },
        {
            id: '7',
            category: 'business',
            name: 'Meeting Room',
            description: 'Professional meeting spaces equipped with the latest technology.',
            image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'From $250 per half-day',
            availability: '7:00 AM - 10:00 PM'
        },
        {
            id: '8',
            category: 'business',
            name: 'Business Center',
            description: 'Full business services including printing, scanning, and administrative support.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'Varies by service',
            availability: '7:00 AM - 9:00 PM'
        },
        {
            id: '9',
            category: 'childcare',
            name: 'Babysitting',
            description: 'Professional childcare services provided by trained staff.',
            image: 'https://images.unsplash.com/photo-1533854775446-95c8ff09272c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: '$25 per hour',
            availability: 'By reservation'
        },
        {
            id: '10',
            category: 'childcare',
            name: 'Kids Club',
            description: 'Fun activities for children aged 4-12 in a supervised environment.',
            image: 'https://images.unsplash.com/photo-1571210059434-edf0dc48e414?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'Complimentary for guests',
            availability: '9:00 AM - 6:00 PM'
        },
        {
            id: '11',
            category: 'special',
            name: 'Special Occasion Package',
            description: 'Celebrate birthdays, anniversaries or special moments with custom packages.',
            image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: 'From $150',
            availability: 'By reservation'
        },
        {
            id: '12',
            category: 'special',
            name: 'Personal Shopper',
            description: 'Exclusive shopping assistance with personalized recommendations.',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            price: '$100 per hour',
            availability: 'By appointment'
        }
    ],
    
    // Get all services
    getAllServices: function() {
        return this.services;
    },
    
    // Get services by category
    getServicesByCategory: function(category) {
        return this.services.filter(service => service.category === category);
    },
    
    // Get service by ID
    getServiceById: function(id) {
        return this.services.find(service => service.id === id) || null;
    },
    
    // Initialize demo data
    initializeDemoData: function() {
        // Only add demo data if there are no existing reviews
        if (this.reviews.length === 0) {
            // Sample reviews
            const demoReviews = [
                {
                    id: 'REV-001',
                    roomId: '1',
                    roomName: 'Deluxe King Room',
                    guestName: 'James Wilson',
                    rating: 5,
                    title: 'Exceptional stay with impeccable service',
                    comment: 'An absolutely wonderful experience from start to finish. The staff was attentive, the room was immaculate, and the amenities were top-notch. Will definitely be returning.',
                    stayDate: '2023-05-15',
                    createdAt: '2023-05-20T14:30:00Z',
                    tripType: 'Business'
                },
                {
                    id: 'REV-002',
                    roomId: '3',
                    roomName: 'Family Suite',
                    guestName: 'Sarah Thompson',
                    rating: 5,
                    title: 'Perfect for our family vacation',
                    comment: 'Our family vacation was perfect thanks to the amazing accommodations and kid-friendly amenities. The concierge helped plan wonderful daily activities for us.',
                    stayDate: '2023-06-10',
                    createdAt: '2023-06-18T10:15:00Z',
                    tripType: 'Family'
                },
                {
                    id: 'REV-003',
                    roomId: '2',
                    roomName: 'Executive Suite',
                    guestName: 'Emily Rodriguez',
                    rating: 4.5,
                    title: 'Exceptional spa services',
                    comment: 'The spa services were exceptional! I\'ve never felt more relaxed and pampered. The wellness packages are worth every penny.',
                    stayDate: '2023-04-05',
                    createdAt: '2023-04-12T16:45:00Z',
                    tripType: 'Wellness Retreat'
                },
                {
                    id: 'REV-004',
                    roomId: '1',
                    roomName: 'Deluxe King Room',
                    guestName: 'Michael Chen',
                    rating: 4,
                    title: 'Great location and comfortable room',
                    comment: 'The hotel is in a perfect location for business travelers. Room was comfortable and clean, though the bathroom could use an update. Overall a pleasant stay.',
                    stayDate: '2023-03-20',
                    createdAt: '2023-03-25T08:30:00Z',
                    tripType: 'Business'
                },
                {
                    id: 'REV-005',
                    roomId: '5',
                    roomName: 'Deluxe Ocean View',
                    guestName: 'Jennifer Lopez',
                    rating: 5,
                    title: 'Breathtaking views and luxurious comfort',
                    comment: 'Waking up to those ocean views was incredible! The room was spacious and beautifully appointed. The private balcony was perfect for enjoying morning coffee and evening cocktails. Highly recommend for a romantic getaway.',
                    stayDate: '2023-07-08',
                    createdAt: '2023-07-15T11:20:00Z',
                    tripType: 'Couple'
                }
            ];
            
            // Add demo reviews
            demoReviews.forEach(review => {
                this.reviews.push(review);
            });
            
            // Save to localStorage
            this.saveReviews();
            
            // Sample additional charges
            const demoBookingId = 'BKG-000000000';
            const demoCharges = [
                {
                    id: 'CHG-001',
                    bookingId: demoBookingId,
                    name: 'Spa Treatment',
                    description: 'Swedish Massage - 60 minutes',
                    amount: 120,
                    date: '2023-06-18T14:00:00Z'
                },
                {
                    id: 'CHG-002',
                    bookingId: demoBookingId,
                    name: 'Room Service',
                    description: 'Dinner - Steak and Wine',
                    amount: 95.50,
                    date: '2023-06-18T19:30:00Z'
                },
                {
                    id: 'CHG-003',
                    bookingId: demoBookingId,
                    name: 'Mini Bar',
                    description: 'Assorted beverages and snacks',
                    amount: 45.75,
                    date: '2023-06-19T22:15:00Z'
                }
            ];
            
            // Add demo charges
            demoCharges.forEach(charge => {
                this.additionalCharges.push(charge);
            });
            
            // Save to localStorage
            this.saveAdditionalCharges();
        }
    }
};

// Initialize demo data when the database loads
db.initializeDemoData();
