const express = require('express');
const asyncHandler = require('express-async-handler');

const taxRecord = require('../models/taxRecordModel');

const router = express.Router();

const checkPaymentHistory = asyncHandler(async (req, res) => {
  const bluebook_number = req.params.bluebookNum;

  const taxpayerHistory = await taxRecord
    .find({ bluebook_number })
    .sort({ createdAt: 1 });

  if (taxpayerHistory) {
    res.status(200).send({ success: true, taxpayerHistory });
  } else {
    res
      .status(404)
      .send({ success: false, message: "can't find bluebook number" });
  }
});

router.route('/:bluebookNum').get(checkPaymentHistory);

module.exports = router;
