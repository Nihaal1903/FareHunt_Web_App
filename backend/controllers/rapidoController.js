const PriceService = require('../services/priceService');
const Booking = require('../models/booking');

const estimatePrice = (req, res) => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.body;
    
    try {
        const pickup = { lat: start_latitude, lng: start_longitude };
        const drop = { lat: end_latitude, lng: end_longitude };
        
        const distance = PriceService.calculateDistance(pickup, drop);
        const duration = PriceService.calculateDuration(distance, 'rapido');
        
        const estimates = {};
        const rapidoVehicleTypes = require('../config/services').rapido.vehicleTypes;
        
        for (const vehicleType of Object.keys(rapidoVehicleTypes)) {
            estimates[vehicleType] = Math.round(PriceService.calculateFare(
                'rapido', 
                vehicleType, 
                distance, 
                duration
            ));
        }
        
        res.json({
            service: 'rapido',
            estimates,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            currency: 'INR',
            pickup: `${start_latitude},${start_longitude}`,
            drop: `${end_latitude},${end_longitude}`,
            timestamp: new Date().toISOString(),
            vehicle_types: {
                bike: { icon: "🛵", description: "Bike taxi", helmet_required: true },
                auto: { icon: "🛺", description: "Auto rickshaw", max_passengers: 3 },
                mini: { icon: "🚕", description: "Budget car", max_passengers: 4 }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: "Failed to calculate Rapido estimates"
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
        const rapidoVehicleTypes = require('../config/services').rapido.vehicleTypes;
        if (!rapidoVehicleTypes[vehicleType]) {
            return res.status(400).json({
                error: "Invalid vehicle type",
                valid_types: Object.keys(rapidoVehicleTypes)
            });
        }

        const pickupCoords = pickup_location.split(',').map(Number);
        const dropCoords = drop_location.split(',').map(Number);
        
        const distance = PriceService.calculateDistance(
            { lat: pickupCoords[0], lng: pickupCoords[1] },
            { lat: dropCoords[0], lng: dropCoords[1] }
        );
        
        const duration = PriceService.calculateDuration(distance, 'rapido');
        const price = PriceService.calculateFare('rapido', vehicleType, distance, duration);
        
        const booking = await Booking.create({
            user_id,
            service_provider: 'rapido',
            vehicle_type: vehicleType,
            pickup_location,
            drop_location,
            distance,
            price
        });
        
        // Generate Rapido-specific booking ID format
        const rapidoBookingId = `RAP${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
        
        res.json({
            status: 'confirmed',
            booking_id: booking.booking_id,
            rapido_booking_id: rapidoBookingId,
            vehicle_type: vehicleType,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            pickup_location,
            drop_location,
<<<<<<< HEAD
            redirect_url: `https://www.rapido.bike/booking-confirmed?vehicle=${vehicleType}&bookingId=${rapidoBookingId}`,
=======
            redirect_url: `https://www.rapido.bike?vehicle=${vehicleType}&bookingId=${rapidoBookingId}`,
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
            safety_measures: [
                "Helmet provided for bike rides",
                "Sanitized vehicles",
                "Contactless payment available"
            ]
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: "Failed to create Rapido booking"
        });
    }
};

module.exports = { estimatePrice, createBooking };