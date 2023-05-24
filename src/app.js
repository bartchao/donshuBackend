const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
require("winston-daily-rotate-file");
const limiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 30 sec
  max: 1000 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
const { checkAPIkey } = require("./middleware/");
const indexRouter = require("./routes/index");
const publicRouter = require("./routes/public");
const privateRouter = require("./routes/private");

const errorLogTransport = new winston.transports.DailyRotateFile({
  dirname: path.join(__dirname, "../log"),
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error"
});
const logger = winston.createLogger({
  // 當 transport 不指定 level 時 , 使用 info 等級
  level: "info",
  // 設定輸出格式
  format: winston.format.json(),
  // 設定此 logger 的日誌輸出器
  transports: [
    // 只有 error 等級的錯誤 , 才會將訊息寫到 error.log 檔案中
    errorLogTransport
  ]
});

// 在開發模式時 , 將 log 訊息多輸出到 console 中
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    // simple 格式 : `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    format: winston.format.simple()
  }));
}


const app = express();

app.enable("trust proxy");
// app.use(logger("common", { stream: accessLogStream }));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(helmet());
app.use(cors());

app.use("/", indexRouter);
app.use(checkAPIkey);
app.use("/public", publicRouter);
app.use("/private", privateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
