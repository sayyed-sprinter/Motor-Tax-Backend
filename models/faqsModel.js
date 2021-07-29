const mongoose = require('mongoose');

const faqsSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const FAQs = mongoose.model('faqs', faqsSchema);

module.exports = FAQs;
