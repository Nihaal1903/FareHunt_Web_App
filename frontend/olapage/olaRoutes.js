// Ola Routes Service
class OlaRoutes {
    constructor() {
        this.baseRates = {
            auto: 30,      // Base rate per km
            mini: 40,      // Base rate per km
            bike: 20,      // Base rate per km
            prime_sedan: 50, // Base rate per km
            prime_suv: 60   // Base rate per km
        };

        this.surgeMultiplier = 1.0;
        this.timeMultiplier = 1.0;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    calculateTimeEstimate(distance) {
        // Assuming average speed of 30 km/h in city traffic
        const timeInHours = distance / 30;
        return Math.ceil(timeInHours * 60); // Convert to minutes
    }

    calculateFare(distance, vehicleType) {
        const baseRate = this.baseRates[vehicleType];
        const baseFare = distance * baseRate;
        const surgeFare = baseFare * this.surgeMultiplier;
        const timeFare = surgeFare * this.timeMultiplier;
        
        // Add base fare of 50 rupees
        const totalFare = timeFare + 50;
        
        // Round to nearest 10
        return Math.ceil(totalFare / 10) * 10;
    }

    getEstimates(pickupCoords, dropCoords) {
        const distance = this.calculateDistance(
            pickupCoords.lat, pickupCoords.lng,
            dropCoords.lat, dropCoords.lng
        );

        const timeEstimate = this.calculateTimeEstimate(distance);

        return {
            auto: this.calculateFare(distance, 'auto'),
            mini: this.calculateFare(distance, 'mini'),
            bike: this.calculateFare(distance, 'bike'),
            prime_sedan: this.calculateFare(distance, 'prime_sedan'),
            prime_suv: this.calculateFare(distance, 'prime_suv'),
            timeEstimate: timeEstimate
        };
    }

    setSurgeMultiplier(multiplier) {
        this.surgeMultiplier = multiplier;
    }

    setTimeMultiplier(multiplier) {
        this.timeMultiplier = multiplier;
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OlaRoutes;
} 