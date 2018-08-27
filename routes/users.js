var express = require('express');
var router = express.Router();
var winston = require('../config/winston');

/* GET users listing. */
router.get('/', function(req, res, next) {
    winston.addContextData("user", "alex@havre.de");
    winston.mmlog("user loaded");
    res.send('respond with a resource');
});

router.get('/error', function(req, res, next) {
    winston.addContextData("user", "alex@havre.de");
    throw {error};
});

module.exports = router;
