'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {
  if (options.impact) {
    Model.validate("impact", function(err) {
      if (this.impact && artifactConstants.RISK_IMPACT_TYPES.indexOf(this.impact) < 0) {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_MUST_IN,
          'Risk\'s impact',
          artifactConstants.RISK_IMPACT_TYPES
        ));
        return err();
      }
      return;
    });
  }

  if (options.probability) {
    Model.validate("probability", function(err) {
      if (this.probability && artifactConstants.RISK_PROBABILITY_TYPES.indexOf(this.probability) < 0) {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_MUST_IN,
          'Risk\'s probability',
          artifactConstants.RISK_PROBABILITY_TYPES
        ));
        return err();
      }
      return;
    });
  }
}