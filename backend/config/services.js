module.exports = {
    uber: {
        vehicleTypes: {
            auto: {
                basePrice: 30,
                perKmPrice: 10,
                perMinPrice: 1,
                minFare: 50,
                surgeMultiplier: 1.0
            },
            ubergo: {
                basePrice: 40,
                perKmPrice: 12,
                perMinPrice: 1.2,
                minFare: 60,
                surgeMultiplier: 1.0
            },
            sedan: {
                basePrice: 50,
                perKmPrice: 15,
                perMinPrice: 1.5,
                minFare: 80,
                surgeMultiplier: 1.0
            },
            xl: {
                basePrice: 60,
                perKmPrice: 18,
                perMinPrice: 1.8,
                minFare: 100,
                surgeMultiplier: 1.0
            },
            bike: {
                basePrice: 20,
                perKmPrice: 8,
                perMinPrice: 0.8,
                minFare: 30,
                surgeMultiplier: 1.0
            }
        },
        baseUrl: 'http://localhost:3001/api/uber'
    },
    ola: {
        vehicleTypes: {
            auto: {
                basePrice: 25,
                perKmPrice: 9,
                perMinPrice: 0.9,
                minFare: 45,
                surgeMultiplier: 1.0
            },
            bike: {
                basePrice: 15,
                perKmPrice: 7,
                perMinPrice: 0.7,
                minFare: 25,
                surgeMultiplier: 1.0
            },
            mini: {
                basePrice: 35,
                perKmPrice: 11,
                perMinPrice: 1.1,
                minFare: 55,
                surgeMultiplier: 1.0
            },
            primesedan: {
                basePrice: 55,
                perKmPrice: 16,
                perMinPrice: 1.6,
                minFare: 85,
                surgeMultiplier: 1.0
            },
            primesuv: {
                basePrice: 65,
                perKmPrice: 20,
                perMinPrice: 2.0,
                minFare: 100,
                surgeMultiplier: 1.0
            }
        },
        baseUrl: 'http://localhost:3001/api/ola'
    },
    rapido: {
        vehicleTypes: {
            bike: {
                basePrice: 10,
                perKmPrice: 5,
                perMinPrice: 0.5,
                minFare: 20,
                surgeMultiplier: 1.0
            },
            auto: {
                basePrice: 20,
                perKmPrice: 8,
                perMinPrice: 0.8,
                minFare: 35,
                surgeMultiplier: 1.0
            },
            mini: {
                basePrice: 30,
                perKmPrice: 10,
                perMinPrice: 1.0,
                minFare: 50,
                surgeMultiplier: 1.0
            }
        },
        baseUrl: 'http://localhost:3001/api/rapido'
    }
};