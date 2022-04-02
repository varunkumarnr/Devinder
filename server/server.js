const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const userRoute = require("./routes/User");
const MatchRoute = require("./routes/Match");
const LikeRoute = require("./routes/Like");
const messageRoute = require("./routes/Message");
connectDB();
app.use(express.json({ extended: false }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/user", userRoute);
app.use("/api/match", MatchRoute);
app.use("/api/like", LikeRoute);

app.listen(port, () => {
  console.log(`app running successfully  ${port}`);
});
