const ActivityLog = require("../models/ActivityLog");
const DailySummary = require("../models/DailySummary");

const axios = require("axios");

// --- Burnout Label Function ---
function getBurnoutLevel(s) {
  let score = 0;

  // ==============================
  // 🔴 EXTREME OVERRIDE PROTECTION
  // ==============================

  const extremeScreen = s.totalScreenTime > 43200; // > 12 hours
  const extremeSwitching = s.taskSwitches > 1000;

  if (extremeScreen && extremeSwitching) {
    return "high";
  }

  if (extremeScreen || extremeSwitching) {
    score += 3; // strong penalty
  }

  // ==============================
  // 1️⃣ Duration Overload
  // ==============================

  if (s.totalScreenTime > 28800)
    score += 3; // > 8 hrs
  else if (s.totalScreenTime > 21600)
    score += 2; // > 6 hrs
  else if (s.totalScreenTime > 14400) score += 1; // > 4 hrs

  const workRatio = s.workTime / s.totalScreenTime;
  if (workRatio > 0.8) score += 2;
  else if (workRatio > 0.65) score += 1;

  if (s.lateNightUsage > 3600) score += 2;
  else if (s.lateNightUsage > 1200) score += 1;

  // ==============================
  // 2️⃣ Cognitive Fragmentation
  // ==============================

  if (s.taskSwitches > 600) score += 3;
  else if (s.taskSwitches > 350) score += 2;
  else if (s.taskSwitches > 200) score += 1;

  if (s.continuousSessionAvg > 3600) score += 2;
  else if (s.continuousSessionAvg > 2400) score += 1;

  // ==============================
  // 3️⃣ Behavioral Intensity
  // ==============================

  if (s.keystrokeIntensity > 10 || s.keystrokeIntensity < 2) score += 2;
  else if (s.keystrokeIntensity > 8 || s.keystrokeIntensity < 4) score += 1;

  if (s.mouseIntensity > 200 || s.mouseIntensity < 15) score += 2;
  else if (s.mouseIntensity > 120 || s.mouseIntensity < 30) score += 1;

  if (s.scrollIntensity > 15) score += 2;
  else if (s.scrollIntensity > 8) score += 1;

  // ==============================
  // 4️⃣ Recovery Pattern
  // ==============================

  if (s.breakFrequency < 1) score += 2;
  else if (s.breakFrequency < 2) score += 1;

  // ==============================
  // FINAL CLASSIFICATION
  // ==============================

  if (score >= 10) return "high";
  if (score >= 5) return "medium";
  return "low";
}

async function generateDailySummary(date) {
  const logs = await ActivityLog.find({
    timestamp: {
      $gte: new Date(`${date}T00:00:00`),
      $lte: new Date(`${date}T23:59:59`),
    },
  });

  if (logs.length === 0) {
    console.log("No logs for", date);
    return;
  }

  let totalScreenTime = logs.length * 10;

  let workTime = 0,
    leisureTime = 0,
    socialTime = 0,
    gamingTime = 0;

  let totalKeystrokes = 0,
    totalMouseMoves = 0,
    totalScrolls = 0,
    totalScrollDistance = 0;

  let taskSwitches = 0;
  let lastCategory = null;

  logs.forEach((log) => {
    totalKeystrokes += log.keystrokes || 0;
    totalMouseMoves += log.mouseMoves || 0;
    totalScrolls += log.scrolls || 0;
    totalScrollDistance += log.scrollDistance || 0;

    if (log.category === "work") workTime += 10;
    else if (log.category === "leisure") leisureTime += 10;
    else if (log.category === "social") socialTime += 10;
    else if (log.category === "gaming") gamingTime += 10;

    if (log.category !== lastCategory) {
      taskSwitches++;
      lastCategory = log.category;
    }
  });

  const summaryData = {
    date,
    totalScreenTime,
    continuousSessionAvg:
      taskSwitches > 0 ? totalScreenTime / taskSwitches : totalScreenTime,
    longestSession: Math.max(40, totalScreenTime / 4),
    breakFrequency: Math.floor(totalScreenTime / 3600),

    workTime,
    leisureTime,
    socialTime,
    gamingTime,

    taskSwitches,
    keystrokeIntensity: totalKeystrokes / logs.length,
    mouseIntensity: totalMouseMoves / logs.length,

    totalScrolls,
    scrollIntensity: totalScrolls / logs.length,
    avgScrollDistance: totalScrollDistance / logs.length,

    lateNightUsage: 0,
  };

  // 🔥 Auto-generate burnout label
  //summaryData.burnoutLevel = getBurnoutLevel(summaryData);

  const summary = new DailySummary(summaryData);
  await summary.save(); // ALWAYS SAVE

  const prediction = await getMLPrediction(summaryData);

  if (prediction) {
    summary.burnoutLevel = prediction;
    await summary.save();
  }

  console.log("Daily Summary Saved with ML label:", summary);
}

async function getMLPrediction(summaryData) {
  try {
    const response = await axios.post("http://localhost:8000/predict", {
      totalScreenTime: summaryData.totalScreenTime,
      workTime: summaryData.workTime,
      leisureTime: summaryData.leisureTime,
      socialTime: summaryData.socialTime,
      gamingTime: summaryData.gamingTime,
      taskSwitches: summaryData.taskSwitches,
      keystrokeIntensity: summaryData.keystrokeIntensity,
      mouseIntensity: summaryData.mouseIntensity,
      scrollIntensity: summaryData.scrollIntensity,
      lateNightUsage: summaryData.lateNightUsage,
      breakFrequency: summaryData.breakFrequency,
    });

    return response.data.burnoutLevel;
  } catch (error) {
    console.error("ML API Error:", error.message);
    return null;
  }
}

module.exports = generateDailySummary;
