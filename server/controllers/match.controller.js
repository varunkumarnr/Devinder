const Match = require("../models/Match");
const User = require("../models/user");

const acceptMatchReq = async (req, res) => {
  const profile = req.params.id;
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
        msg: ` You have mached with ${profile.username} successfully`
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { acceptMatchReq };
