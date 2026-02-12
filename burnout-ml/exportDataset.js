const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const DailySummary = require("./DailySummaryModel");

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/burnout");
  console.log("MongoDB Connected");
}

async function exportDataset() {
  const summaries = await DailySummary.find();

  if (!summaries.length) {
    console.log("No data found.");
    return;
  }

  const headers = [
    "totalScreenTime",
    "workTime",
    "leisureTime",
    "socialTime",
    "gamingTime",
    "taskSwitches",
    "keystrokeIntensity",
    "mouseIntensity",
    "scrollIntensity",
    "lateNightUsage",
    "breakFrequency",
    "burnoutLevel",
  ];

  const rows = summaries.map((s) => {
    return [
      s.totalScreenTime,
      s.workTime,
      s.leisureTime,
      s.socialTime,
      s.gamingTime,
      s.taskSwitches,
      s.keystrokeIntensity,
      s.mouseIntensity,
      s.scrollIntensity,
      s.lateNightUsage,
      s.breakFrequency,
      labelEncode(s.burnoutLevel),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  const outputPath = path.join(__dirname, "burnout_dataset.csv");
  fs.writeFileSync(outputPath, csvContent);

  console.log("Dataset exported successfully!");
  process.exit();
}

function labelEncode(label) {
  if (label === "low") return 0;
  if (label === "medium") return 1;
  if (label === "high") return 2;
  return 0;
}

(async () => {
  try {
    await connectDB();
    await exportDataset();
  } catch (err) {
    console.error("Error:", err);
  }
})();
