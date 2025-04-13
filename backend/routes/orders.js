const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Adjust the path as necessary

// Function to generate a unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(); // Current timestamp
  const randomNum = Math.floor(Math.random() * 1000); // Random number between 0-999
  return `${timestamp}-${randomNum}`; // Combine for uniqueness
};

// POST route to create a new order
router.post('/addOrder', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['order_id', 'customer_email', 'vendor_email', 'item_name', 'item_price', 'venue_id'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const orderData = {
      order_id: req.body.order_id,
      customer_email: req.body.customer_email,
      vendor_email: req.body.vendor_email,
      item_name: req.body.item_name,
      item_price: req.body.item_price,
      item_image_url: req.body.item_image_url,
      venue_id: req.body.venue_id,
      eventDetails: req.body.eventDetails,
      accepted: false,
      rejected: false
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    // Update user's order history
    const User = require('../models/User');
    await User.findOneAndUpdate(
      { email: req.body.customer_email },
      { $push: { orderHistory: orderData.order_id } }
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
});

// GET route to fetch all orders
router.get('/fetchOrders', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.status(200).json(orders); // Return all found orders
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
});

// GET route to fetch a single order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
      
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order',
      error: error.message,
    });
  }
});

// POST route to fetch multiple orders by their order IDs
router.post('/fetchOrdersByIds', async (req, res) => {
  try {
    const { orderIds } = req.body;
    if (!orderIds || !Array.isArray(orderIds)) {
      return res.status(400).json({ message: 'Invalid order IDs provided' });
    }

    const orders = await Order.find({ order_id: { $in: orderIds } });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// DELETE route to delete an order by order ID
router.delete('/deleteOrder/:orderId', async (req, res) => {
  const { orderId } = req.params; // Extract order ID from request parameters

  try {
    // Find and delete the order with the given order ID
    const deletedOrder = await Order.findOneAndDelete({ order_id: orderId });

    // Check if the order was found and deleted
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message,
    });
  }
});

// POST route to check date availability
router.post('/check-date-availability', async (req, res) => {
  const { vendorId, date } = req.body;
  try {
    const existingBooking = await Order.findOne({
      'eventDetails.eventDate': date,
      vendor_id: vendorId,
      accepted: true
    });
    res.json({ isBooked: !!existingBooking });
  } catch (error) {
    res.status(500).json({ error: 'Error checking availability' });
  }
});

// GET route to fetch booked dates for a vendor
router.get('/booked-dates/:vendorId', async (req, res) => {
  try {
    const bookedOrders = await Order.find({
      vendor_id: req.params.vendorId,
      accepted: true
    }, 'eventDetails.eventDate');
    
    const bookedDates = bookedOrders.map(order => order.eventDetails.eventDate);
    res.json({ bookedDates });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booked dates' });
  }
});

// Check venue availability
router.post('/check-venue-availability', async (req, res) => {
  try {
    const { venueId, date } = req.body;
    
    const existingBooking = await Order.findOne({
      $or: [
        { item_name: venueId },
        { venue_id: venueId }
      ],
      'eventDetails.eventDate': date
    });

    res.json({
      success: true,
      isAvailable: !existingBooking,
      message: existingBooking ? 'Date is already booked' : 'Date is available'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking availability' 
    });
  }
});

// Fetch booked dates for a venue
router.get('/venue-booked-dates/:venueId', async (req, res) => {
  try {
    const bookedOrders = await Order.find({
      $or: [
        { item_name: req.params.venueId },
        { venue_id: req.params.venueId }
      ],
      'eventDetails.eventDate': { $exists: true }
    }).select('eventDetails.eventDate');

    res.json({
      success: true,
      bookedDates: bookedOrders.map(order => order.eventDetails.eventDate)
    });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching booked dates',
      bookedDates: [] 
    });
  }
});

module.exports = router;