const express = require('express');

const taxpaid = require('../data/taxPaid.json');
const taxpayer = require('../data/taxpayer.json');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res
      .status(200)
      .send({ message: 'Taxpayer get method is called', data: taxpaid });
  })
  .post((req, res) => {
    res
      .status(200)
      .send({ message: 'Taxpayer POST method is called', data: taxpayer });
  });

module.exports = router;
