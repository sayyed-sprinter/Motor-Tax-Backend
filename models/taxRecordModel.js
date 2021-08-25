const mongoose = require('mongoose');

const taxRecordSchema = new mongoose.Schema(
  {
    taxpayer: { type: String, required: true, default: 'Anonymous' },
    bluebook_number: { type: String, required: true },
    policy_number: { type: String, required: true },
    paidYear: { type: Number, required: true },
    paidMonth: { type: Number, required: true },
    paidDate: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    taxOverdue: { type: String, required: true },
    penaltyOnOverdue: { type: Number, required: true },
    pollutingCharge: { type: Number, required: true },
    docs: { type: Array, required: true },
    verified: { type: Boolean, required: true, default: false },
    adminComment: { type: String, default: '' },
    feedback: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    nextPaymentDate: { type: Date, default: '' },
    remainingDays: { type: Number, default: 365 },
  },
  {
    timestamps: true,
  }
);

const taxRecord = mongoose.model('taxRecord', taxRecordSchema);

module.exports = taxRecord;
