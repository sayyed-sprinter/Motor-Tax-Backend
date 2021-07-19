const mongoose = require('mongoose');

const insuranceReportSchema = new mongoose.Schema(
  {
    taxpayer_name: { type: String, required: true },
    insurance_company: { type: String, required: true },
    insurance_type: { type: String, required: true },
    bluebook_number: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    type: { type: String, required: true },
    engine_cc: { type: Number, required: true },
    insuranceExpiryDate: { type: Date, required: true },
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

const insuranceReport = mongoose.model(
  'insuranceReport',
  insuranceReportSchema
);

module.exports = insuranceReport;
