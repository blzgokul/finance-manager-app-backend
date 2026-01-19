const Goal = require("../models/Goal");

// Create goal
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    const goal = await Goal.create({
      title,
      targetAmount,
      deadline,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
