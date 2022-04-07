const Match = require("../models/Match");
const User = require("../models/user");
const Like = require("../models/like");
const acceptMatchReq = async (req, res) => {
  const profile = req.params.id;
  const CurrentProfile = User.findById(profile);
  if (!profile) {
    return res.status(500).json({
      success: false,
      errors: [{ msg: "No such profile" }]
    });
  }
  const userId = req.user.id;
  // check if requested id is requested for matching
  // delete it from reqests
  // add to match profile

  const currentProfile = await User.findOne({ _id: userId });
  if (currentProfile.Matches.includes(req.params.id)) {
    return res.status(200).json({
      msg: `you are already Matched with ${currentProfile.username}`
    });
  }
  try {
    const check = await User.findOne({ _id: userId });
    if (check.likes.includes(profile)) {
      User.findById(userId).then(rUser => {
        rUser.Matches.push(profile);
        rUser.save();
      });
      User.findById(profile).then(rUser => {
        rUser.Matches.push(userId);
        rUser.save();
      });
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { likes: profile }
        },
        {
          new: true
        }
      );
      const match = new Match({
        MatherId: userId,
        MatheeId: profile
      });
      await match.save();
      return res.status(200).json({
        msg: ` You have mached with ${CurrentProfile.username} successfully`
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const unMatch = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user.id;
  const Profile = await User.findOne({ _id: paramsId });
  const UserProfile = await User.findOne({ _id: userId });
  if (!Profile) {
    return res.status(500).json({
      success: false,
      msg: "no such profile"
    });
  }
  //check if user is already matched
  // remove from both matched profiles
  //remove from Match
  // remove from like
  if (
    Profile.Matches.includes(userId) &&
    UserProfile.Matches.includes(paramsId)
  ) {
    try {
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $pull: { Matches: paramsId }
        },
        {
          new: true
        }
      );
      await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $pull: { Matches: userId }
        },
        {
          new: true
        }
      );

      await Match.findOneAndDelete({
        MatherId: userId,
        MatheeId: paramsId
      }).exec();
      await Match.findOneAndDelete({
        MatherId: paramsId,
        MatheeId: userId
      }).exec();
      await Like.findOneAndDelete({
        likerId: UserProfile,
        likeeId: Profile
      }).exec();
      return res.json("unmatched");
    } catch (err) {
      console.log("error here");
      return res.json("fidn");
    }
  } else {
    return res.status(500).json({ msg: "Not Matched" });
  }
};
module.exports = { acceptMatchReq, unMatch };
