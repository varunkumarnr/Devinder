const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const auth = require("../middleware/auth");
// router.get("/match", (req, res) => {
//   res.send("match working");
// });
router.post("/:id", auth, matchController.acceptMatchReq);
router.post("/unmatch/:id", auth, matchController.unMatch);
router.get("/", auth, matchController.getAllMatches);
module.exports = router;
