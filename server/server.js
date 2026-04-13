const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");
const Progress = require("./models/Progress");

const app = express();

app.use(express.json());
app.use(cors());

const SECRET = "secret";

// ================= DB =================
mongoose.connect("mongodb://127.0.0.1:27017/lms")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// ================= AUTH =================
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token ❌" });

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token ❌" });
  }
};

// ================= ADMIN =================
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only ❌" });
  }
  next();
};

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    role: req.body.role || "student"
  });

  await user.save();
  res.json({ message: "Registered ✅" });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.json({ message: "User not found ❌" });

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.json({ message: "Wrong password ❌" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
});

// ================= USERS =================
app.get("/users", auth, async (req, res) => {
  res.json(await User.find().select("-password"));
});

// ================= SINGLE USER PROFILE =================
app.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ================= COURSES =================
app.get("/courses", async (req, res) => {
  res.json(await Course.find());
});

// ================= ADD COURSE =================
app.post("/course", auth, isAdmin, async (req, res) => {
  await new Course(req.body).save();
  res.json({ message: "Course Added ✅" });
});

// ================= DELETE COURSE =================
app.delete("/course/:id", auth, isAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course Deleted ✅" });
});

// ================= ENROLL (WITH CHECK) =================
app.post("/enroll", auth, async (req, res) => {
  const { courseId } = req.body;

  const existing = await Enrollment.findOne({
    userId: req.user.id,
    courseId
  });

  if (existing) {
    return res.json({ message: "Already enrolled ❌" });
  }

  await new Enrollment({
    userId: req.user.id,
    courseId
  }).save();

  res.json({ message: "Enrolled ✅" });
});

// ================= PROGRESS UPDATE =================
app.post("/progress", auth, async (req, res) => {
  const { courseId, progress } = req.body;

  let prog = await Progress.findOne({
    userId: req.user.id,
    courseId
  });

  if (!prog) {
    prog = new Progress({
      userId: req.user.id,
      courseId,
      progress
    });
  } else {
    prog.progress = progress;
  }

  await prog.save();

  res.json({ message: "Progress Updated ✅" });
});

// ================= DASHBOARD =================
app.get("/dashboard", auth, async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user.id });

  const result = [];

  for (let e of enrollments) {
    const course = await Course.findById(e.courseId);
    const prog = await Progress.findOne({
      userId: req.user.id,
      courseId: e.courseId
    });

    result.push({
      course,
      progress: prog ? prog.progress : 0
    });
  }

  res.json(result);
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("🔥 Server running on 5000");
});