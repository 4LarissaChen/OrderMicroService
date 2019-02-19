'use strict';
var nodeUtil = require('util');
var apiConstants = require('../../server/constants/apiConstants.js');
var apiUtils = require('../../server/utils/apiUtils.js');

module.exports = function(Model, options) {
  if (!options) {
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
    const targetPropertyKey = references[referenceIdx].target;
    Model.validate(targetPropertyKey, function(err) {
      var sourcePropertySplit = sourcePropertyKey.split('.');
      var sourcePropertyKey1st = sourcePropertySplit[0];
      var sourcePropertyKey2st = sourcePropertySplit[1];
      
      Object.defineProperty(this, 'errors', {
        writable: true,
      });

      if (!this[sourcePropertyKey1st]) {
        return;
      }
      var sourceRefIds = sourcePropertyKey2st ?
        this[sourcePropertyKey1st][sourcePropertyKey2st] :
        this[sourcePropertyKey1st];
      var targetRefObjs = this[targetPropertyKey];

      if (!sourceRefIds && !targetRefObjs) { // both source and target don't exist
        return;
      }
      if (!sourceRefIds) {
        sourceRefIds = [];
      }
      if (!targetRefObjs) {
        targetRefObjs = [];
      }

      var sourceRefIdMap = {};
      for (var idx = 0; idx < sourceRefIds.length; idx++) {
        var refId = sourceRefIds[idx];
        // validates uniqueness Of _id
        if (sourceRefIdMap[refId]) { // existed
          this.errors.add(sourcePropertyKey, nodeUtil.format(
            apiConstants.ERROR_STACK_DUPLICATED_REFERENCE, sourcePropertyKey, refId
          ));
          return err();
        } else { // not existed
          sourceRefIdMap[refId] = true;
        }
      }

      var targetRefDocIdMap = {};
      var targetRefIdMap = {};
      var targetRefNameMap = {};
      for (var objIdx = 0; objIdx < targetRefObjs.length; objIdx++) {
        var targetRefObj = targetRefObjs[objIdx];
        // validates uniqueness Of _id
        if (targetRefDocIdMap[targetRefObj._id]) {
          this.errors.add(targetPropertyKey, nodeUtil.format(
            apiConstants.ERROR_STACK_DUPLICATED_REFERENCE,
            targetPropertyKey, targetRefObj._id
          ));
          return err();
        } else {
          targetRefDocIdMap[targetRefObj._id] = true;
        }

        // validates uniqueness Of id
        var uniqueIdNeeded = options.uniqueness ?
          (typeof options.uniqueness.id != 'undefined' ? options.uniqueness.id : true) : true;
        if (targetRefObj.id && uniqueIdNeeded) {
          if (targetRefIdMap[targetRefObj.id]) {
            this.errors.add(targetPropertyKey, nodeUtil.format(
              apiConstants.ERROR_MESSAGE_ID_UNIQUE,
              targetPropertyKey, targetRefObj.id
            ));
            return err();
          } else {
            targetRefIdMap[targetRefObj.id] = true;
          }
        }

        // validates uniqueness Of name
        var uniqueNameNeeded = options.uniqueness ?
          (typeof options.uniqueness.name != 'undefined' ? options.uniqueness.name : true) : true;
        if (targetRefObj.name && uniqueNameNeeded) {
          if (targetRefNameMap[targetRefObj.name]) {
            this.errors.add(targetPropertyKey, nodeUtil.format(
              apiConstants.ERROR_MESSAGE_NAME_UNIQUE,
              targetPropertyKey, targetRefObj.name
            ));
            return err();
          } else {
            targetRefNameMap[targetRefObj.name] = true;
          }
        }

        // validates the consistency: whether the object is referenced
        if (!sourceRefIdMap[targetRefObj._id]) {
          this.errors.add(targetPropertyKey, nodeUtil.format(
            apiConstants.ERROR_STACK_REFERENCED_INSTANCE_NOT_USED, targetRefObj._id
          ));
          return err();
        }
      }

      // validates the consistency: whether the reference id exists
      for (var index = 0; index < sourceRefIds.length; index++) {
        var id = sourceRefIds[index];
        if (!targetRefDocIdMap[id]) {
          this.errors.add(sourcePropertyKey, nodeUtil.format(
            apiConstants.ERROR_STACK_REFERENCED_INSTANCE_NOT_FOUND,
            apiUtils.getModelNameFromForeignKey(sourcePropertyKey2st),
            Model.modelName, id
          ));
          return err();
        }
      }
    });
  } // for
};
