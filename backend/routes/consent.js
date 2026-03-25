const express = require("express");
const router = express.Router();

router.post("/consent", (req, res) => {
  res.json({ message: "Consent route working" });
});

module.exports = router;