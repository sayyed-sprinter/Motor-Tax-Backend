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

const saveFeedback = asyncHandler(async (req, res) => {
  const fetchTaxRecord = await taxRecord.findById(req.params.record_id);

  if (fetchTaxRecord) {
    fetchTaxRecord.feedback = req.body.feedback || '';
    const updatedTaxRecord = await fetchTaxRecord.save();
    res.status(200).send({
      success: true,
      message: 'Feedback saved successfully!',
      updatedTaxRecord,
    });
  } else {
    res.status(200).send({ success: true, message: 'Error saving feedback!' });
  }
});

const saveRating = asyncHandler(async (req, res) => {
  const fetchTaxRecord = await taxRecord.findById(req.params.record_id);

  if (fetchTaxRecord) {
    fetchTaxRecord.rating = req.body.rating || 0;
    const updatedTaxRecord = await fetchTaxRecord.save();
    console.log(updatedTaxRecord);

    res.status(200).send({
      success: true,
      message: 'Rating saved successfully!',
      updatedTaxRecord,
    });
  } else {
    res.status(200).send({ success: true, message: 'Error saving rating!' });
  }
});

const fetchTaxRecord = asyncHandler(async (req, res) => {
  const allTaxRecordDocs = await taxRecord.find().limit(3).sort({ rating: -1 });

  const feedback = allTaxRecordDocs.map((taxRecord) => {
    const taxpayerName = taxRecord.taxpayer;
    const taxpayerRating = taxRecord.rating || 0;
    const taxpayerFeedback = taxRecord.feedback || '';

    return { taxpayerName, taxpayerRating, taxpayerFeedback };
  });

  if (allTaxRecordDocs) {
    res.status(200).send({
      success: true,
      feedback,
    });
  } else {
    res.status(404).send({ success: true, message: 'Error fetching data!' });
  }
});

router.route('/:bluebookNum').get(checkPaymentHistory);
router.route('/feedback/:record_id').post(saveFeedback);
router.route('/rating/:record_id').post(saveRating);
router.route('/').get(fetchTaxRecord);

module.exports = router;
