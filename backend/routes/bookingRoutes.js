const express = require('express');
const router = express.Router();  // Add this line to create a router instance
const PriceService = require('../services/priceService');

router.post('/api/estimate', async (req, res) => {
    const { service, pickup_lng, pickup_lat, drop_lng, drop_lat } = req.body;
    
    try {
        const pickup = { lng: pickup_lng, lat: pickup_lat };
        const drop = { lng: drop_lng, lat: drop_lat };
        
        const distance = PriceService.calculateDistance(pickup, drop);
        const duration = PriceService.calculateDuration(distance, service);
        
        const estimates = {};
        const vehicleTypes = Object.keys(require('../config/services')[service].vehicleTypes);
        
        for (const vehicleType of vehicleTypes) {
            estimates[vehicleType] = {
                price: PriceService.calculateFare(service, vehicleType, distance, duration),
                distance,
                duration
            };
        }
        
        res.json({
            success: true,
            service,
            estimates,
            currency: 'INR'
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;  // Export the router