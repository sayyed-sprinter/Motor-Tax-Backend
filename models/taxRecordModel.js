const mongoose = require('mongoose');

const taxRecordSchema = new mongoose.Schema(
  {
    bluebook_number: { type: String, required: true },
    paidYear: { type: Number, required: true },
    paidMonth: { type: Number, required: true },
    paidDate: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    taxOverdue: { type: String, required: true },
    penaltyOnOverdue: { type: Number, required: true },
    pollutingCharge: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const taxRecord = mongoose.model('taxRecord', taxRecordSchema);

module.exports = taxRecord;
