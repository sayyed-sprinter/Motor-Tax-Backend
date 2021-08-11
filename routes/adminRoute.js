const express = require('express');
const asyncHandler = require('express-async-handler');
const admin = require('../models/AdminModel');

const router = express.Router();

const createAdminAccount = asyncHandler(async (req, res) => {
  const { firstname, lastname, contact, email, username, password } = req.body;

  const adminDetails = new admin({
    firstname,
    lastname,
    contact,
    email,
    username,
    password,
  });

  const adminCreated = await adminDetails.save();
  res.status(200).send({ success: true, adminCreated });
});

const loginAuthentication = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await admin.findOne({ $and: [{ email }, { password }] });

  if (adminUser) {
    res.status(200).send({ success: true, adminUser });
  } else {
    res
      .status(200)
      .send({ success: false, message: 'Invalid email or password!' });
  }
});

router.route('/signup').post(createAdminAccount);
router.route('/login').post(loginAuthentication);

module.exports = router;
