const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

// Add income
router.post("/", auth, addIncome);

// Get incomes (with filters)
router.get("/", auth, getIncomes);

// Update income
router.put("/:id", auth, updateIncome);

// Delete income
router.delete("/:id", auth, deleteIncome);

module.exports = router;