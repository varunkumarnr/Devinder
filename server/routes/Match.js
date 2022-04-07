const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const auth = require("../middleware/auth");
// router.get("/match", (req, res) => {
//   res.send("match working");
// });
router.post("/:id", auth, matchController.acceptMatchReq);
module.exports = router;
