const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

router.get("/match", (req, res) => {
  res.send("match working");
});

module.exports = router;
