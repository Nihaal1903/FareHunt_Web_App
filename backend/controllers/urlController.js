const redirectUrl = async (req, res) => {
    console.log(req.body);
    const { vehicleType,serviceType, pickup_location, drop_location } = req.body;

    
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

        if (serviceType === 'uber') {
            redirect_url = `https://m.uber.com/ul/?pickup[latitude]=${pickup_lat}&pickup[longitude]=${pickup_lng}&drop[latitude]=${drop_lat}&drop[longitude]=${drop_lng}&product_id=${vehicleType}`;
        } else if (serviceType === 'rapido') {

            redirect_url= `https://www.rapido.bike/booking-confirmed?vehicle=${vehicleType}&bookingId=${rapidoBookingId}`;
        } else if (serviceType === 'ola') {
            redirect_url - `https://book.olacabs.com/?pickup_lat=${pickup_lat}&pickup_lng=${pickup_lng}&drop_lat=${drop_lat}&drop_lng=${drop_lng}&category=${vehicleType}`;
        } else {
            return res.status(400).json({ 
                error: 'Invalid service type' 
            });
        }

        res.json({
            status: 'true',
            pickup_location,
            drop_location,
            redirect_url: redirect_url,
        });

    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};
module.exports = redirectUrl;