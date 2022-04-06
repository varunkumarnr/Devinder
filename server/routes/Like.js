const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const likeController = require("../controllers/like.controller");
const auth = require("../middleware/auth");
// router.get("/like", (req, res) => {
//   res.send("working");
// });
router.post("/:id", auth, likeController.LikePost);

module.exports = router;
