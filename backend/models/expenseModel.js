const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '' }, // Default empty string
});

module.exports = mongoose.model('Expense', expenseSchema);
