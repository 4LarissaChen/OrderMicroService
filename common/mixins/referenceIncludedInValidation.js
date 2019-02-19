'use strict';
var nodeUtil = require('util');
var apiConstants = require('../../server/constants/apiConstants.js');

function isInstanceIncluded(instanceId, instanceObjects) {
  var targetInstance = instanceObjects.find(function(element) {
    return element._id == instanceId;
  });
  return targetInstance ? true : false;
}
/**
 * validate the refences: the referenced instances must be included in the input parameters
 */
module.exports = function(Model, options) {
  if (!options || !options.reference) {
    return;
  }
  var references;
  if (options.reference instanceof Array) {
    references = options.reference;
  } else if (options.reference instanceof Object) {
    references = [options.reference];
  } else {
    return;
  }

  for (var referenceIdx in references) {
    const sourcePropertyKey = references[referenceIdx].source;
    const sourceSubPropertyKey = references[referenceIdx].sourceReferenceProperty;
    const targetPropertyKey = references[referenceIdx].target;
    const referenceModelName = references[referenceIdx].modelName;

    // validate the SubSystem request
    Model.validate(sourcePropertyKey, function(err) {
      if (!this[sourcePropertyKey]) return;
      var sourceInstances = this[sourcePropertyKey];
      var targetInstances = this[targetPropertyKey];
      for (var idx = 0; idx < sourceInstances.length; idx++) {
        var sourceInst = sourceInstances[idx];
        var sourceInstRefIds = sourceInst[sourceSubPropertyKey];
        if (!sourceInstRefIds) break;
        for (var refIndex = 0; refIndex < sourceInstRefIds.length; refIndex++) {
          var refId = sourceInstRefIds[refIndex];
          if (!isInstanceIncluded(refId, targetInstances)) {
            Object.defineProperty(this, 'errors', {
              writable: true,
            });  
            var errorKey = sourcePropertyKey +  '[' + idx + '].' + sourceSubPropertyKey; 
            var errorMsg = nodeUtil.format(
              apiConstants.ERROR_STACK_REFERENCED_INSTANCE_NOT_FOUND,
              referenceModelName, sourcePropertyKey, refId
            )
            this.errors.add(errorKey, errorMsg);
            return err();
          }
        }
      }
    });
  }
};
