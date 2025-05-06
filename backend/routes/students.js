const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
// const authMiddleware = require("../middleware/authMiddleware.js/index.js"); // To protect these routes
const {
  createStudentValidation,
  updateStudentValidation,
} = require("../utils/studentValidation");
const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
};

// Middleware to ensure user is authenticated for all student routes
// router.use(authMiddleware);

// Get all students
router.get("/", studentController.getAllStudents);

// Create a new student
router.post(
  "/",
  createStudentValidation,
  validate,
  studentController.createStudent,
);

// Get a specific student by ID
router.get("/:id", studentController.getStudentById);

// Update a specific student by ID
router.put(
  "/:id",
  updateStudentValidation,
  validate,
  studentController.updateStudent,
);

// Delete a specific student by ID
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
