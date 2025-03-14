// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    unique: true, // Ensure product_id is unique
  },
  vendor_email: {
    type: String,
    required: true, // Make it mandatory
  },
  category: {
    type: String,
    required: true, // Make it mandatory
  },
  title: {
    type: String,
    required: true, // Make it mandatory
  },
  location: {
    type: String,
    required: true, // Make it mandatory
  },
  ratings: {
    type: Number,
    min: 0, // Minimum rating
    max: 5, // Maximum rating
  },
  price: {
    type: Number,
    required: true, // Make it mandatory
  },
  image_url: {
    type: String,
  },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
