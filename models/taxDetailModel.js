const mongoose = require('mongoose');


const taxDetailSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    
    tax_detail:[{
    engine_cc: { type: Number, required: true },
    tax_charge:{ type: Number, required: true },
    }]
  }
);


const TaxDetail = mongoose.model('taxdetail', taxDetailSchema);



module.exports = TaxDetail;