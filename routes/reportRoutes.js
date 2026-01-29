const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  expenseSummary,
  incomeVsExpense,
  exportExpensesCSV,
  exportExpensesPDF
} = require("../controllers/reportController");

/* =========================
   REPORT ROUTES
========================= */

// Expense summary (category-wise)
router.get("/expenses/summary", auth, expenseSummary);

// Income vs Expense
router.get("/income-vs-expense", auth, incomeVsExpense);

// Export expenses as CSV
router.get("/expenses/export/csv", auth, exportExpensesCSV);

// Export expenses as PDF
router.get("/expenses/export/pdf", auth, exportExpensesPDF);

module.exports = router;