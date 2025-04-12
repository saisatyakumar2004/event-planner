const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true },
  vendor_email: { type: String, required: true },
  item_name: { type: String, required: true },
  item_price: { type: String, required: true },
  item_image_url: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  venue_id: { 
    type: String, 
    required: true,
    index: true 
  },
  eventDetails: {
    eventDate: { 
      type: String, 
      required: true,
      index: true // Add index for better query performance
    },
    eventTime: { type: String, required: true },
    eventName: { type: String, required: true },
    specialInstructions: String,
    eventLocation: String
  },
});

// Add compound index for venue availability queries
OrderSchema.index({ venue_id: 1, 'eventDetails.eventDate': 1 });

module.exports = mongoose.model('Order', OrderSchema);
