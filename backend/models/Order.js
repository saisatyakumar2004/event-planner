const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true },
  vendor_email: { type: String, required: true },
  item_name: { type: String, required: true },
  item_price: { type: String, required: true },
  item_image_url: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  eventDetails: {
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    eventLocation: { type: String, required: true },
    specialInstructions: { type: String },
  },
});

module.exports = mongoose.model('Order', OrderSchema);
