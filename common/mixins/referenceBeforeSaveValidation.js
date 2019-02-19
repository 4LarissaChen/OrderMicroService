'use strict';
var Promise = require("bluebird");
var loopback = require('loopback');
var nodeUtil = require('util');
var logger = require('winston');
var apiConstants = require('../../server/constants/apiConstants.js');
var apiUtils = require('../../server/utils/apiUtils.js');

/**
 * retrieve the model name from the foreignKey.
 * e.g. if the foreignKey is 'REFERENCELC_LogicalComponent_id', the model name will be 'LogicalComponent'
 * @param {string} foreignKey in the format of '*_*_*'
 * @return {string}
 */
function getModelNameByForeignKey(foreignKey) {
  return foreignKey.split('_')[1];
}
/**
 * check whether the reference do not exist
 * @param {string} refModelName
 * @param {string} refId
 * @return {string} will return the refId if the reference not exist or some error happen
 */
function checkReferenceNotExisted(refModelName, refId) {
  var refModel = loopback.findModel(refModelName);
  return new Promise(function(resolve, reject) {
    refModel.findById(refId).then(function(result) {
      if (result) reject(false);
      else resolve({
        refModelName: refModelName,
        refId: refId
      });
    }).catch(function(err) {
      logger.error(err);
      resolve(refId);
    });
  });
}
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
  
  Model.observe('before save', function event(ctx, next) {
    var promiseArray = [];
    if (ctx.instance || ctx.currentInstance) {
      for (var idx in references) {
        var referenceProperty = references[idx];
        var referenceModelName = getModelNameByForeignKey(referenceProperty);
        var referenceIds = ctx.instance ?
          ctx.instance[referenceProperty] : ctx.currentInstance[referenceProperty];
        if (referenceIds) {
          for (var i = 0; i < referenceIds.length; i++) {
            var refId = referenceIds[i];
            promiseArray.push(checkReferenceNotExisted(referenceModelName, refId));
          }
        }
      }
    }
    if (promiseArray.length) {
      // use Promise.any here to get just one result, we don't need to wait for all request
      // see http://bluebirdjs.com/docs/api/promise.any.html for more details.
      Promise.any(promiseArray).then(function(result) {
        var errorStack = nodeUtil.format(
          apiConstants.ERROR_STACK_REFERENCED_INSTANCE_NOT_FOUND,
          result.refModelName, Model.modelName, result.refId);
        var errorMsg = errorStack.split('.')[0];
        next(apiUtils.build400Error(errorMsg, errorStack));
      }).catch(Promise.AggregateError, function(err) { // none of the promises are resolved
        next();
      });
    } else {
      next();
    }
  });
};