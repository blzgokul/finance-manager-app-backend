const Expense = require("../models/Expense");
const mongoose = require("mongoose");

/**
 * =====================================================
 * ADD EXPENSE (NORMAL + RECURRING)
 * =====================================================
 */
exports.addExpense = async (req, res) => {
  try {
    const {
      category,
      description,
      amount,
      date,
      isRecurring,
      frequency,
    } = req.body;

    // basic validation
    if (!category || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Category, amount and date are required" });
    }

    let nextRunDate = null;

    // 🔁 calculate next run date for recurring expense
    if (isRecurring && frequency) {
      const baseDate = new Date(date);

      switch (frequency) {
        case "daily":
          baseDate.setDate(baseDate.getDate() + 1);
          break;
        case "weekly":
          baseDate.setDate(baseDate.getDate() + 7);
          break;
        case "monthly":
          baseDate.setMonth(baseDate.getMonth() + 1);
          break;
        case "yearly":
          baseDate.setFullYear(baseDate.getFullYear() + 1);
          break;
        default:
          break;
      }

      nextRunDate = baseDate;
    }

    const expense = await Expense.create({
      user: req.user.id,
      category: category.trim().toLowerCase(), // ⭐ FIXED LINE
      description,
      amount,
      date,
      isRecurring: isRecurring || false,
      frequency: isRecurring ? frequency : null,
      nextRunDate,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * =====================================================
 * GET EXPENSES (WITH FILTERS)
 * ?category=
 * ?startDate=
 * ?endDate=
 * =====================================================
 */
exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const query = {
      user: req.user.id,
    };

    // filter by category
    if (category) {
      query.category = category;
    }

    // filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId), // ✅ FIX
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $toLower: {
              $trim: { input: "$category" },
            },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const total = summary.reduce((sum, item) => sum + item.total, 0);

    res.json({
      total,
      breakdown: summary,
    });
  } catch (err) {
    console.error("MONTHLY SUMMARY ERROR 👉", err);
    res.status(500).json({ message: "Summary failed" });
  }
};
/**
 * =====================================================
 * UPDATE EXPENSE
 * =====================================================
 */
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =====================================================
 * DELETE EXPENSE
 * =====================================================
 */
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};