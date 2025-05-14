const PriceService = require('../services/priceService');
const Booking = require('../models/booking');

const estimatePrice = (req, res) => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.body;
    
    try {
        const pickup = { lat: start_latitude, lng: start_longitude };
        const drop = { lat: end_latitude, lng: end_longitude };
        
        const distance = PriceService.calculateDistance(pickup, drop);
        const duration = PriceService.calculateDuration(distance, 'uber');
        
        const estimates = {};
        for (const vehicleType of Object.keys(require('../config/services').uber.vehicleTypes)) {
            estimates[vehicleType] = Math.round(PriceService.calculateFare(
                'uber', 
                vehicleType, 
                distance, 
                duration
            ));
        }
        
        res.json({
            service: 'uber',
            estimates,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            currency: 'INR',
            pickup: `${start_latitude},${start_longitude}`,
            drop: `${end_latitude},${end_longitude}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

const createBooking = async (req, res) => {
    const { user_id, vehicleType, pickup_location, drop_location } = req.body;
    
    try {
        const pickupCoords = pickup_location.split(',').map(Number);
        const dropCoords = drop_location.split(',').map(Number);
        
        const distance = PriceService.calculateDistance(
            { lat: pickupCoords[0], lng: pickupCoords[1] },
            { lat: dropCoords[0], lng: dropCoords[1] }
        );
        
        const duration = PriceService.calculateDuration(distance, 'uber');
        const price = PriceService.calculateFare('uber', vehicleType, distance, duration);
        
        const booking = await Booking.create({
            user_id,
            service_provider: 'uber',
            vehicle_type: vehicleType,
            pickup_location,
            drop_location,
            distance,
            price
        });
        
        res.json({
            status: 'confirmed',
            booking_id: booking.booking_id,
            vehicle_type: vehicleType,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            pickup_location,
            drop_location,
            redirect_url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&vehicle=${vehicleType}&booking_id=${booking.booking_id}`
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

module.exports = { estimatePrice, createBooking };