'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function (Model, options) {
  if (options.priority) {
    Model.validate("priority", function(err) {
      if (this.priority && artifactConstants.ISSUE_PRIORITY_TYPES.indexOf(this.priority) < 0) {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_MUST_IN,
          'Issue\'s priority',
          artifactConstants.ISSUE_PRIORITY_TYPES
        ));
        return err();
      }
      return;
    });
  }
}