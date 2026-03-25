const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

// 👉 Dummy Admin (replace with DB later)
const ADMIN = {
  email: "admin@gmail.com",
  password: "123456"
};

// ✅ LOGIN ROUTE
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN.email && password === ADMIN.password) {
    const token = jwt.sign(
      { role: "admin", email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
});

module.exports = router;