const path = require("path");
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label,prettyPrint  } = format;



const logger = createLogger({
  format: combine(
    label({ label: 'errHandler' }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    // 只有 error 等級的錯誤 , 才會將訊息寫到 error.log 檔案中
    new transports.File({ filename: path.join(__dirname,"log","error.log"), level: 'error' }),
    // info or 以上的等級的訊息 , 將訊息寫入 combined.log 檔案中
    new transports.Console({level:'error'})
  ],
});


module.exports = (err, res) => {
  let { message,stack } = err;
  let { user,originalUrl} = res.req;
  if (err.code == "ENOENT")message = "no such file or directory";
  const code = (message === "Forbbiden") ? 403 : 500;
  if(user === undefined){
    user="Public";
  }
  logger.error(user +"URL:"+ originalUrl);
  logger.error(message);
  logger.error(stack);

  res.status(code).send({ Error: message });
};
