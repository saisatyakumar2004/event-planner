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
    const { customer_email, vendor_email, item_name, item_price, item_image_url, eventDetails } = req.body;

    const newOrder = new Order({
      order_id: generateOrderId(), // Generate unique order ID
      customer_email,
      vendor_email,
      item_name,
      item_price,
      item_image_url,
      accepted: false, // Initialize as not accepted (false)
      eventDetails, // Store event details in the order
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message,
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

// POST route to fetch multiple orders by their order IDs
router.post('/fetchOrdersByIds', async (req, res) => {
  const { orderIds } = req.body; // Expecting an array of order IDs

  try {
    // Fetch orders that match any of the order IDs provided in the request
    const orders = await Order.find({ order_id: { $in: orderIds } });

    // Check if orders were found
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the provided IDs' });
    }

    res.status(200).json(orders); // Return the found orders
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message,
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

module.exports = router;
