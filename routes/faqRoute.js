const express = require('express');
const asyncHandler = require('express-async-handler');

const FAQ = require('../models/faqModel');

const router = express.Router();

const FAQs = asyncHandler(async (req, res) => {

    if (req.method === "POST") {
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
    }
    else if (req.method == "GET") {
        const getFAQs = await FAQ.find();
        try {
            res.status(200).send({ success: true, getFAQs: getFAQs });
        } catch (err) {
            console.log(`Error occured in /api/tax-faq/ get request: ${err}`);
            res.status(404).send({ success: false, message: err });
        }
    }
    else {
        res.status(404).send({ success: false, message: req.method + " is not allowed" });
    }
})

router.route('/').post(FAQs).get(FAQs);

module.exports = router;