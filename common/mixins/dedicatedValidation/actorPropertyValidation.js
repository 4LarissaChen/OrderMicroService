'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {

  Model.validatesInclusionOf('type', {
    in: artifactConstants.REUSED_ACTOR_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'Actor type',
      artifactConstants.REUSED_ACTOR_TYPES
    )
  });

}
