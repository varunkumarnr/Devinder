const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

router.get("/like", (req, res) => {
  res.send("working");
});

module.exports = router;
