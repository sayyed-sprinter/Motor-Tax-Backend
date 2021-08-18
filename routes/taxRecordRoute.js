const express = require('express');
const asyncHandler = require('express-async-handler');

const taxRecord = require('../models/taxRecordModel');

const router = express.Router();

const checkPaymentHistory = asyncHandler(async (req, res) => {
    const { bluebook_number } = req.body;
  
    const taxpayerHistory = await taxRecord.find({bluebook_number});
  
    if (taxpayerHistory) {
      res
      .status(200)
      .send({ success: true, taxpayerHistory });
    } else {
      res
        .status(404)
        .send({ success: false, message: "can't find bluebook number" });
    }
  });
  

router.route('/').get(checkPaymentHistory);

module.exports = router;
