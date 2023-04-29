
const { ValidationError } = require("express-validation");

const NotFoundError = class NotFoundError extends Error {
  statusCode = 404;
  message = "Resource Not found";
};
const ForbiddenError = class ForbiddenError extends Error {
  statusCode = 403;
  message = "Forbidden";
};
const ResourceNotFounndError = class ResourceNotFounndError extends Error {
  statusCode = 409;
  message = "Resource Not Found";
};
const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    label({ label: "errHandler" }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    // 只有 error 等級的錯誤 , 才會將訊息寫到 error.log 檔案中
    new transports.File({ filename: path.join(__dirname, "../../log", "error.log"), level: "error" }),
    // info or 以上的等級的訊息 , 將訊息寫入 combined.log 檔案中
    new transports.Console({ level: "error" })
  ]
});

module.exports.errHandler = (error, res) => {
  if (error instanceof NotFoundError) {
    res.status(error.statusCode).send({ Error: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(error.statusCode).send({ Error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(error.statusCode).send(error);
  } else {
    res.status(500).send({ Error: "Internal Server Error" });
  }
  const { user, originalUrl } = res.req;
  const errorLog = {
    url: originalUrl,
    user: user === undefined ? "Public" : user.id,
    body: res.req.body,
    error
  };
  logger.error(errorLog);
};
module.exports.NotFoundError = NotFoundError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.ResourceNotFounndError = ResourceNotFounndError;
