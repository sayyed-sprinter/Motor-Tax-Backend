const express = require('express');
const asyncHandler = require('express-async-handler');
 
const insuranceagents = require('../models/insuranceAgentsModel');
 
const router = express.Router();
 
const allInsuranceAgents = asyncHandler(async (req, res) => {
  const allInsuranceAgents = await insuranceagents.find();
 
  try {
    res
      .status(200)
      .send({ success: true, allInsuranceAgents: allInsuranceAgents });
  } catch (err) {
    console.log(`Error occured in /api/insurance-agents/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});
 
const addInsuranceAgents = asyncHandler(async (req, res) => {
  const {
    address,
    contact,
    email,
    insurance_company,
    license_number,
    vat_number,
    vat_file_path,
    license_file_path,
  } = req.body;
 
  const insuranceagent = new insuranceagents({
    address:address,
    contact:contact,
    email:email,
    insurance_company: insurance_company,
    license_number: license_number,
    vat_number:vat_number,
    docs: [{ vat_file_path, license_file_path }],
  });
 
  const InsertedInsuranceAgent = await insuranceagent.save();
 
  try {
    res.status(200).send({ success: true, InsertedInsuranceAgent });
  } catch (error) {
    res.status(503).send({ success: false, message:"Service Unavailable"});
  }
 
});
 
router.route('/').get(allInsuranceAgents).post(addInsuranceAgents);
 
module.exports = router;