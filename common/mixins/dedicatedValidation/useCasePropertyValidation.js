'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');
var arrayUtils = require('../../../server/utils/arrayUtils.js');


module.exports = function (Model, options) {
  if (!options || !options.propertyName || !options.maxLength) {
    return;
  }
  var properties;
  if (options.propertyName instanceof Array) {
    properties = options.propertyName;
  } else {
    properties = [options.propertyName];
  }
  for (var idx = 0; idx < properties.length; idx++) {
    const prop = properties[idx];
    Model.validatesLengthOf(prop, {
      max: options.maxLength, message: {
        max: nodeUtil.format(
          apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH,
          prop, options.maxLength
        )
      }
    });
  }
}
