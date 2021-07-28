const express = require('express');
const asyncHandler = require('express-async-handler');

const FAQ = require('../models/faqModel');

const router = express.Router();

const FAQs = asyncHandler(async (req, res) => {

   
        const {
            question,
            answer
        } = req.body;

        const faqs = new FAQ({
            question: question,
            answer: answer,
        });

        const faqsInserted = await faqs.save();
        res.status(200).
            send({ success: true, faqsInserted });

})

router.route('/').post(FAQs)

module.exports = router;