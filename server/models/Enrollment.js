const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: String,
  courseId: String
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);