const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    date: { type: Date, default: Date.now },
    isRecurring: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
