const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
