const Goal = require("../models/Goal");

/**
 * =========================
 * CREATE GOAL
 * =========================
 */
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res
        .status(400)
        .json({ message: "Title, target amount and deadline required" });
    }

    const goal = await Goal.create({
      user: req.user.id,
      title,
      targetAmount,
      deadline,
      savedAmount: 0,
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error("Create goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * GET ALL GOALS
 * =========================
 */
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(goals);
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * UPDATE GOAL
 * (Add money OR Edit details)
 * =========================
 */
exports.updateGoal = async (req, res) => {
  try {
    const {
      addAmount,
      savedAmount,
      title,
      targetAmount,
      deadline,
    } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    /* =========================
       ADD MONEY (INCREMENT)
    ========================== */
    if (addAmount !== undefined) {
      const inc = Number(addAmount);
      if (inc > 0) {
        goal.savedAmount += inc;
      }
    }

    /* =========================
       EDIT SAVED AMOUNT (DIRECT)
    ========================== */
    if (savedAmount !== undefined) {
      const direct = Number(savedAmount);
      if (direct >= 0) {
        goal.savedAmount = direct; // 🔑 THIS WAS MISSING
      }
    }

    /* =========================
       EDIT GOAL DETAILS
    ========================== */
    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (deadline !== undefined) goal.deadline = deadline;

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error("Update goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * =========================
 * DELETE GOAL
 * =========================
 */
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};