const express = require("express");
const router = express.Router();
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

// Create goal
router.post("/", createGoal);

// Get all goals
router.get("/", getGoals);

// Update goal
router.put("/:id", updateGoal);

// Delete goal
router.delete("/:id", deleteGoal);

module.exports = router;
