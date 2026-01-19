const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");

/**
 * EXPENSE SUMMARY REPORT
 * Group expenses by category
 */
exports.expenseSummary = async (req, res) => {
  try {
    const report = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(report);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * INCOME vs EXPENSE REPORT
 */
exports.incomeVsExpense = async (req, res) => {
  try {
    const income = await Income.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * EXPORT EXPENSES AS CSV
 */
exports.exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).lean();

    const parser = new Parser({
      fields: ["amount", "category", "description", "date"]
    });

    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses-report.csv");
    res.send(csv);
  } catch {
    res.status(500).json({ message: "CSV export failed" });
  }
};

/**
 * EXPORT EXPENSES AS PDF
 */
exports.exportExpensesPDF = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    const fonts = {
      Roboto: {
        normal: "node_modules/pdfmake/fonts/Roboto-Regular.ttf"
      }
    };

    const printer = new PdfPrinter(fonts);

    const body = [
      ["Amount", "Category", "Description", "Date"],
      ...expenses.map(e => [
        e.amount,
        e.category,
        e.description || "-",
        e.date.toDateString()
      ])
    ];

    const docDefinition = {
      content: [
        { text: "Expense Report", style: "header" },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch {
    res.status(500).json({ message: "PDF export failed" });
  }
};
