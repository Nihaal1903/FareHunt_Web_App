
const PriceService = require('../services/priceService');
const Booking = require('../models/booking');

const createBooking = async (req, res) => {
    

    const { vehicleType,service, pickup_location, drop_location } = req.body;
    const user_id = req.user.user_id;
    
    try {

        const pickupCoords = pickup_location.split(',').map(Number);
        const dropCoords = drop_location.split(',').map(Number);
        const distance = PriceService.calculateDistance(
            { lat: pickupCoords[0], lng: pickupCoords[1] },
            { lat: dropCoords[0], lng: dropCoords[1] }
        );


        let pickup_lat = pickupCoords[0];
        let pickup_lng = pickupCoords[1];
        let drop_lat = dropCoords[0];
        let drop_lng = dropCoords[1];

        let redirect_url = '';
        let serviceBookingId = '';
        let VehicleTypes;

        if (service === 'uber') {
            redirect_url = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup_lat}&pickup[longitude]=${pickup_lng}&dropoff[latitude]=${drop_lat}&dropoff[longitude]=${drop_lng}`;
            // redirect_url = `https://m.uber.com/ul/?pickup[latitude]=${pickup_lat}&pickup[longitude]=${pickup_lng}&drop[latitude]=${drop_lat}&drop[longitude]=${drop_lng}&product_id=${vehicleType}`;
            serviceBookingId = `OLA${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
            VehicleTypes = require('../config/services').uber.vehicleTypes;


        } else if (service === 'rapido') {
            redirect_url= `https://www.rapido.bike?vehicle=${vehicleType}`;
            serviceBookingId = `RAP${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
            VehicleTypes = require('../config/services').rapido.vehicleTypes;


        } else if (service === 'ola') {
            redirect_url = `https://book.olacabs.com/?pickup_lat=${pickup_lat}&pickup_lng=${pickup_lng}&drop_lat=${drop_lat}&drop_lng=${drop_lng}&category=${vehicleType}`;
            serviceBookingId = `UBR${vehicleType.toUpperCase().slice(0,3)}${Date.now().toString().slice(-6)}`;
            VehicleTypes = require('../config/services').ola.vehicleTypes;


        } else {
            return res.status(400).json({ 
                error: 'Invalid service type' 
            });
        }


        if (!VehicleTypes[vehicleType]) {
            return res.status(400).json({
                error: "Invalid vehicle type",
                valid_types: Object.keys(VehicleTypes)
            });
        }


        
        const duration = PriceService.calculateDuration(distance, service);
        const price = PriceService.calculateFare(service, vehicleType, distance, duration);
        const booking = await Booking.create({
            user_id,
            service_provider: service,
            vehicle_type: vehicleType,
            pickup_location,
            drop_location,
            distance,
            price
        });

        // Generate Ola-specific booking ID format
        
        res.json({
            status: 'confirmed',
            booking_id: booking.booking_id,
            service_booking_id: serviceBookingId,
            vehicle_type: vehicleType,
            price,
            distance: distance.toFixed(2),
            duration: duration.toFixed(2),
            pickup_location,
            drop_location,
            redirect_url,
            cancellation_policy: "Free cancellation within 2 minutes of booking"
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: "Failed to create booking"
        });
    }
};

module.exports = createBooking ;