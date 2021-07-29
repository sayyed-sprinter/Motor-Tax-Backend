const express = require('express');
const asyncHandler = require('express-async-handler');

const FAQs = require('../models/faqsModel');

const router = express.Router();

const addFAQs = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;

  const faqs = new FAQs({
    question: question,
    answer: answer,
  });

  const faqsInserted = await faqs.save();
  res.status(200).send({ success: true, faqsInserted });
});

const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQs.find();

  try {
    res.status(200).send({ success: true, FAQs: faqs });
  } catch (err) {
    console.log(`Error occured in /api/faqs/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});

router.route('/').post(addFAQs).get(getFAQs);

module.exports = router;
