const pool = require('../config/db');

class Booking {
    static async create(bookingData) {
        const { user_id, service_provider, vehicle_type, pickup_location, drop_location, distance, price } = bookingData;
        const result = await pool.query(
            `INSERT INTO bookings 
            (user_id, service_provider, vehicle_type, pickup_location, drop_location, distance, price)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, service_provider, vehicle_type, pickup_location, drop_location, distance, price]
        );
        return result.rows[0];
    }

    static async findById(bookingId) {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE booking_id = $1',
            [bookingId]
        );
        return result.rows[0];
    }

    static async findByUser(userId) {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_time DESC',
            [userId]
        );
        return result.rows;
    }

    static async updateStatus(bookingId, status) {
        const result = await pool.query(
            'UPDATE bookings SET status = $1 WHERE booking_id = $2 RETURNING *',
            [status, bookingId]
        );
        return result.rows[0];
    }

    static async getServiceBookings(service) {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE service_provider = $1 ORDER BY booking_time DESC',
            [service]
        );
        return result.rows;
    }
    static async getAllBookings(user_id){
        if(user_id){
            const res = "SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_time DESC";
            const bookings = await pool.query(res)
            return bookings.rows;
        }
    }

    static async checkBookingExists(user_id,booking_id){
        const res = "SELECT * FROM bookings WHERE user_id = $1 AND booking_id = $2";
        const istrue = await pool.query(res,[user_id,booking_id]);
        if(istrue.rows.length > 0){
            return true;
        }
    }

    static async deleteBooking(booking_id){
        const res = "DELETE FROM bookings WHERE booking_id=$1";
        const deleted = await pool.query(res,[booking_id]);
        if(deleted.rowCount > 0){
            return true;
        }
        else{
            return false;
        }
    }

    static async getBookingId(booking_id){
        const res = "SELECT * FROM bookings WHERE booking_id = $1";
        const booking = await pool.query(res,[booking_id]);
        if(booking.rows.length > 0){
            return booking.rows[0];
        }
        else{
            return false;
        }
    }
    
}


module.exports = Booking;