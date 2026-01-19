const Budget = require("../models/Budget");

// Create budget
exports.createBudget = async (req, res) => {
  try {
    const { category, limit, period } = req.body;

    const budget = await Budget.create({
      category,
      limit,
      period,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
