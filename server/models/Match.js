const mongoose = require("mongoose");
const MatchSchema = new mongoose.Schema({});
module.exports = mongoose.model("match", MatchSchema);
