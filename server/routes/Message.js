const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

router.get("/sendMessage", (req, res) => {
  res.send("working");
});

module.exports = router;
