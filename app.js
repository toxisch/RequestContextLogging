var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

//var morgan = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var winston = require('winston');
var logger = require('./config/winston');
var expressWinston = require('express-winston');

const contextService = require('request-context');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(contextService.middleware('request'));

//app.use(morgan('combined', { stream: winston.stream }));

app.use(expressWinston.logger({
    transports: [
        //new winston.transports.File(options.file),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        })
    ],
    winstonInstance: logger
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(expressWinston.errorLogger({
    transports: [
        //new winston.transports.File(options.file),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        })
    ],
    winstonInstance: logger
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    var modifiedBy = contextService.get('request:user');


    logger.addContextData("user", "alex@havre.de");
    logger.mmlog("kokokoko");

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
