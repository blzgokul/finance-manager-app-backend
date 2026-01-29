const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} = require("../controllers/expenseController");

router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);
router.get("/summary/monthly", auth, getMonthlySummary);

module.exports = router;