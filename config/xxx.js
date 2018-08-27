var appRoot = require('app-root-path');
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



logger.stream = {
    write: function(message, encoding) {
        logger.mmlog(message);
    },
};

logger.addContextData = function(key, value){
    logger.getContext()[key] =  value;
}

logger.getContext = function(){
    // var context = contextService.get('request:context');
    // if (!context){
    //     context = {};
    //     contextService.set('request:context', context);
    // }
    // return context;
    return {
        "appContext": function(){
            var context = contextService.get('request:context');
            if (!context){
                context = {};
                contextService.set('request:context', context);
            }
            return context;}
    }
}

logger.log = function(data)
{
    var meta = logger.getContext();
    data.meta2 = meta;
    logger.log(data);
}


logger.mmlog = function(message, level = 'info'){
    //var meta = {"appContext": logger.getContext()};
    var meta = logger.getContext();
    //logger.log(level, message, meta);
    //logger.log(level, meta, message);
    logger.log({level, message: message, meta});

}



module.exports = logger;