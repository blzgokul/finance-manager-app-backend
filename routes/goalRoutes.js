const express = require("express");
const router = express.Router();

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

// ✅ IMPORT AUTH MIDDLEWARE (THIS WAS MISSING)
const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   GOAL ROUTES
========================= */

// Create goal
router.post("/", authMiddleware, createGoal);

// Get all goals
router.get("/", authMiddleware, getGoals);

// Update goal (add money / edit)
router.put("/:id", authMiddleware, updateGoal);

// Delete goal
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;