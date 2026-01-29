const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ==============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

app.get("/api/force-test", (req, res) => {
  res.send("FORCE TEST OK");
});
/* ==============================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ==============================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes")); // next step
app.use("/api/goals", require("./routes/goalRoutes"));   // future step
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


/* ==============================
   🔁 START RECURRING EXPENSE CRON
================================ */
require("./cron/recurringExpenses");

/* ==============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("🚀 Personal Finance Manager API is running");
});

/* ==============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});