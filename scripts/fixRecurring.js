const mongoose = require("mongoose");
const Expense = require("../models/Expense");

mongoose.connect("mongodb://127.0.0.1:27017/finance-manager");

async function fixRecurring() {
  const expenses = await Expense.updateMany(
    { category: "rent" }, // or any condition you want
    {
      $set: {
        isRecurring: true,
        frequency: "monthly",
      },
    }
  );

  console.log("Recurring expenses fixed");
  process.exit();
}

fixRecurring();