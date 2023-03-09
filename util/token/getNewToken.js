const jwt = require("jsonwebtoken");
module.exports = (payload) => {
  const expireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30d
  const token = jwt.sign({ payload, exp: expireTime }, process.env.TOKEN_KEY);
  return token;
};
