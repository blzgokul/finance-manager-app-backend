const express = require("express");
const router = express.Router();

const {
  createBudget,
  getBudgets,        // ✅ ADD THIS
  getBudgetStatus,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

/* =========================
   BUDGET ROUTES
========================= */

/*
  POST   /api/budgets
  Create or update budget (category + period unique)
*/
router.post("/", protect, createBudget);

/*
  GET    /api/budgets
  Get all budgets (for BudgetList page)
*/
router.get("/", protect, getBudgets); // ✅ FIXES 404

/*
  GET    /api/budgets/status
  Get budget vs expense status (dashboard)
*/
router.get("/status", protect, getBudgetStatus);

/*
  PUT    /api/budgets/:id
  Update budget amount
*/
router.put("/:id", protect, updateBudget);

/*
  DELETE /api/budgets/:id
  Delete budget
*/
router.delete("/:id", protect, deleteBudget);

module.exports = router;