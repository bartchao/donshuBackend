
const { ValidationError } = require("express-validation");
const path = require("path");
const { createLogger, format,transports } = require("winston");
require('winston-daily-rotate-file');
const { combine, timestamp, label, prettyPrint } = format;
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


const errorLogTransport = new transports.DailyRotateFile({
  dirname: path.join(__dirname, "../../log"),
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
});
const logger = createLogger({
  format: combine(
    label({ label: "errHandler" }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    // 只有 error 等級的錯誤 , 才會將訊息寫到 error.log 檔案中
<<<<<<< HEAD
<<<<<<< HEAD
    new transports.File({ filename: path.join(__dirname, "../../log", "error.log"), level: "error" })
=======
    new transports.File({ filename: path.join(__dirname, "../../log", "error.log"), level: "error" }),
=======
    errorLogTransport,
>>>>>>> e17b66d (Install packages and fix some bugs)
    new transports.Console(),
>>>>>>> b7f355f (add docker env)
    // info or 以上的等級的訊息 , 將訊息寫入 combined.log 檔案中
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
