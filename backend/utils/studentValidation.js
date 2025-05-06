const { body } = require("express-validator");

const createStudentValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces"),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be a valid number between 0 and 150"),

  body("course")
    .optional()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Course must contain only letters and spaces"),

  body("emailid")
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email format"),

  body("phoneno")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian mobile number"),

  body("address")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];

const updateStudentValidation = [
  body("name")
    .optional()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces"),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be a valid number between 0 and 150"),

  body("course")
    .optional()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Course must contain only letters and spaces"),

  body("emailid")
    .optional()
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email format"),

  body("phoneno")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian mobile number"),

  body("address")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];

module.exports = {
  createStudentValidation,
  updateStudentValidation,
};
