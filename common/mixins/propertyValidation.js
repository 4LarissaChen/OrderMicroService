'use strict';
var regexConstants = require('../../server/constants/regexConstants.js');
var artifactConstants = require('../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var apiConstants = require('../../server/constants/apiConstants.js');

module.exports = function(Model, options) {
  if (options._id) {
    Model.validatesLengthOf('_id', {max: 128, message: {
      max: nodeUtil.format(apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH, '_id', 128)
    }});
  }
  if (options.id) {
    Model.validatesFormatOf('id', {
      with: regexConstants.REGEX_VALID_NAMING,
      message: nodeUtil.format(apiConstants.ERROR_STACK_INVALID_NAMING, 'The id of ' + Model.modelName)
    });
  }

  if (options.name) {
    Model.validate('name', function(err) {
      if (this.name && this.name.length > 128) {
        return err();
      }
    }, {
      message: nodeUtil.format(
        apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH,
        'name', 128
      )
    });
  }

  if (options.targetSystems) {
    Model.validatesLengthOf(options.targetSystems, {max: 1, message: {
      max: nodeUtil.format(apiConstants.ERROR_STACK_ONLY_ONE, Model.modelName, 'targetSystem')
    }});
  }

}
