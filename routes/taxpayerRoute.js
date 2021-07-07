const express = require('express');
const asyncHandler = require('express-async-handler');

const Taxpayer = require('../models/taxpayerModel');

const router = express.Router();

// GET TAXPAYER DETAILS
const getTaxpayerDetails = asyncHandler(async (req, res) => {
  const { bluebook_number, vehicle_number, policy_number, engine_cc } =
    req.body;
  const data = { bluebook_number, vehicle_number, policy_number, engine_cc };
  res.status(200).send({ success: true, data: data });
});

// CREATE NEW TAXPAYER ACCOUNT
// const createTaxpayerAcc = asyncHandler(async (req, res) => {
//   res.status(200).send({ success: true });
// });

//router.route('/').get(getTaxpayerDetails).post(createTaxpayerAcc);
router.route('/').get(getTaxpayerDetails);

module.exports = router;
