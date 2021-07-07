const express = require('express');
const asyncHandler = require('express-async-handler');

const Taxpayer = require('../models/taxpayerModel');

const router = express.Router();

// FETCH TAXPAYER DETAILS
const fetchTaxpayerDetails = asyncHandler(async (req, res) => {
  const { bluebook_number, vehicle_number, policy_number, engine_cc } =
    req.body;
  const fetchTaxpayer = await Taxpayer.find({
    bluebook_number: bluebook_number,
  });

  res.send(bluebook_number);

  if (fetchTaxpayer) {
    res.status(200).send({ success: true, data: fetchTaxpayer });
  } else {
    const newTaxpayer = new Taxpayer({
      taxpayer_name: 'Anonymous',
      bluebook_number: `${bluebook_number}`,
      vehicle_number: `${vehicle_number}`,
      policy_number: `${policy_number}`,
      province: 'Narayani',
      lot: 45,
      type: 'Bike',
      engine_cc: `${engine_cc}`,
      registered_date: '2020-01-01',
    });

    const taxpayerAdded = await newTaxpayer.save();
    res.status(200).send({ success: true, data: taxpayerAdded });
  }
});

// CREATE NEW TAXPAYER ACCOUNT
// const createTaxpayerAcc = asyncHandler(async (req, res) => {
//   res.status(200).send({ success: true });
// });

//router.route('/').get(getTaxpayerDetails).post(createTaxpayerAcc);
router.route('/').post(fetchTaxpayerDetails);

module.exports = router;
