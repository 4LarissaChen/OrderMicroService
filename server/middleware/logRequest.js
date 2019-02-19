var logger = require('winston');
var moment = require('moment');

module.exports = function() {
    return function logRequest(req, res, next) {
        logger.info('API Request %s %s Start in Time %s', req.method, req.url, moment().format("YYYY-MM-DD HH:mm:ss.sss"));
        // var requestStart = process.hrtime();
        res.once('finish', function() {
            logger.info('API Request %s %s Complete in Time %s', req.method, req.originalUrl, moment().format("YYYY-MM-DD HH:mm:ss.sss"));
            //var diff = process.hrtime(requestStart);
            //var ms = diff[0] * 1e3 + diff[1] * 1e-6;
            //logger.info('The request processing time is %d ms.', ms);
        });
        next();
    };
};