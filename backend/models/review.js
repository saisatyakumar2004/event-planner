const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }, // Ensure comment is required
  date: { type: Date, required: true } // Ensure date is required
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;