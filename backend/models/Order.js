const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true },
  customer_phone: { 
    type: String,
    required: false // Make it not required but expected
  },
  vendor_email: { type: String, required: true },
  item_name: { type: String, required: true },
  item_price: { type: mongoose.Schema.Types.Mixed, required: true }, // Changed to Mixed type
  item_image_url: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  venue_id: { 
    type: String, 
    required: false, // Changed from true to false
    sparse: true,
    index: true 
  },
  eventDetails: {
    eventDate: { 
      type: String, 
      required: true,
      index: true
    },
    eventTime: { type: String, required: true },
    eventName: { type: String, required: true },
    specialInstructions: String,
    eventLocation: { type: String, default: '' }
  },
}, {
  timestamps: true
});

OrderSchema.index({ venue_id: 1, 'eventDetails.eventDate': 1 });

// Add pre-save middleware to ensure phone number is never null
OrderSchema.pre('save', async function(next) {
  if (!this.customer_phone) {
    const user = await this.model('User').findOne({ email: this.customer_email });
    if (user && user.phoneNumber) {
      this.customer_phone = user.phoneNumber;
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
