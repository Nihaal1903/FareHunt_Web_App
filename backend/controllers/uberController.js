const PriceService = require('../services/priceService');
const Booking = require('../models/booking');
const { uber } = require('../config/services');

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
    console.log(req.body);
    const { vehicleType, pickup_location, drop_location } = req.body;
    const user_id = req.user.user_id;
    
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

        let pickup_lat = pickupCoords[0];
        let pickup_lng = pickupCoords[1];
        let drop_lat = dropCoords[0];
        let drop_lng = dropCoords[1];

         const uberBookingId = `UBR${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
        
        res.json({
            status: 'confirmed',
            booking_id: booking.booking_id,
            vehicle_type: vehicleType,
            uber_booking_id: uberBookingId,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            pickup_location,
            drop_location,
            // redirect_url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&vehicle=${vehicleType}&booking_id=${booking.booking_id}`
            redirect_url: `https://m.uber.com/ul/?pickup[latitude]=${pickup_lat}&pickup[longitude]=${pickup_lng}&drop[latitude]=${drop_lat}&drop[longitude]=${drop_lng}&product_id=${vehicleType}`
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

module.exports = { estimatePrice, createBooking };