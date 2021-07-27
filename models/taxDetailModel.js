const mongoose = require('mongoose');

const taxRateSchema = new mongoose.Schema({
  engine_cc: { type: String, required: true },
  rate: { type: Number, required: true },
});

const taxDetailSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  tax_rates: [taxRateSchema],
});

const TaxDetail = mongoose.model('taxdetail', taxDetailSchema);

module.exports = TaxDetail;
