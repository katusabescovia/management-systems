const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  source: String,
  amount: Number,
  date: Date,
  notes: String,
});

module.exports = mongoose.model('Income', incomeSchema);
