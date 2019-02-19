'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function (Model, options) {
  if (options.impact) {
    Model.validate("impact", function(err) {
      if (this.impact && artifactConstants.ASSUMPTION_IMPACT_TYPES.indexOf(this.impact) < 0) {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_MUST_IN,
          'Assumption\'s impact',
          artifactConstants.ASSUMPTION_IMPACT_TYPES
        ));
        return err();
      }
      return;
    });
  }

  if (options.confidenceLevel) {
    Model.validate("confidenceLevel", function(err) {
      if (this.confidenceLevel && artifactConstants.ASSUMPTION_CONFIDENCELEVEL_TYPES.indexOf(this.confidenceLevel) < 0) {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_MUST_IN,
          'Assumption\'s confidenceLevel',
          artifactConstants.ASSUMPTION_CONFIDENCELEVEL_TYPES
        ));
        return err();
      }
      return;
    });
  }
}