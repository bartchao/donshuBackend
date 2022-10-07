const verifyToken = require("../util/token/verifyToken");

module.exports = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (typeof (bearerHeader) !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    verifyToken(req.token)
      .then(decoded => {
        const { payload } = decoded;
        req.user = payload;
        return next();
      })
      .catch(err => res.status(401).send(err));
  } else res.status(401).send({ sucess: false });
};
