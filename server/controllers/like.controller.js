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
      likerId: userId,
      likeeId: profile
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

const getLikedProfiles = (req, res) => {};
module.exports = { LikePost, getLikedProfiles };
