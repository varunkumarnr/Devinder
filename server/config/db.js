const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      //   useCreateIndex: true,
      //   useFindAndModify: false
    });
    console.log("connected");
    return true;
  } catch (err) {
    console.log(err.message);
    process.exit(1);
    return false;
  }
};
module.exports = connectDB;
