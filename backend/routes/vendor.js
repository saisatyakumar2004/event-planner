const express = require('express');
const Vendor = require('../models/Vendor'); // Import your Vendor model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const router = express.Router();

// Get Vendor Profile Route
router.get('/', async (req, res) => {
    const { vendor_email } = req.query; // Extract email from query parameters

    // Ensure email is provided
    if (!vendor_email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the vendor by email
        // Find the vendor by email
        const vendor = await Vendor.findOne({ vendor_email });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Send back vendor data
        res.status(200).json({
            name: vendor.name,
            vendor_email: vendor.vendor_email,
            phone: vendor.phone,
            isVerified: vendor.isVerified // Include verification status
        });
    } catch (error) {
        console.error('Error fetching vendor data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Profile Route
router.post('/updateProfile', async (req, res) => {
    const { name, vendor_email, phone } = req.body;

    // Ensure email is provided for finding the vendor
    if (!vendor_email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the vendor by email and update their information
        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendor_email }, // Filter by email
            { name, phone }, // Updated fields
            { new: true } // Return the updated document
        );

        if (!updatedVendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json(updatedVendor); // Send back the updated vendor data
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Password Route
router.post('/updatePassword', async (req, res) => {
    const { vendor_email, oldPassword, newPassword } = req.body;

    // Ensure email and passwords are provided
    if (!vendor_email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, old password, and new password are required' });
    }

    try {
        // Find the vendor by email
        const vendor = await Vendor.findOne({ vendor_email });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the vendor's password
        vendor.password = hashedPassword;
        await vendor.save(); // Save the updated vendor

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Verification Status Route
router.put('/updateVerification', async (req, res) => {
    const { vendor_email, isVerified } = req.body;

    // Ensure email is provided
    if (!vendor_email || isVerified === undefined) {
        return res.status(400).json({ error: 'Email and verification status are required' });
    }

    try {
        // Find the vendor by email and update their verification status
        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendor_email }, // Filter by email
            { isVerified }, // Updated fields
            { new: true } // Return the updated document
        );

        if (!updatedVendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json(updatedVendor); // Send back the updated vendor data
    } catch (error) {
        console.error('Error updating verification status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
