'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {

  Model.validatesInclusionOf('type', {
    in: artifactConstants.CM_STATIC_TYPE_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'CMStaticView type',
      artifactConstants.CM_STATIC_TYPE_TYPES
    )
  });

}
