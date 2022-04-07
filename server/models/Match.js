const mongoose = require("mongoose");
const MatchSchema = new mongoose.Schema({
  MatherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  MatheeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
module.exports = mongoose.model("match", MatchSchema);
