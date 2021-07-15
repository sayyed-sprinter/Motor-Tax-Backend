const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema(
  {
    insurance_company: { type: String, required: true, unique: true },
    insurance_type:{type:String, required:true, unique:true},
    bluebook_number: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    type:{type:String, required:true},
    engine_cc: { type: Number, required: true },
    insuranceAmount: { type: String, required: true },
    insuranceExpiryDate:{type:Date, required:true},
    driver:{type:String, required:true},
    conductor:{type:String, required:true},
    helper:{type:String, required:true},
    passenger:{type:String, required:true},
    medical_expenses:{type:String, required:true}
  },
  {
    timestamps: true,
  }
);

const insurance = mongoose.model('insurance', insuranceSchema);

module.exports = insurance;