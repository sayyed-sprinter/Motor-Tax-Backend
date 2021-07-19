const mongoose = require('mongoose');

const insuranceAgentsSchema = new mongoose.Schema(
  {
    insurance_company: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const insuranceagents = mongoose.model(
  'insuranceagents',
  insuranceAgentsSchema
);

module.exports = insuranceagents;
