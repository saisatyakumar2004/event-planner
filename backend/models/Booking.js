const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        index: true
    },
    bookedDates: [{
        date: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

bookingSchema.index({ productId: 1, 'bookedDates.date': 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
