const mongoose = require("mongoose");
const DailySummary = require("./models/DailySummary");

mongoose
  .connect("mongodb://localhost:27017/burnout")
  .then(() => console.log("🟢 Connected to MongoDB"))
  .catch((err) => console.error("Mongo Error:", err));

function computeBurnoutLevel(summary) {
  let score = 0;

  // ----- HIGH RISK FACTORS -----
  if (summary.totalScreenTime >= 20000) score += 2;
  else if (summary.totalScreenTime >= 12000) score += 1;

  if (summary.workTime >= 10000) score += 2;
  else if (summary.workTime >= 6000) score += 1;

  if (summary.lateNightUsage >= 1200) score += 2;
  else if (summary.lateNightUsage > 0) score += 1;

  if (summary.taskSwitches >= 300) score += 2;
  else if (summary.taskSwitches >= 200) score += 1;

  if (summary.keystrokeIntensity >= 9) score += 2;
  else if (summary.keystrokeIntensity >= 6) score += 1;

  if (summary.mouseIntensity >= 100) score += 2;
  else if (summary.mouseIntensity >= 70) score += 1;

  if (summary.continuousSessionAvg >= 3000)
    score += 2; // 50 min
  else if (summary.continuousSessionAvg >= 1800) score += 1; // 30 min

  // ----- Final Label -----
  if (score >= 9) return "high";
  if (score >= 5) return "medium";
  return "low";
}

async function labelAllSummaries() {
  const summaries = await DailySummary.find({});

  for (const summary of summaries) {
    const burnout = computeBurnoutLevel(summary);

    await DailySummary.updateOne(
      { _id: summary._id },
      { $set: { burnoutLevel: burnout } },
    );

    console.log(`✔ Updated ${summary.date} → burnoutLevel: ${burnout}`);
  }

  console.log("\n🎉 All summaries updated!");
  mongoose.connection.close();
}

labelAllSummaries();
