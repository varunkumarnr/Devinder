const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    required: true
  },
  city: { type: String },
  country: { type: String },
  interests: { type: String, default: "No description..." },
  lastActive: { type: Date },
  // channels: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Channel"
  //   }
  // ],
  description: {
    type: String
  },
  profle_picture: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "online"
  },

  Matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Match"
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like"
    }
  ],
  //   servers: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Server"
  //     }
  //   ],
  created_At: {
    type: Date,
    default: Date.now
  },
  online: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model("User", UserSchema);
