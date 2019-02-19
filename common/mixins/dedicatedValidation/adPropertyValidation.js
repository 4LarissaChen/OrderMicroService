'use strict';
var regexConstants = require('../../../server/constants/regexConstants.js');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {
  Model.validatesInclusionOf('status', {
    in: artifactConstants.AD_STATUS_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'AD Status type',
      artifactConstants.AD_STATUS_TYPES
    )
  });
};
