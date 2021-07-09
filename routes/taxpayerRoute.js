const express = require('express');
const asyncHandler = require('express-async-handler');

const Taxpayer = require('../models/taxpayerModel');
const taxRecord = require('../models/taxRecordModel');

const router = express.Router();

const convertMonthNumeric = (month) => {
  var date = 0;
  month === 'Jan' && (date = 1);
  month === 'Feb' && (date = 2);
  month === 'Mar' && (date = 3);
  month === 'Apr' && (date = 4);
  month === 'May' && (date = 5);
  month === 'Jun' && (date = 6);
  month === 'Jul' && (date = 7);
  month === 'Aug' && (date = 8);
  month === 'Sep' && (date = 9);
  month === 'Oct' && (date = 10);
  month === 'Nov' && (date = 11);
  month === 'Dec' && (date = 12);

  return date;
};

const calculateTaxRate = (type, cc) => {
  let rate = 0;
  switch (type) {
    case 'bike' || 'Bike' || 'BIKE':
      switch (cc) {
        case cc < 125:
          rate = 2500;
          break;

        case cc < 150:
          rate = 4000;
          break;

        case cc < 250:
          rate = 8000;
          break;

        case cc < 400:
          rate = 16000;
          break;

        default:
          rate = 30000;
          break;
      }
      break;
    case 'car' || 'Car' || 'CAR':
      switch (cc) {
        case cc <= 1000:
          rate = 21000;
          break;

        case cc < 1500:
          rate = 23000;
          break;

        case cc < 2000:
          rate = 25000;
          break;

        case cc < 2500:
          rate = 38000;
          break;

        case cc < 2900:
          rate = 45000;
          break;

        default:
          rate = 100000;
          break;
      }
      break;
  }
};

const calculateTax = (registeredMonth, registeredDay, rate = 2500) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  let taxDetails;

  // 1. Get last paid year and calculate the tax amount

  const numOfYears = currentYear - 2018;
  const chargeableTax = numOfYears * rate;

  // Calculate Num of months
  const numOfMonths = currentMonth - registeredMonth;
  const numOfDays = currentDay - registeredDay;

  console.log(
    `currentyear: ${currentYear}, Num of years: ${numOfYears} months: ${numOfMonths} days: ${numOfDays}`
  );

  // 2. check if fine should be charged or not
  if (numOfYears > 1 && numOfMonths > 3) {
    if (numOfDays > 0) {
      console.log('entered');
      const fineForYears = numOfYears - 1;
      const fine = (fineForYears * rate * 32) / 100;
      console.log(
        `Chargebale tax = ${chargeableTax}, fine for years = ${fineForYears} and fine = ${fine}`
      );
      taxDetails = {
        numOfYears: numOfYears,
        chargeableTax: chargeableTax,
        fineForYears: fineForYears,
        fine: fine,
      };
    }
  }
  return taxDetails;
};

// FETCH TAXPAYER DETAILS
const fetchTaxpayerDetails = asyncHandler(async (req, res) => {
  const {
    bluebook_number,
    vehicle_number,
    policy_number,
    engine_cc,
    bluebook_file_path,
    citizenship_file_path,
    policy_file_path,
  } = req.body;
  const fetchTaxpayer = await Taxpayer.find({
    bluebook_number: `${bluebook_number}`,
  });

  if (fetchTaxpayer[0] !== undefined) {
    const registeredDate = `${fetchTaxpayer[0].registered_date}`;
    const registeredMonth = convertMonthNumeric(registeredDate.split(' ')[1]);
    const registeredDay = registeredDate.split(' ')[2];
    const registeredYear = registeredDate.split(' ')[3];

    console.log(`${registeredYear}, ${registeredMonth}, ${registeredDay}`);

    const taxDetails = calculateTax(registeredMonth, registeredDay);

    const newTaxRecords = new taxRecord({
      bluebook_number: bluebook_number,
      paidYear: 2018,
      paidMonth: registeredMonth,
      paidDate: registeredDay,
      taxAmount: `${taxDetails.chargeableTax}`,
      taxOverdue: `${taxDetails.fineForYears}`,
      penaltyOnOverdue: `${taxDetails.fine}`,
      pollutingCharge: 0,
    });
    const recordInsertedObj = await newTaxRecords.save();

    console.log(fetchTaxpayer[0]);
    const taxpayerObj = { ...fetchTaxpayer[0] };
    const taxpayerData = taxpayerObj._doc;
    const recordInserted = recordInsertedObj._doc;

    res.status(200).send({ success: true, ...taxpayerData, ...recordInserted });
  }
});

router.route('/').post(fetchTaxpayerDetails);

module.exports = router;
