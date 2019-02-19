  'use strict';
var regexConstants = require('../../../server/constants/regexConstants.js');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {

  Model.validatesInclusionOf('priority', {
    in: artifactConstants.NFR_PRIORITY_SUPPORTED_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'NFR priority',
      artifactConstants.NFR_PRIORITY_SUPPORTED_TYPES
    )
  });
  Model.validatesInclusionOf('theme', {
    in: artifactConstants.NFR_THEME_SUPPORTED_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'NFR theme',
      artifactConstants.NFR_THEME_SUPPORTED_TYPES
    )
  });

}
