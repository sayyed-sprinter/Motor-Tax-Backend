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

const calculateTaxRate = (vehicleType, cc) => {
  let rate = 0;
  let type = vehicleType.toLowerCase();
  if (type == 'bike' && cc <= 125) {
    return (rate = 2500);
  }
  if (type == 'bike' && cc <= 150) {
    return (rate = 4000);
  }
  if (type == 'bike' && cc <= 250) {
    return (rate = 8000);
  }
  if (type == 'bike' && cc <= 400) {
    return (rate = 16000);
  }
  if (type == 'bike' && cc > 400) {
    return (rate = 30000);
  }

  if (type == 'car' && cc <= 1000) {
    return (rate = 21000);
  }
  if (type == 'car' && cc <= 1500) {
    return (rate = 23000);
  }
  if (type == 'car' && cc <= 2000) {
    return (rate = 25000);
  }
  if (type == 'car' && cc <= 2500) {
    return (rate = 38000);
  }
  if (type == 'car' && cc <= 2900) {
    return (rate = 45000);
  }
  if (type == 'car' && cc >= 2900) {
    return (rate = 60000);
  }
};

const calculateTax = (
  registeredMonth,
  registeredDay,
  rate = 2500,
  lastTaxPaidOn = 2015
) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  let taxDetails = {
    numOfYears: 1,
    chargeableTax: 0,
    fineForYears: 0,
    fine: 0,
  };

  // 1. Get last paid year and calculate the tax amount

  const numOfYears =
    currentYear - lastTaxPaidOn > 1 ? currentYear - lastTaxPaidOn : 1;

  const chargeableTax = parseInt(numOfYears) * rate;

  // Calculate Num of months
  const numOfMonths =
    currentMonth > registeredMonth
      ? currentMonth - registeredMonth
      : registeredMonth - currentMonth;
  const numOfDays =
    currentDay > registeredDay
      ? currentDay - registeredDay
      : registeredDay - currentDay;

  // console.log(
  //   `currentyear: ${currentYear}, Num of years: ${numOfYears} months: ${numOfMonths} days: ${numOfDays}`
  // );

  // 2. check if fine should be charged or not
  if (
    (numOfYears === 1 && numOfMonths > 3 && numOfDays > 0) ||
    numOfYears >= 2
  ) {
    // console.log('entered');
    const fineForYears = numOfYears - 1;
    const fine = (fineForYears * rate * 32) / 100;
    // console.log(
    //   `Chargebale tax = ${chargeableTax}, fine for years = ${fineForYears} and fine = ${fine}`
    // );
    // console.log(`whats chargeableTax2: ${chargeableTax}`);
    taxDetails = {
      numOfYears: numOfYears,
      chargeableTax: chargeableTax,
      fineForYears: fineForYears,
      fine: fine,
    };
  } else {
    taxDetails = {
      numOfYears: numOfYears,
      chargeableTax: chargeableTax,
      fineForYears: 0,
      fine: 0,
    };
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

  // console.log(`fetchLastTaxPaidYear is ${fetchLastTaxPaidYear}`);

  const lastTaxPaidYear = `${fetchLastTaxPaidYear.createdAt}`.split(' ')[3];
  const lastTaxPaidMonth = `${fetchLastTaxPaidYear.createdAt}`.split(' ')[1];
  const lastTaxPaidDay = `${fetchLastTaxPaidYear.createdAt}`.split(' ')[2];

  const lastTaxPaidOn = `${lastTaxPaidYear}/${lastTaxPaidMonth}/${lastTaxPaidDay}`;

  const currDate = new Date().getFullYear();

  // console.log(`######### => ${fetchTaxpayer}, ${fetchTaxpayer[0]}`);

  if (fetchTaxpayer[0] != undefined) {
    if (currDate > lastTaxPaidYear) {
      const registeredDate = `${fetchTaxpayer[0].registered_date}`;
      const registeredMonth = convertMonthNumeric(registeredDate.split(' ')[1]);
      const registeredDay = registeredDate.split(' ')[2];
      const taxpayer_name = fetchTaxpayer[0].taxpayer_name;
      const type = `${fetchTaxpayer[0].type}`;
      const cc = `${fetchTaxpayer[0].engine_cc}`;

      // console.log(
      //   `${registeredYear}, ${registeredMonth}, ${registeredDay}, ${type}, ${cc}`
      // );

      const taxableRate = calculateTaxRate(type, cc);

      // console.log(taxableRate);

      const taxDetails = calculateTax(
        registeredMonth,
        registeredDay,
        taxableRate,
        lastTaxPaidYear
      );

      const newTaxRecords = new taxRecord({
        taxpayer: taxpayer_name,
        bluebook_number: bluebook_number,
        policy_number: policy_number,
        paidYear: currDate,
        paidMonth: registeredMonth,
        paidDate: registeredDay,
        taxAmount: `${taxDetails.chargeableTax}`,
        taxOverdue: `${taxDetails.fineForYears}`,
        penaltyOnOverdue: `${taxDetails.fine}`,
        pollutingCharge: 0,
        docs: [{ bluebook_file_path, citizenship_file_path, policy_file_path }],
      });
      const recordInsertedObj = await newTaxRecords.save();
      // console.log(`recordInsertedObj at line 200 ${recordInsertedObj}`);
      // console.log(fetchTaxpayer[0]);
      const taxpayerObj = { ...fetchTaxpayer[0] };
      const taxpayerData = taxpayerObj._doc;
      const recordInserted = recordInsertedObj._doc;

      res.status(200).send({
        success: true,
        ...taxpayerData,
        ...recordInserted,
        lastTaxPaidOn: lastTaxPaidOn,
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
});

// for taxpayer docs
const allTaxRecordDoc = asyncHandler(async (req, res) => {
  const allTaxRecordDocs = await taxRecord.find().sort({ createdAt: -1 });

  try {
    res.status(200).send({ success: true, allTaxRecordDocs: allTaxRecordDocs });
  } catch (err) {
    // console.log(`Error occured in /api/taxpayer/ get request: ${err}`);
    res.status(404).send({ success: false, message: err });
  }
});

//to update tax payer document verification information
const updateTaxpayer = asyncHandler(async (req, res) => {
  const taxpayer = await taxRecord.findById(req.params.id);

  if (taxpayer) {
    taxpayer.verified = req.body.verified || false;
    taxpayer.adminComment = req.body.adminComment || '';
    const updatedTaxpayer = await taxpayer.save();
    res.status(200).send({
      success: true,
      message: 'Taxpayer documents verified!',
      updatedTaxpayer: updatedTaxpayer,
    });
  } else {
    res.status(200).send({ success: true, message: 'Record not found' });
  }
});

const createTaxpayerAccount = asyncHandler(async (req, res) => {
  const {
    taxpayer_name,
    bluebook_number,
    vehicle_number,
    policy_number,
    lastTaxPaidDate,
    taxAmount,
    province,
    lot,
    type,
    engine_cc,
    registered_date,
    contact,
    email,
    username,
    password,
    bluebook_file_path,
    citizenship_file_path,
    policy_file_path,
  } = req.body;

  const taxpayerSignupDetails = new Taxpayer({
    taxpayer_name,
    bluebook_number,
    vehicle_number,
    province,
    lot,
    type,
    engine_cc,
    registered_date,
    contact,
    email,
    username,
    password,
  });

  const taxpayerRecordWithSignupDetails = new taxRecord({
    taxpayer: taxpayer_name,
    bluebook_number,
    policy_number,
    paidYear: `${lastTaxPaidDate.split('-')[0]}`,
    paidMonth: `${lastTaxPaidDate.split('-')[1]}`,
    paidDate: `${lastTaxPaidDate.split('-')[2]}`,
    taxAmount,
    taxOverdue: '0',
    penaltyOnOverdue: 0,
    pollutingCharge: 0,
    docs: [{ bluebook_file_path, citizenship_file_path, policy_file_path }],
    createdAt: `${lastTaxPaidDate.split('-')[0]}-${
      lastTaxPaidDate.split('-')[1]
    }-${lastTaxPaidDate.split('-')[2]}`,
  });

  const taxpayerCreated = await taxpayerSignupDetails.save();
  const taxpayerRecordCreated = await taxpayerRecordWithSignupDetails.save();
  res
    .status(200)
    .send({ success: true, taxpayerCreated, taxpayerRecordCreated });
});

const loginAuthentication = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const taxpayer = await Taxpayer.findOne({ $and: [{ email }, { password }] });

  if (taxpayer) {
    res.status(200).send({ success: true, taxpayer });
  } else {
    res
      .status(404)
      .send({ success: false, message: 'Invalid email or password!' });
  }
});

const deleteTaxpayer = asyncHandler(async (req, res) => {
  const taxpayer = await Taxpayer.findById(req.params.id);

  if (taxpayer) {
    await taxpayer.deleteOne({});
    res.status(200).json({
      success: true,
      message: 'Taxpayer deleted successfully',
    });
  } else {
    res.status(404).send({ success: false, message: 'Taxpayer not found!' });
  }
});

router.route('/').post(fetchTaxpayerDetails).get(allTaxRecordDoc);
router.route('/:id').put(updateTaxpayer).delete(deleteTaxpayer);
router.route('/signup').post(createTaxpayerAccount);
router.route('/login').post(loginAuthentication);

module.exports = router;
