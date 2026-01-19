const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  expenseSummary,
  incomeVsExpense,
  exportExpensesCSV,
  exportExpensesPDF
} = require("../controllers/reportController");

router.get("/expenses/summary", auth, expenseSummary);
router.get("/income-vs-expense", auth, incomeVsExpense);
router.get("/expenses/csv", auth, exportExpensesCSV);
router.get("/expenses/pdf", auth, exportExpensesPDF);

module.exports = router;
