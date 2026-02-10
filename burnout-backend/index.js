const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ActivityLog = require("./models/ActivityLog");
const categorize = require("./utils/categorizeActivity");
const generateDailySummary = require("./utils/generateDailySummary");
const generateLiveSummary = require("./utils/generateLiveSummary");

mongoose
  .connect("mongodb://localhost:27017/burnout")
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/ping", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.post("/log", async (req, res) => {
  try {
    const data = req.body;

    // Determine category
    const keyword = data.url || data.appName || "";
    data.category = categorize(keyword);

    const log = new ActivityLog(data);
    await log.save();

    console.log("Saved:", data);
    res.json({ status: "saved" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ status: "error" });
  }
});

app.get("/summary/:date", async (req, res) => {
  const date = req.params.date; // format: YYYY-MM-DD

  try {
    await generateDailySummary(date);
    res.json({ status: "summary_created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/live-summary", async (req, res) => {
  try {
    const summary = await generateLiveSummary();
    if (!summary) {
      return res.json({ message: "No activity recorded yet today" });
    }
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate live summary" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
