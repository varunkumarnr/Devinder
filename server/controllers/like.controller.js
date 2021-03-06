const Like = require("../models/like");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const LikePost = async (req, res) => {
  const profile = await User.findById(req.params.id);
  if (!profile) {
    return res.status(500).json({
      success: false,
      errors: [{ msg: "No such profile" }]
    });
  }

  const userId = await User.findById(req.user.id);
  const alreadyLiked = await Like.findOne({
    likerId: userId,
    likeeId: profile
  });
  if (alreadyLiked) {
    try {
      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user.id }
        },
        {
          new: true
        }
      );
    } catch (err) {}
    if (userId.Matches.includes(req.params.id)) {
      return res.status(200).json({
        msg: `you are already Matched with ${profile.username}`
      });
    }
    await Like.findOneAndDelete({
      likerId: req.user.id,
      likeeId: req.params.id
    }).exec();
    return res.status(200).json({
      msg: `${profile.username} as been removed from your liked profiles`
    });
  }
  const like = new Like({
    likerId: userId,
    likeeId: profile
  });
  try {
    await like.save();
    User.findById(req.params.id).then(rUser => {
      rUser.likes.push(req.user.id);
      rUser.save();
    });
    return res
      .status(200)
      .json({ msg: ` match request has been sent to ${profile.username}` });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: [{ msg: "Internal error! failed to send Match req" }]
    });
  }
};

const getAllLikedProfiles = async (req, res) => {
  let userId = req.user.id;
  let userProfile = await User.findById(userId);
  if (!userProfile) {
    return res.status(500).json({ msg: "user not autheticated" });
  }
  try {
    const currentUser = await User.findById(userId).populate(
      "Matches",
      "username profle_picture age gender interests"
    );
    const data = currentUser.likes;
    return data;
  } catch (err) {
    console.log(err.message);
    return res.json(err.message);
  }
};
module.exports = { LikePost, getAllLikedProfiles };
