'use strict';
var loopback = require('loopback');
var  xml2js = require('xml2js'),
  util = require('util');
var parser = new xml2js.Parser(),
  xmlBuilder = new xml2js.Builder();
var apiUtil = require('../utils/apiUtils');
var apiConstants = require('../constants/apiConstants');
var Promise = require('bluebird');
var app = require('../server.js');


var addPrefixErrorMessage = function (modelType, err) {
  err.message = modelType +" - "+ err.message;
  return err;
};
/**
 * Invoke createNewArchitecture API and return a promise
 * @param {string} userId, Target User Id
 * @param {object} data, architecture data
 * @return {promise}
 */
exports.createArchitectureWithPromise = function(userId, data, cb) {
  return new Promise(function(resolve, reject) {
    var model = loopback.findModel("CAUser");
    model.createNewArchitecture(userId, data, function(err, result){
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    })
  });
};


/**
 * Invoke deleteArchitecture API and return a promise
 * @param {modelType} Loopback Model Name
 * @param {archId} Target Architecture Id
 * @return {promise}
 */
exports.deleteArchitectureWithPromise = function(archId, cb) {
  return new Promise(function(resolve, reject) {
    var model = loopback.findModel("Architecture");
    model.delete(archId, function(err, result){
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    })
  });
};

/**
 * Invoke createArtifact API and return a promise
 * @param {modelType} Loopback Model Name
 * @param {archId} Target Architecture Id
 * @param {object} Artifact data
 * @return {promise}
 */
exports.createArtifactWithPromise = function(modelType, archId, data, cb) {
  return new Promise(function(resolve, reject) {
    var model = loopback.findModel(modelType);
    model.createArtifact(archId, data, function(err, result){
      if (err) {
        reject(addPrefixErrorMessage(modelType, err))
      } else {
        resolve(result);
      }
    })
  });
};


/**
 * Invoke artifact add API and return a promise
 * @param {modelType} Loopback Model Name
 * @param {archId} Target Architecture Id
 * @param {object} Artifact data
 * @return {promise}
 */
exports.addArtifactWithPromise = function(modelType, archId, artifactId, data, cb) {
  return new Promise(function(resolve, reject) {
    if (modelType == "AODServices") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "AODEnterprise") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "AODITSystem") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "AODUsageScenario") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "ArchitecturalDecision") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "FunctionalRequirement") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "NonFunctionalRequirement") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "SystemContext") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    } else if (modelType == "UseCase") {
      var model = loopback.findModel(modelType);
      model.addInstance(archId, artifactId, data, function (err, result) {
        if (err) {
          reject(addPrefixErrorMessage(modelType, err))
        } else {
          resolve(result);
        }
      })
    }
  });
};

/**
 * Parse xml file and return a promise
 * @param {string} xmlString
 * @return {callback}
 */
exports.getXmlParsePromise = function(xmlString) {
  return new Promise(function(resolve, reject) {
    parser.parseString(xmlString, function (err, result) {
      if (!err) {
        resolve(result);
      } else {
        reject(err)
      }
    });
  });
};

/**
 * Execute neo4j cypher and return a promise
 * @param {string} cypher, cypher statement
 * @param {object} params, cypher statement parameters
 * @options {object} options
 * @return {callback}
 */
exports.getNeo4jQueryPromise = function(cypher, params, options) {
  var neo4jQuery = loopback.findModel("Neo4jQuery");
  return new Promise(function(resolve, reject) {
    neo4jQuery.dataSource.connector.execute(
      cypher,
      {},
      options,
      function (err, neo4jResults) {
        if (!err) {
          resolve(neo4jResults);
        } else {
          reject(err)
        }
      }
    )
  });
};


/**
 * Execute asynchronization call in seqence with same function and return promise
 * @param {array} array, asynchronization call parameters
 * @param {function} fun, asynchronization call function
 * @return {promise}
 */
exports.processAddArtifactInstanceAsynCall = function(array, fun) {
  return new Promise(function(resolve, reject) {
    var result = [];
    Promise.reduce(array, function(tempResult, params) {
      return fun(params[0],params[1],params[2],params[3]).then(function(callResult){
        result.push(callResult);
      })
    }, 0).then(function() {
      resolve(result);
    }).catch(function(err){
      reject(err)
    });
  });
}


/**
 * Execute asynchronization call in seqence with same function and return promise
 * @param {array} array, asynchronization call parameters
 * @param {function} fun, asynchronization call function
 * @return {promise}
 */
exports.processAsyncallArrayInSequence = function(array, fun) {
  return new Promise(function(resolve, reject) {
    var result = [];
    Promise.reduce(array, function(tempResult, params) {
      return fun(params).then(function(callResult){
        result.push(callResult);
      })
    }, 0).then(function() {
      resolve(result);
    }).catch(function(err){
      reject(err)
    });
  });
}


/**
 * Execute asynchronization call in seqence with different function and return promise
 * @param {array<object>} array, asynchronization call [{params: [], fun: fn}], for example,
 * [{"fun": ArchitectureAccessService.prototype.getOwner, "params": [obj, 'arch_01']},
 * {"fun": ArchitectureAccessService.prototype.getArtifactCatalog, "params": [obj, 'arch_01']}]
 * @return {promise}
 */
exports.processAsyncallArrayInSequenceWithDiFun = function(array) {
  return new Promise(function(resolve, reject) {
    var result = [];
    Promise.reduce(array, function(tempResult, obj) {
      var params = obj.params;
      var fun = obj.fun;
      return fun(params[0], params[1]).then(function(owner){
        result.push(owner);
      })
    }, 0).then(function() {
      resolve(result);
    }).catch(function(err){
      reject(err)
    });
  });
}


exports.getModelCreationPromise = function(modelName, data) {
  return new Promise(function(resolve, reject) {
    loopback.findModel(modelName).create(
      data,
      function(err, models) {
        if (!err) {
          resolve(models);
        } else {
          reject(err)
        }
      });
  });
};


exports.getModelDestoryPromise = function(modelName) {
  return new Promise(function(resolve, reject) {
    loopback.findModel(modelName).destroyAll(      
      function(err, info) {
        if (!err) {
          resolve(info);
        } else {
          reject(err)
        }
      });
  });
};

exports.getModelReplacePromise = function(modelName, data) {
  return new Promise(function(resolve, reject) {
    loopback.findModel(modelName).findOrCreate(
      data,
      function(err, models) {
        if (!err) {
          resolve(models);
        } else {
          reject(err)
        }
      });
  });
};

exports.getModelReplaceOrCreatePromise = function(modelName, data) {
  var model = loopback.findModel(modelName);
  var promiseArray = [];
  data.forEach(function(element) {
    promiseArray.push(model.replaceOrCreate(element));
  });
  return Promise.all(promiseArray);
};

/**
 * Update model attribute in one atom and return promise
 * @param {string} modelName, Loopback model name
 * @param {string} id, The _id of the model
 * @param {object} data, the attributes wonder to be updated
 * @return {promise}
 */
exports.updateAttributesPromise = function(modelName, id, data){
  return new Promise(function(resolve, reject) {
    var mongoConnector = app.dataSources.mongo.connector;
    var options = {allowExtendedOperators: true};

    // mongoConnector.updateAttributes(modelName, id, data, options, function(err, result){
    //   if (!err) {
    //     resolve(result);
    //   } else {
    //     reject(err)
    //   }
    // })

    mongoConnector.updateAll(modelName, {"_id": id}, data, options, function(err, result){
      if (!err) {
        resolve(result);
      } else {
        reject(err)
      }
    })
  });
};
