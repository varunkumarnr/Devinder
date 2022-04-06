const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env.jwtsecret;
const { validationResult } = require("express-validator");
const User = require("../models/user");
/* 
Task: Sign Up 
Action: Post
*/
const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { username, email, password, gender, age } = req.body;
  let exisitingUser;
  try {
    exisitingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "signing up failed, please try again!" }]
    });
  }
  if (exisitingUser) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "username or email already exists" }]
    });
  }
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "signing up failed, please try again!" }]
    });
  }
  const profileImages = [
    "https://res.cloudinary.com/varunnrk/image/upload/v1649054544/DevInder/depositphotos_59095205-stock-illustration-businessman-profile-icon_xfv2qa.jpg",
    "https://res.cloudinary.com/varunnrk/image/upload/v1649054542/DevInder/depositphotos_59094961-stock-illustration-businesswoman-profile-icon_edse8k.jpg",
    "https://res.cloudinary.com/varunnrk/image/upload/v1649054516/DevInder/depositphotos_59094701-stock-illustration-businessman-profile-icon_ggqohr.jpg",
    "https://res.cloudinary.com/varunnrk/image/upload/v1649054466/DevInder/depositphotos_59094623-stock-illustration-female-avatar-woman_lgu8t5.jpg"
  ];

  let profilePicURL;
  const RandomNo = Math.floor(Math.random() * 4);
  if (gender == "male") {
    if (RandomNo <= 1) {
      profilePicURL = profileImages[0];
    } else {
      profilePicURL = profileImages[2];
    }
  } else {
    if (RandomNo <= 1) {
      profilePicURL = profileImages[1];
    } else {
      profilePicURL = profileImages[3];
    }
  }
  const createdUser = new User({
    username,
    email,
    password: hashedPassword,
    description: "Write something ..",
    gender,
    profle_picture: profilePicURL,
    Matches: [],
    likes: []
  });
  try {
    await createdUser.save();
    const payload = {
      user: {
        id: createdUser.id
      }
    };
    try {
      jwt.sign(payload, config, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "signing up failed, please try again!" }]
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "signing up failed, please try again!" }]
    });
  }
};
/* 
Task: Login 
Action: Post
*/
const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;
  let existinguser;
  try {
    existinguser = await User.findOne({ email: email });
    // console.log(existinguser);
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "signing in failed, please try again!" }]
    });
  }
  if (!existinguser) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "Email does not exist, Please signup" }]
    });
  }
  let validPassword;
  try {
    validPassword = await bcrypt.compare(password, existinguser.password);
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "signing in failed 1, please try again!" }]
    });
  }
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: "Invalid password, could not login" }]
    });
  }
  const payload = {
    user: {
      id: existinguser.id
    }
  };
  jwt.sign(payload, config, { expiresIn: 36000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
  existinguser.online = true;
  await existinguser.save();
};
/* 
Task: get User 
Action: Get User information of respctive Username
*/
const getUser = async (req, res) => {
  const username = req.params.username;
  if (req.query.skip === undefined) {
    let user;
    try {
      user = await User.findOne({ username: username }).select("-password");
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Server Error" }]
      });
    }
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: [{ msg: "User not found" }] });
    }

    return res.json({ success: true, data: user });
  }
};

/* 
Task: me 
Action: Get authenticated user profile
Auth: True
*/
const me = async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");
    if (!profile) {
      return res
        .status(400)
        .json({ success: false, errors: [{ msg: "user not authenticated" }] });
    }
    return res.json({ success: true, data: profile });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: "server error" }] });
  }
};
/* 
Task: get User 
Action: Get User information of respctive Id
*/
const getUserById = async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select("-password");
    if (!profile) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "no such users" }]
      });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: "server error" }] });
  }
};
/*
Task Edit profile
*/
const EditProfile = async (req, res) => {
  const {
    age,
    gender,
    city,
    country,
    interests,
    description,
    profle_picture,
    status
  } = req.body;
  const profileFields = {};
  profileFields.user = req.user.id;
  if (age) {
    profileFields.age = age;
  }
  if (gender) {
    profileFields.gender = gender;
  }
  if (city) {
    profileFields.city = city;
  }
  if (country) {
    profileFields.country = country;
  }
  if (interests) {
    profileFields.interests = interests
      .toString()
      .split(",")
      .map(interest => " " + interest.trim());
  }
  if (description) {
    profileFields.description = description;
  }
  if (status) {
    profileFields.status = status;
  }
  if (profle_picture) {
    profileFields.profle_picture = profle_picture;
  }
  try {
    let profile = await User.findById(req.user.id);
    if (profile) {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        profileFields
        // {
        //   age,
        //   gender,
        //   interests,
        //   city,
        //   country,
        //   description,
        //   profle_picture,
        //   status
        // }
      );
      await profile.save();
      return res.json({ msg: "Profile Updated Sucessfully" });
    }
  } catch (err) {
    console.log(err);
  }
};
/* 
Task: Logot
Action: Logout
*/
const logout = async (req, res) => {
  try {
    await User.findById(req.user.id).then(rUser => {
      rUser.online = false;
      rUser.save();
    });
    return res.status(200).json({ success: true, msg: "logged out" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: "server error" }] });
  }
};
module.exports = {
  signUp,
  Login,
  getUser,
  me,
  getUserById,
  EditProfile,
  logout
};
