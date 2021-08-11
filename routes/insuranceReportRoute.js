const express = require('express');
const asyncHandler = require('express-async-handler');

const Taxpayer = require('../models/taxpayerModel');
const insuranceReport = require('../models/insuranceReportModel');
const taxRecord = require('../models/taxRecordModel');
const insuranceagents = require('../models/insuranceAgentsModel');
const insurancecoverage = require('../models/insuranceCoverageModel');

const router = express.Router();

const ccValue = (cc) => {
  if (cc <= 122) {
    return 'up to 125';
  }
  if (cc < 150) {
    return 'up to 150';
  }
  if (cc <= 250) {
    return 'up to 250';
  }
  if (cc <= 400) {
    return 'up to 400';
  }
  if (cc > 400) {
    return 'more than 400';
  }
};

const generateInsuranceReport = asyncHandler(async (req, res) => {
  const {
    bluebook_number,
    vehicle_number,
    engine_cc,
    insurance_company,
    bluebook_file_path,
    citizenship_file_path,
  } = req.body;

  const fetchInsuranceReport = await insuranceReport
    .find(
      {
        $and: [
          { bluebook_number: bluebook_number },
          { vehicle_number: vehicle_number },
          { engine_cc: engine_cc },
        ],
      },
      function (err, result) {
        if (!err) return result;
      }
    )
    .sort({ createdAt: -1 })
    .limit(1);

  const currYear = `${new Date().getFullYear()}`;
  const created_at = fetchInsuranceReport[0]
    ? `${fetchInsuranceReport[0].createdAt}`
    : null;
  const insuredYear = created_at ? created_at.split(' ')[3] : null;

  if (currYear == insuredYear) {
    res.status(200).send({
      success: true,
      insuranceReports: {
        ...fetchInsuranceReport[0]._doc,
        insurancePaid: true,
      },
    });
  } else {
    const fetchTaxpayer = await Taxpayer.find(
      {
        $and: [
          { bluebook_number: bluebook_number },
          { vehicle_number: vehicle_number },
          { engine_cc: engine_cc },
        ],
      },
      function (err, result) {
        if (!err) return result;
      }
    );

    const fetchLastTaxPaidYear = await taxRecord
      .findOne({
        bluebook_number: bluebook_number,
      })
      .sort({ createdAt: -1 });

    const lastTaxPaidYear = `${fetchLastTaxPaidYear.createdAt}`.split(' ')[3];

    const newDate = new Date();
    const currDate = newDate.getFullYear();

    if (fetchTaxpayer[0] != undefined) {
      if (currDate > lastTaxPaidYear) {
        const vehicleType = `${fetchTaxpayer[0].type}`;
        const vehicleCC = parseInt(`${fetchTaxpayer[0].engine_cc}`);
        const taxpayer_name = `${fetchTaxpayer[0].taxpayer_name}`;
        const vehicleCCStr = ccValue(vehicleCC);

        const expiryDate = new Date(
          currDate + 1,
          newDate.getMonth(),
          newDate.getDate()
        );

        // GET ID OF INSURANCE COMPANY
        const premiumDetails = await insuranceagents.findOne({
          insurance_company: insurance_company,
        });

        // GET COVERAGES OF BIKE FILTERED WITH ENGINE_CC
        const coverages = await insurancecoverage.find(
          {
            $and: [{ vehicle_type: 'bike' }, { engine_cc: vehicleCCStr }],
          },
          function (err, result) {
            if (!err) return result;
          }
        );

        // INITIATE OBJ, FILTER COVERAGE OF COMPANY AND PUT INTO OBJ
        let coverageObj = {};
        coverages.forEach((coverage) => {
          if (premiumDetails._id == coverage.insurance_company) {
            coverageObj = coverage;
          }
        });

        const insuranceReports = new insuranceReport({
          taxpayer_name: taxpayer_name,
          insurance_company: insurance_company,
          bluebook_number: bluebook_number,
          vehicle_number: vehicle_number,
          insuranceExpiryDate: expiryDate,
          engine_cc: engine_cc,
          type: `${coverageObj.vehicle_type}`,
          insurance_type: `${coverageObj.insurance_type}`,
          premium: coverageObj.premium || '3500',
          death: `${coverageObj.death}`,
          disabled: `${coverageObj.disabled}`,
          injured: `${coverageObj.injured}`,
          medical_expenses: `${coverageObj.medical_expenses}`,
          attendant_expenses: `${coverageObj.attendant_expenses}`,
        });
        const recordInserted = await insuranceReports.save();
        const policy_number = recordInserted._id;

        console.log(recordInserted);

        res.status(200).send({
          success: true,
          insuranceReports,
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'tax-paid',
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message:
          'Unable to fetch your data! Please check your credentials and try again.',
      });
    }
  }
});

router.route('/').post(generateInsuranceReport);

module.exports = router;
