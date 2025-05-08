🗃️ 1. MySQL Tables
users table:
sql
Copy
Edit
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
Modify your product table to track who added the product:
sql
Copy
Edit
ALTER TABLE product ADD COLUMN user_id INT;
📁 2. authController.js (Signup & Login)
js
Copy
Edit
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // Replace with env variable in production

const authController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ]);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Signup failed", error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length === 0) return res.status(404).json({ message: "User not found" });

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  },
};

module.exports = authController;
🔒 3. middleware/auth.js (JWT Protection)
js
Copy
Edit
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key"; // Same secret key

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer token
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded.id = user ID
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = auth;
🛍️ 4. Update productController.js (with user checks)
js
Copy
Edit
const db = require("../config/db");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const [products] = await db.query("SELECT * FROM product WHERE user_id = ?", [req.user.id]);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error });
    }
  },

  createProduct: async (req, res) => {
    const { productType, category, company, price } = req.body;
    if (!productType || !category || !company || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const [result] = await db.query(
        "INSERT INTO product (productType, category, company, price, user_id) VALUES (?, ?, ?, ?, ?)",
        [productType, category, company, price, req.user.id]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: "Failed to create product", error });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM product WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(rows[0]);
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { productType, category, company, price } = req.body;
    if (!productType || !category || !company || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await db.query("SELECT * FROM product WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (existing.length === 0) return res.status(403).json({ message: "Not authorized" });

    try {
      await db.query(
        "UPDATE product SET productType = ?, category = ?, company = ?, price = ? WHERE id = ? AND user_id = ?",
        [productType, category, company, price, id, req.user.id]
      );
      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update", error });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    const [existing] = await db.query("SELECT * FROM product WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (existing.length === 0) return res.status(403).json({ message: "Not authorized" });

    try {
      await db.query("DELETE FROM product WHERE id = ? AND user_id = ?", [id, req.user.id]);
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete", error });
    }
  },
};

module.exports = productController;
🔁 5. Routes Setup
routes/authRoutes.js
js
Copy
Edit
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
Update routes/productRoutes.js
js
Copy
Edit
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

router.use(auth); // All below routes are protected

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
