const ActivityLog = require("../models/ActivityLog");
const DailySummary = require("../models/DailySummary");

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

  const summary = new DailySummary({
    date,
    totalScreenTime,
    continuousSessionAvg: totalScreenTime / taskSwitches,
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
  });

  await summary.save();
  console.log("Daily Summary Saved:", summary);
}

module.exports = generateDailySummary;
