const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Note the capital R
const Order = require('../models/Order');

// Add a review
router.post('/add', async (req, res) => {
  try {
    console.log('Received review data:', req.body);
    const { orderId, productId, userId, userName, rating, comment } = req.body;

    // Validate required fields
    if (!orderId || !productId || !userId || !userName || !rating || !comment) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['orderId', 'productId', 'userId', 'userName', 'rating', 'comment']
      });
    }

    // Check if order exists and belongs to the user
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.customer_email !== userId) {
      return res.status(403).json({ message: 'This order does not belong to you' });
    }

    const review = new Review({
      orderId,
      productId,
      userId,
      userName,
      rating,
      comment,
      date: new Date()
    });

    await review.save();
    console.log('Review saved:', review);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    console.log('Fetching reviews for product:', req.params.productId);
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ date: -1 });
    console.log('Found reviews:', reviews);
    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check if user has already reviewed
router.get('/check', async (req, res) => {
  try {
    const { productId, orderId } = req.query;
    const review = await Review.findOne({ productId, orderId });
    res.json({ exists: !!review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
