const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const vendorRoutes = require('./routes/vendorauth');
const vendor = require('./routes/vendor');
const orderVendorRoutes = require('./routes/order-vendor');
const productRoutes = require('./routes/product');
const otpRoutes = require('./routes/otp'); // Import OTP routes
const bookingRoutes = require('./routes/bookings'); // Import booking routes
require('dotenv').config();

const reviewRoutes = require('./routes/reviews');

const app = express();

// Connect to MongoDB
const startServer = async () => {
    try {
        await connectDB();
        
        // Middleware
        app.use(cors());
        app.use(express.json());

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/user', userRoutes);
        app.use('/api/orders', orderRoutes);
        app.use('/api/vendorauth', vendorRoutes);
        app.use('/api/vendor', vendor);
        app.use('/api/product', productRoutes);
        app.use('/api/otp', otpRoutes);
       
        app.use('/api/bookings', bookingRoutes);
        app.use('/api/reviews', reviewRoutes);
        // Initialize order vendor routes
        orderVendorRoutes(app);

        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();