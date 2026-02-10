const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  source: String, // "browser" or "desktop"
  appName: String,
  url: String,

  keystrokes: Number,
  mouseMoves: Number,
  scrolls: Number,
  scrollDistance: Number,

  category: String, // <-- ADD THIS

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
