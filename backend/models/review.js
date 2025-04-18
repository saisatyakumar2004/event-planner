const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    productId: {  // Changed from venueId
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    comment: {    // Changed from review
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);