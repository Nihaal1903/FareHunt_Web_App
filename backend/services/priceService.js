// services/priceService.js
const { uber, ola, rapido } = require('../config/services');

class PriceService {
    calculateFare(service, vehicleType, distance, duration) {
        const serviceConfig = this.getServiceConfig(service);
        const vehicleConfig = serviceConfig.vehicleTypes[vehicleType];
        
        if (!vehicleConfig) {
            throw new Error(`Invalid vehicle type: ${vehicleType} for service: ${service}`);
        }

        // Calculate base fare
        let fare = vehicleConfig.basePrice + 
                  (vehicleConfig.perKmPrice * distance) + 
                  (vehicleConfig.perMinPrice * duration);
        
        // Apply surge pricing
        fare *= this.calculateSurge(service, vehicleType);
        
        // Ensure minimum fare and round to nearest whole number
        return Math.round(Math.max(fare, vehicleConfig.minFare));
    }

    calculateSurge(service, vehicleType) {
        // Implement dynamic surge pricing logic
        const baseSurge = this.getServiceConfig(service).vehicleTypes[vehicleType].surgeMultiplier;
        
        // Add randomness to simulate real-world surges (1.0 - 1.5x)
        return baseSurge + (Math.random() * 0.5);
    }

    calculateDistance(pickup, drop) {
        // Haversine formula implementation
        const R = 6371; // Earth radius in km
        const dLat = this.toRad(drop.lat - pickup.lat);
        const dLon = this.toRad(drop.lng - pickup.lng);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(pickup.lat)) * Math.cos(this.toRad(drop.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    calculateDuration(distance, service) {
        // Service-specific speed assumptions (in km/h)
        const averageSpeeds = {
            uber: 25,
            ola: 22,
            rapido: 30 // Bikes are faster
        };
        return (distance / averageSpeeds[service]) * 60; // Convert to minutes
    }

    toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    getServiceConfig(service) {
        const config = { uber, ola, rapido }[service];
        if (!config) throw new Error(`Invalid service: ${service}`);
        return config;
    }
}

module.exports = new PriceService();