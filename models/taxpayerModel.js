const mongoose = require('mongoose');

const taxpayerSchema = new mongoose.Schema(
  {
    taxpayer_name: { type: String, required: true },
    bluebook_number: { type: String, required: true, unique: true },
    vehicle_number: { type: String, required: true },
    policy_number: { type: String, required: true },
    province: { type: String, required: true },
    lot: { type: Number, required: true },
    type: { type: String, required: true },
    engine_cc: { type: Number, required: true },
    registered_date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Taxpayer = mongoose.model('Taxpayer', taxpayerSchema);

module.exports = Taxpayer;
