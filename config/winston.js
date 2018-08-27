var winston = require('winston');
var contextService = require('request-context');

 var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
    transports: [
        //new winston.transports.File(options.file),
        new winston.transports.Console( {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

var stream = {
    write: function(message, encoding) {
        this.mmlog(message);
    },
};

addContextData = function(key, value){
    this.getContext()[key] =  value;
}

getContext = function(){
    var context = contextService.get('request:context');
    if (!context){
        context = {};
        contextService.set('request:context', context);
    }
    return context;
}

log = function(data)
{
    var meta = this.getContext();
    data["appContext"] = meta;
    logger.log(data);
}

mmlog = function(message, level = 'info'){
    var meta = {"appContext": this.getContext()};
    //var meta = this.getContext();
    logger.log({level, message: message, meta});
}

module.exports = {
    mmlog,
    log,
    getContext,
    addContextData
};