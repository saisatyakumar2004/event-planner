// routes/user.js
const express = require('express');
const User = require('../models/User'); // Import your User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const router = express.Router();

// Get User Profile Route
router.get('/', async (req, res) => {
    const { email } = req.query; // Extract email from query parameters

    // Ensure email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send back user data (excluding password)
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            orderHistory: user.orderHistory // Include order history
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Profile Route
router.post('/updateProfile', async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Ensure email is provided for finding the user
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the user by email and update their information
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Filter by email
            { firstName, lastName, phoneNumber }, // Updated fields
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser); // Send back the updated user data
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Password Route
router.post('/updatePassword', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    // Ensure email and passwords are provided
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, old password, and new password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save(); // Save the updated user

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Order History Route
router.put('/updateOrderHistory', async (req, res) => {
    const { email, orderId } = req.body;

    // Ensure email and orderId are provided
    if (!email || !orderId) {
        return res.status(400).json({ error: 'Email and order ID are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the new order ID to the user's orderHistory array
        user.orderHistory.push(orderId);
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Order history updated successfully' });
    } catch (error) {
        console.error('Error updating order history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
