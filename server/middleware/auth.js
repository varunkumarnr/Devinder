const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env.jwtsecret;
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      errors: [{ msg: "No token, authorization denied" }]
    });
  }
  try {
    const decoded = jwt.verify(token, config);
    req.user = decoded.user;
    // console.log(decoded.user);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, errrors: [{ msg: "token is not valid" }] });
  }
};
