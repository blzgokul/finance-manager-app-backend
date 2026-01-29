const mongoose = require("mongoose");
const Expense = require("../models/Expense");

mongoose.connect("mongodb://127.0.0.1:27017/finance-manager");

async function normalizeCategories() {
  const expenses = await Expense.find();

  for (let exp of expenses) {
    exp.category = exp.category.trim().toLowerCase();
    await exp.save();
  }

  console.log("✅ Expense categories normalized");
  process.exit();
}

normalizeCategories();