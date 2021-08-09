const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    citizenship_number: { type: String, required: true },
    bluebook_number: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    docs: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;