var logger = require('winston');
var moment = require('moment');

module.exports = function() {
    return function logError(err, req, res, next) {
        logger.error('ERR', req.url, err);
        logger.info('API Request %s %s Happen Error in Time %s', req.method, req.url, moment().format("YYYY-MM-DD HH:mm:ss.sss"));
        next(err);
    };
};