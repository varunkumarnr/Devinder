const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
  likerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
mongoose.model("likes", LikeSchema);
