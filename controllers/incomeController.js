const Income = require("../models/Income");

/**
 * ADD INCOME
 */
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Source, amount and date are required" });
    }

    const income = await Income.create({
      user: req.user.id,
      source,
      amount,
      date,
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET INCOMES (WITH FILTERS ✅)
 */
exports.getIncomes = async (req, res) => {
  try {
    const { source, startDate, endDate } = req.query;

    const query = {
      user: req.user.id,
    };

    // filter by source
    if (source) {
      query.source = source;
    }

    // filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const incomes = await Income.find(query).sort({ date: -1 });

    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE INCOME
 */
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE INCOME
 */
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Income deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};