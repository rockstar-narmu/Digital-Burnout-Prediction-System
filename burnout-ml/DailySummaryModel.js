const mongoose = require("mongoose");

const DailySummarySchema = new mongoose.Schema({
  totalScreenTime: Number,
  workTime: Number,
  leisureTime: Number,
  socialTime: Number,
  gamingTime: Number,
  taskSwitches: Number,
  keystrokeIntensity: Number,
  mouseIntensity: Number,
  scrollIntensity: Number,
  lateNightUsage: Number,
  breakFrequency: Number,
  burnoutLevel: String,
});

module.exports = mongoose.model(
  "DailySummary",
  DailySummarySchema,
  "dailysummaries",
);
