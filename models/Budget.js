const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    period: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
  },
  { timestamps: true }
);

/* 
  Prevent duplicate budgets for same:
  user + category + period
*/
budgetSchema.index(
  { user: 1, category: 1, period: 1 },
  { unique: true }
);

module.exports = mongoose.model("Budget", budgetSchema);