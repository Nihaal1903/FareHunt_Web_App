-- Create tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    service_provider VARCHAR(20) CHECK (service_provider IN ('uber', 'ola', 'rapido')),
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    external_booking_id VARCHAR(100)
);

<<<<<<< HEAD
=======
CREATE TABLE logins (
    login_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP
);

>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
-- Create indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(service_provider);

-- Insert sample data for testing
INSERT INTO users (name, email, phone) VALUES 
('Test User', 'test@example.com', '9876543210');

INSERT INTO bookings (user_id, service_provider, pickup_location, drop_location, distance, price, external_booking_id) VALUES
(1, 'uber', 'Central Park', 'Times Square', 5.2, 450.00, 'UBER-SIM-12345'),
(1, 'ola', 'Empire State', 'Brooklyn Bridge', 8.7, 620.00, 'OLA-SIM-67890'),
(1, 'rapido', 'Statue of Liberty', 'Wall Street', 3.5, 280.00, 'RAPIDO-SIM-54321');

<<<<<<< HEAD
=======
INSERT INTO logins (user_id, email, password_hash) VALUES
(1, 'test@example.com', 'sample_hashed_password');

>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
ALTER TABLE bookings ADD COLUMN vehicle_type VARCHAR(20);

UPDATE bookings SET vehicle_type = 'ubergo' WHERE service_provider = 'uber' AND external_booking_id LIKE 'UBER-SIM%';
UPDATE bookings SET vehicle_type = 'mini' WHERE service_provider = 'ola' AND external_booking_id LIKE 'OLA-SIM%';
UPDATE bookings SET vehicle_type = 'bike' WHERE service_provider = 'rapido' AND external_booking_id LIKE 'RAPIDO-SIM%';