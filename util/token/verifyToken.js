const jwt = require("jsonwebtoken");
module.exports = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err)reject(err);
      else resolve(decoded);
    });
  });
};
