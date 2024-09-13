const Expense = require('../models/expenseModel');

// Create a new expense
exports.createExpense = async (req, res) => {
  const { category, amount, date, notes } = req.body;
  console.log('Request Body:', req.body); // Debugging line
  const expense = new Expense({ category, amount, date, notes });
  try {
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Save Error:', error); // Debugging line
    res.status(400).json({ message: error.message });
  }
};


// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { category, amount, date, notes } = req.body;
  console.log('Update Data:', { category, amount, date, notes }); // Debugging line
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, amount, date, notes },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    console.error('Update Error:', error); // Debugging line
    res.status(400).json({ message: error.message });
  }
};
