const express = require("express");
const router = express.Router();
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

// Create budget
router.post("/", createBudget);

// Get all budgets
router.get("/", getBudgets);

// Update budget
router.put("/:id", updateBudget);

// Delete budget
router.delete("/:id", deleteBudget);

module.exports = router;
