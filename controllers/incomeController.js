const Income = require("../models/Income");

// Add income
exports.addIncome = async (req, res) => {
  try {
    const { source, amount } = req.body;

    const income = await Income.create({
      source,
      amount,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all incomes
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
