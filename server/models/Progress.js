const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  progress: Number   // 0 to 100
});

module.exports = mongoose.model("Progress", progressSchema);