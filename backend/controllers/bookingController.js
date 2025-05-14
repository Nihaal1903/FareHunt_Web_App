const PriceService = require('../services/priceService');
const Booking = require('../models/booking');
const User = require('../models/user');

const getPriceEstimates = async (req, res) => {
    const { pickup_lat, pickup_long, drop_lat, drop_long } = req.body;
    
    try {
        const pickup = { lat: pickup_lat, lng: pickup_long };
        const drop = { lat: drop_lat, lng: drop_long };
        
        // Calculate distance using PriceService
        const distance = PriceService.calculateDistance(pickup, drop);
        
        // Get estimates for all services
        const estimates = {
            uber: {},
            ola: {},
            rapido: {}
        };
        
        // Calculate estimates for each service and vehicle type
        for (const service of ['uber', 'ola', 'rapido']) {
            const duration = PriceService.calculateDuration(distance, service);
            
            for (const vehicleType of Object.keys(require('../config/services')[service].vehicleTypes)) {
                estimates[service][vehicleType] = PriceService.calculateFare(
                    service, 
                    vehicleType, 
                    distance, 
                    duration
                );
            }
        }
        
        res.json({
            success: true,
            estimates,
            distance: distance.toFixed(2),
            currency: 'INR',
            pickup: `${pickup_lat},${pickup_long}`,
            drop: `${drop_lat},${drop_long}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

const createBooking = async (req, res) => {
    const { user_id, service, vehicleType, pickup_location, drop_location } = req.body;
    
    try {
        // Verify user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }
        
        // Calculate distance and fare
        const pickupCoords = pickup_location.split(',').map(Number);
        const dropCoords = drop_location.split(',').map(Number);
        
        const distance = PriceService.calculateDistance(
            { lat: pickupCoords[0], lng: pickupCoords[1] },
            { lat: dropCoords[0], lng: dropCoords[1] }
        );
        
        const duration = PriceService.calculateDuration(distance, service);
        const price = PriceService.calculateFare(service, vehicleType, distance, duration);
        
        // Create booking
        const bookingData = {
            user_id,
            service_provider: service,
            vehicle_type: vehicleType,
            pickup_location,
            drop_location,
            distance,
            price
        };
        
        const booking = await Booking.create(bookingData);
        
        // Generate redirect URL
        let redirectUrl;
        switch(service) {
            case 'uber':
                redirectUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&vehicle=${vehicleType}&booking_id=${booking.booking_id}`;
                break;
            case 'ola':
                redirectUrl = `https://book.olacabs.com/?vehicle=${vehicleType}&booking_id=${booking.booking_id}`;
                break;
            case 'rapido':
                redirectUrl = `https://www.rapido.bike/booking-confirmed?vehicle=${vehicleType}&bookingId=${booking.booking_id}`;
                break;
        }
        
        res.json({
            success: true,
            booking_id: booking.booking_id,
            service,
            vehicle_type: vehicleType,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            redirect_url: redirectUrl
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

module.exports = { getPriceEstimates, createBooking };