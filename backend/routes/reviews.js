const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Order = require('../models/Order'); // Assuming you have an Order model

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new review
router.post('/add', async (req, res) => {
  try {
    // Verify the order exists and belongs to the user
    const order = await Order.findOne({ 
      _id: req.body.order_id,
      customer_email: req.body.userId 
    });
    
    if (!order) {
      return res.status(400).json({ message: 'Invalid order ID or order does not belong to you' });
    }

    const newReview = new Review({
      productId: req.body.productId,
      orderId: req.body.orderId,
      userId: req.body.userId,
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;