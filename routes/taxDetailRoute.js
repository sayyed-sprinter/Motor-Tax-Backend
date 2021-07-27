const express = require('express');
const asyncHandler = require('express-async-handler');
const TaxDetail = require('../models/taxDetailModel');

const router = express.Router();


const fetchTaxDetail = asyncHandler(async (req, res) => {
  const taxDetail = await TaxDetail.find();
  try {
    console.log(taxDetail)
    res
      .status(200)
      .send({ success: true, taxDetail: taxDetail, message:"fetched" });
  } catch (err) {
    console.log(`Error occured in /api/tax-details/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});
     


router.route('/').get(fetchTaxDetail)

module.exports = router;