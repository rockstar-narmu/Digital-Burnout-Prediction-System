const mongoose = require("mongoose");

const DailySummarySchema = new mongoose.Schema({
  date: String,

  totalScreenTime: Number,
  continuousSessionAvg: Number,
  longestSession: Number,
  breakFrequency: Number,

  workTime: Number,
  leisureTime: Number,
  socialTime: Number,
  gamingTime: Number,

  taskSwitches: Number,
  keystrokeIntensity: Number,
  mouseIntensity: Number,

  totalScrolls: Number,
  scrollIntensity: Number,
  avgScrollDistance: Number, // browser only

  lateNightUsage: Number,

  burnoutLevel: {
    type: String, // "low" | "medium" | "high"
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DailySummary", DailySummarySchema);
