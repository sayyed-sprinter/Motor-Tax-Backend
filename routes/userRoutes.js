const express = require('express');
const asyncHandler = require('express-async-handler');

const User  = require('../models/userModel');

const router = express.Router();

const registerUser = asyncHandler(async (req, res) => {
    try {
      const {
        full_name,
        email,
        citizenship_number,
        bluebook_number,
        vehicle_number,
        citizenship_file_path,
        bluebook_file_path,
      } = req.body;
    
      const userExists = await User.findOne({ bluebook_number });
  
      if (userExists) {
        res.status(401);
        throw new Error(`${bluebook_number } User already exists`);
      }

      const user = await User.create({
        full_name,
        email,
        citizenship_number,
        bluebook_number,
        vehicle_number,
        docs: [{ citizenship_file_path,bluebook_file_path}],
      });
  
      if (user) {
        res.status(201).json({
          success: true,
          userProfile: {
            _id: user.id,
            full_name: user.full_name,
            email: user.email,
            citizenship_number: user.citizenship_number,
            bluebook_number: user.bluebook_number,
            vehicle_number: user.vehicle_number,
          },
        });
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error(error);
    }
  });


router.route('/').post(registerUser);

module.exports = router;
