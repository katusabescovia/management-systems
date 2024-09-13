const Income = require('../models/incomeModel');

// Create a new income
exports.createIncome = async (req, res) => {
  const { source, amount, date, notes } = req.body;
  const income = new Income({ source, amount, date, notes });
  try {
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all incomes
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an income
exports.updateIncome = async (req, res) => {
  const { source, amount, date, notes } = req.body;
  try {
    const income = await Income.findByIdAndUpdate(
      req.params.id,
      { source, amount, date, notes },
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
