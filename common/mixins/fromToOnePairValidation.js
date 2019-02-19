'use strict';
var nodeUtil = require('util');
var apiConstants = require('../../server/constants/apiConstants.js');

function checkIfNonBlank(value) {
  return value && (value instanceof Array ? (value.length > 0) : true);
};
function checkIfLengthEqOne(value) {
  return value instanceof Array ? (value.length == 1) : true;
}
module.exports = function(Model, options) {
  if (!options) {
    return;
  }
  if (!options.propertyName || !options.connectFrom ||
    !options.connectTo || !options.currentModel ||
    !options.connectBetween || !options.notRequired) {
    return;
  }

  Model.validate(options.propertyName, function(err) {
    if (!this[options.propertyName]) {
      return;
    }
    Object.defineProperty(this, 'errors', {
      writable: true,
    });
    var propertyValue = this[options.propertyName];
    if (!propertyValue instanceof Array) {
      propertyValue = [propertyValue];
    }
    for (var idx = 0; idx < propertyValue.length; idx++) {
      var logicalConnector = propertyValue[idx];

      // 1. validate the properties not required
      for (var propIdx = 0; propIdx < options.notRequired.length; propIdx++) {
        var notRequiredProp = options.notRequired[propIdx];
        if (checkIfNonBlank(logicalConnector[notRequiredProp])) {
          errorMsg = nodeUtil.format(
            apiConstants.ERROR_STACK_CONN_FROM_TO_RESTRICTION,
            Model.modelName,
            options.connectBetween,
            options.currentModel
          );
          this.errors.add(errorKey, errorMsg);
          return err();
        }
      }

      // 2. validate the properties required
      var isFromNonBlank = checkIfNonBlank(logicalConnector[options.connectFrom]);
      var isToNonBlank = checkIfNonBlank(logicalConnector[options.connectTo]);
      var errorKey = options.propertyName + '[' + idx + ']';
      var errorMsg;
      if (!isFromNonBlank && !isToNonBlank) {
        errorMsg = nodeUtil.format(apiConstants.ERROR_STACK_CONN_FROM_TO_NOT_FOUND, Model.modelName);
        this.errors.add(errorKey, errorMsg);
        return err();
      }
      if (isFromNonBlank && !isToNonBlank) {
        errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_IN_PAIRS,
          Model.modelName, options.connectTo, options.connectFrom
        );
        this.errors.add(errorKey, errorMsg);
        return err();
      }
      if (!isFromNonBlank && isToNonBlank) {
        errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_IN_PAIRS,
          Model.modelName, options.connectFrom, options.connectTo
        );
        this.errors.add(errorKey, errorMsg);
        return err();
      }

      // 3. validate the referred target object
      var targetObjects = this[options.connectBetween];
      if (!targetObjects) {
        errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_TARGET_NOT_FOUND,
          options.connectFrom, options.connectBetween
        );
        this.errors.add(errorKey, errorMsg);
        return err();
      }
      // target object of 'from' should exist
      var fromRefId = logicalConnector[options.connectFrom][0];
      var fromRefTarget = targetObjects.find(function(element) {
        return fromRefId == element._id;
      });
      if (!fromRefTarget) {
        errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_TARGET_NOT_FOUND,
          fromRefId, options.connectBetween
        );
        this.errors.add(errorKey, errorMsg);
        return err();
      }
      // target object of 'to' should exist
      var toRefId = logicalConnector[options.connectTo][0];
      var toRefTarget = targetObjects.find(function(element) {
        return toRefId == element._id;
      });
      if (!toRefTarget) {
        errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_TARGET_NOT_FOUND,
          toRefId, options.connectBetween
        );
        this.errors.add(errorKey, errorMsg);
        return err();
      }
    }
  });
};
