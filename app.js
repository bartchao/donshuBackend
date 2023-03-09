var createError = require('http-errors');
var express = require('express');
var cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');
var model = require('./db/model/');
var rateLimit = require("express-rate-limit");

var limiter = rateLimit({
	windowMs: 1 * 30 * 1000, // 30 sec
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
var {checkAPIkey} = require('./middleware/');
var indexRouter = require('./routes/index');
var publicRouter = require('./routes/public');
var privateRouter = require('./routes/private');

var fs = require('fs');
var rfs = require('rotating-file-stream');
var logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)  
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log',{
	interval: '1d', // rotate daily
	path: logDirectory,
	maxFiles: 30,
});

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.enable("trust proxy");
app.use(logger('common',{stream:accessLogStream},));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(cors());

app.use('/', indexRouter); 

app.use(checkAPIkey);

app.use('/public', publicRouter);
app.use('/private', privateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
