'use strict';
var moment = require('moment');

exports.now = function() {
  return moment().format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
}