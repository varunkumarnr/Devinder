const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app running successfully  ${port}`);
});