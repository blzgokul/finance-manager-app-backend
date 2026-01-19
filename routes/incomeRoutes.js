const express = require("express");
const router = express.Router();
const {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

// Add income
router.post("/", addIncome);

// Get all incomes
router.get("/", getIncomes);

// Update income
router.put("/:id", updateIncome);

// Delete income
router.delete("/:id", deleteIncome);

module.exports = router;
