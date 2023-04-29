const verifyToken = require("../util/token/verifyToken");

module.exports = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (typeof (bearerHeader) !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    const testPayload = {
      id: "25f24979-4167-4e0b-b602-0e6a527ce513",
      role: 0
    };
    req.user = testPayload;
    return next();
    /* verifyToken(req.token)
      .then(decoded => {
        const { payload } = decoded;
        const testPayload = {
          id: "30ddf50c-4c53-492d-ae27-6d8fcdce19a0"
        };
        req.user = testPayload;
        return next();
      })
      .catch(err => res.status(401).send(err)); */
  } else res.status(401).send({ sucess: false, message: "VerifyTokenExpiredFailed" });
};
