// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const db = require("../config/db");
// const { validationResult } = require("express-validator");
// const { signupValidation, loginValidation } = require("../utils/validation.js");

// const JWT_SECRET = "4a509db054b8a3553ef2"; // Use environment variable in production

// const runValidations = async (validations, req) => {
//   await Promise.all(validations.map((validation) => validation.run(req)));
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     throw { status: 400, errors: errors.array() };
//   }
// };

// const authController = {
//   signup: async (req, res) => {
//     try {
//       await runValidations(signupValidation, req);

//       const { name, email, password } = req.body;

//       const [existingUser] = await db
//         .promise()
//         .query("SELECT * FROM users WHERE email = ?", [email]);

//       if (existingUser.length > 0) {
//         return res.status(409).json({ message: "Email is already taken" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       await db
//         .promise()
//         .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
//           name,
//           email,
//           hashedPassword,
//         ]);

//       res.status(201).json({ message: "User created successfully" });
//     } catch (error) {
//       if (error.status) {
//         return res.status(error.status).json({ errors: error.errors });
//       }
//       console.error("Signup error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       await runValidations(loginValidation, req);

//       const { email, password } = req.body;

//       const [users] = await db
//         .promise()
//         .query("SELECT * FROM users WHERE email = ?", [email]);

//       if (users.length === 0) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       const user = users[0];
//       const isPasswordValid = await bcrypt.compare(password, user.password);

//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       const token = jwt.sign(
//         { userId: user.id, email: user.email },
//         JWT_SECRET,
//         { expiresIn: "1h" },
//       );

//       res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//       if (error.status) {
//         return res.status(error.status).json({ errors: error.errors });
//       }
//       console.error("Login error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// module.exports = authController;
