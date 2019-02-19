'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function (Model, options) {
  Model.validate("priority", function (err) {
    if (this.priority) {
      var r = /^\+?[1-9][0-9]*$/;
      if (r.test(this.priority)) {
        return;
      } else {
        this.errors.add(nodeUtil.format(
          apiConstants.ERROR_STACK_POSITIVE_INTEGER_ONLY,
          'Priority',
          'ArchitecturePrinciple'
        ));
        return err();
      }
    }
  });
}