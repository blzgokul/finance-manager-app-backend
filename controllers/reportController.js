const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { Parser } = require("json2csv");

/* =====================================================
   EXPENSE SUMMARY REPORT (CATEGORY WISE)
===================================================== */
exports.expenseSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const report = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            $toLower: { $trim: { input: "$category" } }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(report);
  } catch (err) {
    console.error("Expense summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   INCOME vs EXPENSE REPORT
===================================================== */
exports.incomeVsExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const income = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0
    });
  } catch (err) {
    console.error("Income vs Expense error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   EXPORT EXPENSES AS CSV
===================================================== */
exports.exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).lean();

    const parser = new Parser({
      fields: [
        "category",
        "amount",
        "description",
        "date",
        "isRecurring",
        "frequency"
      ]
    });

    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses-report.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ message: "CSV export failed" });
  }
};

/* =====================================================
   EXPORT EXPENSES AS PDF (STABLE – pdfkit)
===================================================== */
exports.exportExpensesPDF = async (req, res) => {
  try {
    const PDFDocument = require("pdfkit");
    const expenses = await Expense.find({ user: req.user.id });

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expenses.pdf"
    );

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Expense Report", { align: "center" });
    doc.moveDown();

    // Header
    doc.fontSize(12).text("Category | Amount | Description | Date | Type");
    doc.moveDown(0.5);
    doc.text("------------------------------------------------------------");

    // Rows
    expenses.forEach(e => {
      doc.moveDown(0.5);
      doc.text(
        `${e.category} | ₹${e.amount} | ${e.description || "-"} | ${
          new Date(e.date).toLocaleDateString()
        } | ${e.isRecurring ? e.frequency : "One-time"}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ message: "PDF export failed" });
  }
};