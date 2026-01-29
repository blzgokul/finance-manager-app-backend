const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // PROFILE PREFERENCES
    // =========================

    // Currency preference
    currency: {
      type: String,
      default: "INR", // INR | USD | EUR
    },

    // Enable / disable notifications
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // Preferred expense categories (optional, future use)
    preferredCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);