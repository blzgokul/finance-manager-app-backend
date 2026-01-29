const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

/* =========================
   CREATE / UPDATE BUDGET
========================= */
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, period = "monthly" } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        category,
        period,
      },
      {
        amount, // ✅ STANDARDIZED
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Budget save failed" });
  }
};

/* =========================
   GET ALL BUDGETS (FOR LIST PAGE)
   ✅ THIS FIXES 404
========================= */
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(budgets); // ✅ ARRAY
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
};

/* =========================
   GET BUDGET STATUS (DASHBOARD)
========================= */
exports.getBudgetStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ user: userId });

    const result = [];

    for (const b of budgets) {
      let start, end;

      if (b.period === "monthly") {
        start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
      } else {
        start = new Date(new Date().getFullYear(), 0, 1);
        end = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
      }

      const spentAgg = await Expense.aggregate([
        {
          $match: {
            user: b.user,
            category: b.category,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const spent = spentAgg[0]?.total || 0;
      const remaining = b.amount - spent;

      result.push({
        _id: b._id,
        category: b.category,
        period: b.period,
        budget: b.amount,
        spent,
        remaining,
        exceeded: remaining < 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load budget status" });
  }
};

/* =========================
   UPDATE BUDGET AMOUNT
========================= */
exports.updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.amount = amount;
    await budget.save();

    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* =========================
   DELETE BUDGET
========================= */
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Budget deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};