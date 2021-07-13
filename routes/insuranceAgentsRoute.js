const express = require('express');
const asyncHandler = require('express-async-handler');

const insuranceAgents = require('../models/insuranceAgentsModel');

const router = express.Router();

const allInsuranceAgents = asyncHandler(async (req, res) => {
  const allInsuranceAgents = await insuranceAgents.find();

  try {
    res
      .status(200)
      .send({ success: true, allInsuranceAgents: allInsuranceAgents });
  } catch (err) {
    console.log(`Error occured in /api/insurance-agents/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});

router.route('/').get(allInsuranceAgents);

module.exports = router;
