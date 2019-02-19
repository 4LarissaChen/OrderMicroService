'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

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

  Model.validatesInclusionOf('type', {
    in: artifactConstants.CONNECTOR_TYPE_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'Connector type',
      artifactConstants.CONNECTOR_TYPE_TYPES
    )
  });


}
