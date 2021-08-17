const express = require('express');
const asyncHandler = require('express-async-handler');
const admin = require('../models/adminModel');

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
      .status(404)
      .send({ success: false, message: 'Invalid email or password!' });
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const adminfetched = await admin.findById(req.params.id);

  if (adminfetched) {
    await adminfetched.deleteOne({});
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully!',
    });
  } else {
    res.status(404).send({ success: false, message: 'Admin not found!' });
  }
});

router.route('/:id').delete(deleteAdmin);
router.route('/signup').post(createAdminAccount);
router.route('/login').post(loginAuthentication);

module.exports = router;
