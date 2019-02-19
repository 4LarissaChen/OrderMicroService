'use strict';
const uuidV1 = require('uuid/v1');
var shortid = require('shortid');
var stringUtils = require('../utils/stringUtils.js');
var loopback = require('loopback');
var apiUtils = require('../utils/apiUtils.js');
var promiseUtils = require('../utils/promiseUtils.js');
var apiConstants = require('../constants/apiConstants.js');
var logger = require('winston');
var loopBackContext = require('loopback-context');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var xmlBuilder = new xml2js.Builder();
var Promise = require('bluebird')

/**
 *
 */
// exports.sendErrorMsg = function(cb, statusCode, errorName, errorMsg, errorStack) {
//   var error = new Error(errorMsg);
//   error.status = statusCode;
//   error.name = errorName;
//   error.message = errorMsg;
//   error.stack = errorStack;
//   return cb(error);
// };


/**
 * Build Error Message
 * @param {string} statusCode
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.buildErrorMsg = function(statusCode, errorMsg, errorStack) {
  var error = new Error();
  error.status = statusCode;
  error.message = errorMsg;
  error.stack = errorStack;
  return error;
};

/**
 * Build Error with 404 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build404Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  return apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_NO_MODEL_FOUND, errorMsg, errorStack);
}


/**
 * Build Error with 400 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build400Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  var errorInstance = apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_INVALID_INPUT_PARAMETERS, errorMsg, errorStack);
  errorInstance.name = apiConstants.ERROR_NAME_INVALID_INPUT_PARAMETERS;
  return errorInstance;
}

/**
 * Build Error with 500 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build500Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  return apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_INTERNAL_SERVER_ERROR, errorMsg, errorStack);
}

/**
 * generate uuid by modelName, eg. actor_000100101100101
 * @param {string} modelName
 * @return {string}
 */
exports.generateId = function(modelName) {
  var prefix = modelName.toLowerCase();
  var id = prefix + "_" + uuidV1();
  return stringUtils.replaceAll(id, '-', '_');
};

exports.generateShortId = function(idPrefix) {
  var prefix = idPrefix ? idPrefix.toLowerCase() + '_' : '';
  var id = prefix + shortid.generate();
  return id;
}

exports.getIdPrefix = function(id) {
  return id.substr(0, id.indexOf('_'));
}
/**
 * Disable Remote Method By Name
 * @param {object} testStr
 * @return null
 */
exports.disableRelatedModelRemoteMethod = function(model) {
  var keys = Object.keys(model.definition.settings.relations);
  keys.forEach(function(relation){
    model.disableRemoteMethodByName("prototype.__findById__" + relation);
    model.disableRemoteMethodByName("prototype.__destroyById__" + relation);
    model.disableRemoteMethodByName("prototype.__updateById__" + relation);
    model.disableRemoteMethodByName("prototype.__link__" + relation);
    model.disableRemoteMethodByName("prototype.__unlink__" + relation);
    model.disableRemoteMethodByName("prototype.__get__" + relation);
    model.disableRemoteMethodByName("prototype.__create__" + relation);
    model.disableRemoteMethodByName("prototype.__delete__" + relation);
    model.disableRemoteMethodByName("prototype.__update__" + relation);
    model.disableRemoteMethodByName("prototype.__findOne__" + relation);
    model.disableRemoteMethodByName("prototype.__count__" + relation);
    model.disableRemoteMethodByName("prototype.__exists__" + relation);
  });
};

/**
 * retrieve the first error message which is not 'is invalid'
 * @param {object} errors
 * @return the error message
 */
exports.retrieveErrorMessage = function(errors) {
  for (var prop in errors) {
    var errorArray = errors[prop];
    for (var idx in errorArray) {
      if (errorArray[idx] != 'is invalid') {
        return errorArray[idx].split(':')[0];
      }
    }
  }
}

/**
 * sort an array of AssetArtifact, according to the TOC order
 */
exports.sortArtifactByTocOrder = function(a, b) {
  return a.typeNum < b.typeNum;
  // return tocPositionMap[a.typeId] < tocPositionMap[b.typeId] ? -1 : 1;
};

exports.sortByName = function(a, b) {
  return a.name < b.name ? -1 : 1;
};

/**
 * retrieve the model name from the foreignKey.
 * e.g. if the foreignKey is 'REFERENCELC_LogicalComponent_id', the model name will be 'LogicalComponent'
 * @param {string} foreignKey in the format of '*_*_*'
 * @return {string}
 */
exports.getModelNameFromForeignKey = function(foreignKey) {
  return foreignKey.split('_')[1];
}


exports.setCurrentUserId = function(userId) {
  global.currentUserId = userId;
}

exports.getCurrentUserId = function() {
  var ctx = loopBackContext.getCurrentContext();
  var currentUserId;
  if (ctx && ctx.get('accessToken')) {
    var accessToken = ctx.get('accessToken');
    currentUserId = accessToken.userId;
  } else {
    currentUserId = global.currentUserId;
  }
  return currentUserId;
}



exports.replaceRefIds = function(refIdArray, idPrefix) {
  if (refIdArray) {
    for (var i=0; i<refIdArray.length; i++) {
      if (refIdArray[i].indexOf("_COPY_") != -1) {
        refIdArray[i] = idPrefix + refIdArray[i].split("_COPY_")[1];
      } else {
        refIdArray[i] = idPrefix + refIdArray[i];
      }
    }
  }
}

//Util function for copy architecture, used to replace id to new id
exports.replaceId = function(id, idPrefix) {
  if (id) {
    if (id.indexOf("_COPY_") != -1) {
      return idPrefix + id.split("_COPY_")[1];
    } else {
      return idPrefix + id;
    }
  }
}

//Util function for replace UI Model Ids
exports.replaceUIModelIds = function(element, idPrefix) {
  return new Promise(function(resolve, reject) {
    promiseUtils.getXmlParsePromise(element.uimodel).then(function (result) {
      var mxGraphModel = result.mxGraphModel;
      if (mxGraphModel && mxGraphModel.root) {
        var root = mxGraphModel.root[0];
        var mxCells = root.mxCell;
        mxCells.forEach(function (mxCell) {
          if (mxCell.$.coreModelId) {
            mxCell.$.coreModelId = apiUtils.replaceId(mxCell.$.coreModelId, idPrefix);
          }
        })
      }
      element.uimodel = xmlBuilder.buildObject(result);
      resolve(true);
    }).catch(function(err){
      reject(err);
    })
  });
}

exports.getSystemConfig = function() {
  var setting;
  if (process.env.NODE_ENV) {
    setting = require('../../server/config.' + process.env.NODE_ENV + '.json');
  } else {
    setting = require('../config.json');
  }
  return setting;
}

exports.getSystemInfo = function () {
  var result = require('../../package.json');
  //var result = JSON.parse(fs.readFileSync('ca-app/package.json'));
  return result;
}


exports.validateAPIRequest = function (modelName, data) {
  var model = loopback.findModel(modelName)
  if (data instanceof model == false) {
      data = new model(data);
  }
  if ( data.isValid() == false) {
      var errorStack = JSON.stringify(data.errors);
      throw apiUtils.build400Error(
          apiConstants.ERROR_NAME_INVALID_INPUT_PARAMETERS, errorStack
      );
  }
}