const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String, // You should hash this before saving
  phoneNumber: String,
  orderHistory: {
    type: [String], // Change from [mongoose.Schema.Types.ObjectId] to [String]
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
