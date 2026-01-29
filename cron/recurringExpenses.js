const cron = require("node-cron");
const Expense = require("../models/Expense");

cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running recurring expense job");

  try {
    const today = new Date();

    const recurringExpenses = await Expense.find({
      isRecurring: true,
      nextRunDate: { $lte: today },
    });

    for (let exp of recurringExpenses) {
      const expenseDate = new Date(exp.nextRunDate);
      const nextRun = new Date(exp.nextRunDate);

      if (exp.frequency === "daily") nextRun.setDate(nextRun.getDate() + 1);
      if (exp.frequency === "weekly") nextRun.setDate(nextRun.getDate() + 7);
      if (exp.frequency === "monthly") nextRun.setMonth(nextRun.getMonth() + 1);
      if (exp.frequency === "yearly") nextRun.setFullYear(nextRun.getFullYear() + 1);

      await Expense.create({
        user: exp.user,
        category: exp.category,
        description: exp.description,
        amount: exp.amount,
        date: expenseDate,
        isRecurring: true,
        frequency: exp.frequency,
        nextRunDate: nextRun,
      });

      await Expense.findByIdAndUpdate(exp._id, {
        nextRunDate: nextRun,
      });
    }

    console.log("✅ Recurring expenses processed");
  } catch (error) {
    console.error("❌ Recurring cron error:", error);
  }
});