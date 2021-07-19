const mongoose = require('mongoose');

const insuranceCoverageSchema = new mongoose.Schema(
  {
    insurance_company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'insuranceagents',
    },
    insurance_type: { type: String, default: 'Third party' },
    vehicle_type: { type: String, required: true },
    engine_cc: { type: String, required: true },
    premium: { type: Number, required: true },
    death: { type: String, default: '500000' },
    disabled: { type: String, default: '500000' },
    injured: { type: String, default: '250000' },
    medical_expenses: {
      type: String,
      default: 'As per hospital bills',
    },
    attendant_expenses: {
      type: String,
      default: '45 per day, max 45 days',
    },
  },
  {
    timestamps: true,
  }
);

const insurancecoverage = mongoose.model(
  'insurancecoverage',
  insuranceCoverageSchema
);

module.exports = insurancecoverage;
