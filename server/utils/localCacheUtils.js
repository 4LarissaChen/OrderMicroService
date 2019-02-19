'use strict';
var util = require('util');
var fs = require('fs');

global.localCache = {};

exports.getStaticData = function(jsonFileName) {
  var localCache = global.localCache;
  if(!localCache[jsonFileName]) {
    localCache[jsonFileName] = JSON.parse(fs.readFileSync(global.appRoot + '/common/models/data/architecture/node/' + jsonFileName + '.json'));
  }
  return localCache[jsonFileName];
};

exports.clearStaticDataCache = function() {
  global.localCache = {};
};
