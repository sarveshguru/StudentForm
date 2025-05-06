// const { body } = require("express-validator");

// const signupValidation = [
//   body("name")
//     .notEmpty()
//     .withMessage("Name is required")
//     .matches(/^[a-zA-Z\s]{2,}$/)
//     .withMessage(
//       "Name must be at least 2 characters and only contain letters and spaces",
//     ),

//   body("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Invalid email format"),

//   body("password")
//     .notEmpty()
//     .withMessage("Password is required")
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
//     .withMessage(
//       "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
//     ),
// ];

// const loginValidation = [
//   body("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Invalid email format"),

//   body("password").notEmpty().withMessage("Password is required"),
// ];

// module.exports = { signupValidation, loginValidation };
