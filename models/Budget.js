const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      required: true,
      enum: ["Monthly", "Yearly"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
