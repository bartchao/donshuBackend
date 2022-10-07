const jwt = require("jsonwebtoken");
const dateBetween = require("../util/dateBetween");
const verifyToken = require("../util/token/verifyToken");
const getNewToken = require("../util/token/getNewToken");

function isOutofResetTime (token) {
  const decoded = jwt.decode(token);
  const iat = new Date(decoded.iat * 1000).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  const diff = dateBetween(iat, now);
  const result = (diff >= 14);
  return result;
}

module.exports = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  console.log("object");
  console.log(bearerHeader);
  if (typeof (bearerHeader) !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    verifyToken(req.token)
      .then(decoded => {
        const { payload } = decoded;
        if (isOutofResetTime(req.token))req.token = getNewToken(payload);
        const response = {
          success: true,
          token: req.token
        };
        res.status(200).send(response);
      })
      .catch(err => {
        console.error(err);
        res.status(401).send(Object.assign({ code: 401 }, err));
      });
  } else res.status(403).send(Object.assign({ code: 403 }, { sucess: false }));
};
