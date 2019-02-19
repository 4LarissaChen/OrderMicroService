'use strict';
var regexConstants = require('../../../server/constants/regexConstants.js');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {

  // change impact in fr to text and optional
  // Model.validatesInclusionOf('impact', {
  //   in: artifactConstants.FR_IMPACT_TYPES,
  //   message: nodeUtil.format(
  //     apiConstants.ERROR_STACK_MUST_IN,
  //     'FR impact',
  //     artifactConstants.FR_IMPACT_TYPES
  //   )
  // });
  Model.validate('weight', function(err) {
    if (!this.weight) return;
    if (artifactConstants.FR_WEIGHTING_TYPES.indexOf(this.weight) == -1)
      return err();
  }, {
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'FR weight',
      artifactConstants.FR_WEIGHTING_TYPES
    )
  });
}
