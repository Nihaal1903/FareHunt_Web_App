const PriceService = require('../services/priceService');
const Booking = require('../models/booking');

const estimatePrice = (req, res) => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.body;
    
    try {
        const pickup = { lat: start_latitude, lng: start_longitude };
        const drop = { lat: end_latitude, lng: end_longitude };
        
        const distance = PriceService.calculateDistance(pickup, drop);
        const duration = PriceService.calculateDuration(distance, 'ola');
        
        // Get Ola vehicle types from config
        const { ola } = require('../config/services');
        const estimates = {};
        
        // Calculate fare for each vehicle type
        for (const [vehicleType, config] of Object.entries(ola.vehicleTypes)) {
            estimates[vehicleType] = Math.round(PriceService.calculateFare(
                'ola', 
                vehicleType, 
                distance, 
                duration
            ));
        }
        
        res.json({
            service: 'ola',
            estimates,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            currency: 'INR',
            pickup: `${start_latitude},${start_longitude}`,
            drop: `${end_latitude},${end_longitude}`,
            timestamp: new Date().toISOString(),
            vehicle_types: {
                auto: { icon: "🚗", description: "Auto rickshaw" },
                bike: { icon: "🏍️", description: "Bike taxi" },
                mini: { icon: "🚙", description: "Hatchback" },
                primesedan: { icon: "🚘", description: "Premium sedan" },
                primesuv: { icon: "🚖", description: "Premium SUV" }
            }
        });
    } catch (error) {
        console.error('Error in estimatePrice:', error);
        res.status(500).json({ 
            error: error.message,
            details: "Failed to calculate Ola estimates"
        });
    }
};

const createBooking = async (req, res) => {
<<<<<<< HEAD
    const { user_id, vehicleType, pickup_location, drop_location } = req.body;
=======
    

    const { vehicleType, pickup_location, drop_location } = req.body;
    const user_id = req.user.user_id;
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
    
    try {
        // Validate vehicle type
        const olaVehicleTypes = require('../config/services').ola.vehicleTypes;
        if (!olaVehicleTypes[vehicleType]) {
            return res.status(400).json({
                error: "Invalid vehicle type",
                valid_types: Object.keys(olaVehicleTypes)
            });
        }

        const pickupCoords = pickup_location.split(',').map(Number);
        const dropCoords = drop_location.split(',').map(Number);
        
        const distance = PriceService.calculateDistance(
            { lat: pickupCoords[0], lng: pickupCoords[1] },
            { lat: dropCoords[0], lng: dropCoords[1] }
        );
        
        const duration = PriceService.calculateDuration(distance, 'ola');
        const price = PriceService.calculateFare('ola', vehicleType, distance, duration);
        
        const booking = await Booking.create({
            user_id,
            service_provider: 'ola',
            vehicle_type: vehicleType,
            pickup_location,
            drop_location,
            distance,
            price
        });
        
<<<<<<< HEAD
=======
        let pickup_lat = pickupCoords[0];
        let pickup_lng = pickupCoords[1];
        let drop_lat = dropCoords[0];
        let drop_lng = dropCoords[1];
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
        // Generate Ola-specific booking ID format
        const olaBookingId = `OLA${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
        
        res.json({
            status: 'confirmed',
            booking_id: booking.booking_id,
            ola_booking_id: olaBookingId,
            vehicle_type: vehicleType,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            pickup_location,
            drop_location,
<<<<<<< HEAD
            redirect_url: `https://book.olacabs.com/?vehicle=${vehicleType}&booking_id=${olaBookingId}`,
=======
            // redirect_url: `https://book.olacabs.com/?vehicle=${vehicleType}&booking_id=${olaBookingId}`,
            redirect_url: `https://book.olacabs.com/?pickup_lat=${pickup_lat}&pickup_lng=${pickup_lng}&drop_lat=${drop_lat}&drop_lng=${drop_lng}&category=${vehicleType}`,
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
            cancellation_policy: "Free cancellation within 2 minutes of booking"
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: "Failed to create Ola booking"
        });
    }
};

module.exports = { estimatePrice, createBooking };