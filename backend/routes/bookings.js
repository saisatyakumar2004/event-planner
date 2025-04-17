const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Check date availability
router.post('/check-availability', async (req, res) => {
    try {
        const { productId, date } = req.body;
        const booking = await Booking.findOne({
            productId,
            'bookedDates.date': date
        });
        
        res.json({ 
            available: !booking,
            message: booking ? 'Date is already booked' : 'Date is available'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking availability', error: error.message });
    }
});

// Add new booking
router.post('/add', async (req, res) => {
    try {
        const { productId, date, orderId } = req.body;
        
        // Check if already booked
        const existingBooking = await Booking.findOne({
            productId,
            'bookedDates.date': date
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Date already booked' });
        }

        // Add booking
        await Booking.findOneAndUpdate(
            { productId },
            { 
                $push: { 
                    bookedDates: { date, orderId }
                }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Booking added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding booking', error: error.message });
    }
});

// Remove booking
router.post('/remove', async (req, res) => {
    try {
        const { productId, orderId } = req.body;
        
        await Booking.updateOne(
            { productId },
            { $pull: { bookedDates: { orderId } } }
        );

        res.json({ message: 'Booking removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing booking', error: error.message });
    }
});

// Get all booked dates for a product
router.get('/booked-dates/:productId', async (req, res) => {
    try {
        const booking = await Booking.findOne({ productId: req.params.productId });
        res.json({ 
            bookedDates: booking ? booking.bookedDates.map(b => b.date) : [] 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked dates', error: error.message });
    }
});

module.exports = router;
