const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendor_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {  // Add password field
        type: String,
        required: true, // Make it required
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
