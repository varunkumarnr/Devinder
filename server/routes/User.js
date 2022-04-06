const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userContoller = require("../controllers/user.controller");
const auth = require("../middleware/auth");
// router.get("/signup", (req, res) => {
//   res.send("working");
// });
router.post(
  "/signup",
  [
    check("username", "username is required")
      .not()
      .isEmpty(),
    check("username", "username should be minimum of 4 letters").isLength({
      min: 4
    }),
    check("username", "username should not be greater then 15 digits").isLength(
      {
        max: 15
      }
    ),
    check("username", "No spaces are allowed in the username").custom(
      value => !/\s/.test(value)
    ),
    check("email", "email is required").isEmail(),
    check("gender", "gender is required")
      .not()
      .isEmpty(),
    check("password", "please enter password of minimum 6 letters").isLength({
      min: 6
    })
  ],
  userContoller.signUp
);
router.post(
  "/login",
  [
    check("email", "email is required").isEmail(),
    check("password", "please enter password of minimum 6 letters").isLength({
      min: 6
    })
  ],
  userContoller.Login
);
router.get("/profile/:username", userContoller.getUser);
router.get("/me", auth, userContoller.me);
router.get("/profileid/:id", userContoller.getUserById);
router.post("/edit", auth, userContoller.EditProfile);
router.get("/logout", auth, userContoller.logout);
module.exports = router;
