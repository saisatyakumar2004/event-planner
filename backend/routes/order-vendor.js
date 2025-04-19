
const express = require('express');
const Order = require('../models/Order'); // Adjust the path as necessary
const axios = require('axios'); // Add axios to make HTTP requests

// Function to define the accept order logic
const orderVendorRoutes = (app) => {
  app.put('/api/order-vendor/accept/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
      // Find the order by IDs
      const order = await Order.findOne({ order_id: orderId });

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Order not found.');
      }

      // Check if the order is already accepted
      if (order.accepted) {
        return res.status(400).send('Order already accepted.');
      }

      // Update the accepted field to true for the given order ID
      const result = await Order.updateOne(
        { order_id: orderId },
        { $set: { accepted: true } }
      );

      // Send email to customer using the /send-order-status route in otp.js
      await axios.post('https://event-planner-ihsd.onrender.com/api/otp/send-order-status', {
        email: order.customer_email,
        orderId: order.order_id,
        status: 'accepted',
      });

      console.log('Update Result:', result); // Log the update result
      return res.status(200).send('Order accepted.');
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send('An error occurred while updating the order.');
    }
  });

  app.put('/api/order-vendor/reject/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
      // Find the order by ID
      const order = await Order.findOne({ order_id: orderId });

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Order not found.');
      }

      // Check if the order is already rejected
      if (order.rejected) {
        return res.status(400).send('Order already rejected.');
      }

      // Update the accepted field to false for the given order ID
      const result = await Order.updateOne(
        { order_id: orderId },
        { $set: { rejected: true } }
      );

      // Send email to customer using the /send-order-status route in otp.js
      await axios.post('https://event-planner-ihsd.onrender.com/api/otp/send-order-status', {
        email: order.customer_email,
        orderId: order.order_id,
        status: 'rejected',
      });

      console.log('Update Result:', result); // Log the update result
      return res.status(200).send('Order rejected.');
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send('An error occurred while updating the order.');
    }
  });
};

module.exports = orderVendorRoutes;