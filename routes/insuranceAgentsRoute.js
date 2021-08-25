const express = require('express');
const asyncHandler = require('express-async-handler');

const insuranceagents = require('../models/insuranceAgentsModel');
const insurancecoverage = require('../models/insuranceCoverageModel');

const router = express.Router();

const allInsuranceAgents = asyncHandler(async (req, res) => {
  const allInsuranceAgents = await insuranceagents
    .find()
    .sort({ createdAt: -1 });
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
    insuranceCompany,
    licenseNumber,
    vatNumber,
    vat_file_path,
    license_file_path,
  } = req.body;

  const insuranceagent = new insuranceagents({
    address: address,
    contact: contact,
    email: email,
    insurance_company: insuranceCompany,
    license_number: licenseNumber,
    vat_number: vatNumber,
    docs: [{ vat_file_path, license_file_path }],
  });

  const insertedInsuranceAgent = await insuranceagent.save();

  const defaultCoverage = [
    {
      insurance_company: `${insertedInsuranceAgent._id.toString()}`,
      insurance_type: 'Third party',
      vehicle_type: 'bike',
      engine_cc: 'up to 125',
      premium: 1700,
      death: '500000',
      disabled: '500000',
      injured: '250000',
      medical_expenses: 'As per hospital bills',
      attendant_expenses: '45 per day, max 45 days',
    },
    {
      insurance_company: `${insertedInsuranceAgent._id.toString()}`,
      insurance_type: 'Third party',
      vehicle_type: 'bike',
      engine_cc: 'up to 150',
      premium: 2200,
      death: '600000',
      disabled: '600000',
      injured: '300000',
      medical_expenses: 'As per hospital bills',
      attendant_expenses: '50 per day, max 45 days',
    },
    {
      insurance_company: `${insertedInsuranceAgent._id.toString()}`,
      insurance_type: 'Third party',
      vehicle_type: 'bike',
      engine_cc: 'up to 250',
      premium: 2500,
      death: '650000',
      disabled: '650000',
      injured: '300000',
      medical_expenses: 'As per hospital bills',
      attendant_expenses: '55 per day, max 45 days',
    },
    {
      insurance_company: `${insertedInsuranceAgent._id.toString()}`,
      insurance_type: 'Third party',
      vehicle_type: 'bike',
      engine_cc: 'up to 400',
      premium: 3000,
      death: '700000',
      disabled: '700000',
      injured: '350000',
      medical_expenses: 'As per hospital bills',
      attendant_expenses: '60 per day, max 45 days',
    },
    {
      insurance_company: `${insertedInsuranceAgent._id.toString()}`,
      insurance_type: 'Third party',
      vehicle_type: 'bike',
      engine_cc: 'more than 400',
      premium: 5000,
      death: '800000',
      disabled: '800000',
      injured: '400000',
      medical_expenses: 'As per hospital bills',
      attendant_expenses: '100 per day, max 45 days',
    },
  ];

  const createdAgents = await insurancecoverage.insertMany(defaultCoverage);

  try {
    res
      .status(200)
      .send({ success: true, insertedInsuranceAgent, createdAgents });
  } catch (error) {
    res.status(503).send({ success: false, message: 'Service Unavailable' });
  }
});

const latestInsuranceAgents = asyncHandler(async (req, res) => {
  const latestInsuranceAgents = await insuranceagents
    .find()
    .limit(14)
    .sort({ createdAt: -1 });

  try {
    res
      .status(200)
      .send({ success: true, latestInsuranceAgents: latestInsuranceAgents });
  } catch (err) {
    console.log(`Error occured in /api/insurance-agents/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});

//to update insurance agent document verification information
const updateInsuranceAgent = asyncHandler(async (req, res) => {
  const insuranceagent = await insuranceagents.findById(req.params.id);
  console.log(insuranceagent);
  if (insuranceagent) {
    insuranceagent.verified = req.body.verified || false;
    insuranceagent.adminComment = req.body.adminComment || '';
    const updatedinsuranceagent = await insuranceagent.save();
    res.status(200).send({
      success: true,
      message: 'insurance agent documents verified!',
      updatedinsuranceagent: updatedinsuranceagent,
    });
  } else {
    res.status(200).send({ success: false, message: 'Record not found' });
  }
});

router.route('/').get(allInsuranceAgents).post(addInsuranceAgents);
router.route('/latest').get(latestInsuranceAgents);
router.route('/:id').put(updateInsuranceAgent);

module.exports = router;
