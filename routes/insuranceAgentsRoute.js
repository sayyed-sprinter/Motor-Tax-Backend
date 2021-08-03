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
    res.status(503).send({ success: false, message:" service unavailable"});
  }

});


//fetch latest insurance
const  latestInsuranceAgents = asyncHandler(async (req, res) => {

  const latestInsuranceAgents = await insuranceagents.find().limit(14).sort({createdAt:1});

  try {
    res
      .status(200)
      .send({ success: true, latestInsuranceAgents: latestInsuranceAgents });
  } catch (err) {
    console.log(`Error occured in /api/insurance-agents/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});




// fetch insurance company docs
const fetchAllInsuranceCompanyRecordDoc = asyncHandler(async (req, res) => {
  const fetchAllInsuranceCompanyRecordDocs = await insuranceagents.find({ });
  try {
    res.status(200).send({ success: true, fetchAllInsuranceCompanyRecordDocs: fetchAllInsuranceCompanyRecordDocs });
  } catch (err) {
    console.log(`Error occured in /api/taxpayer/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});

router.route('/').get(allInsuranceAgents).post(addInsuranceAgents);
router.route('/InsuranceCompanyRecordDoc').get(fetchAllInsuranceCompanyRecordDoc)
router.route('/latest').get(latestInsuranceAgents)

module.exports = router;
