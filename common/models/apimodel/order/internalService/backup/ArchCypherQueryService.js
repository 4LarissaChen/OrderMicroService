'use strict';
var Promise = require('bluebird');
var loopback = require('loopback');
var logger = require('winston');
var apiUtils = require('../../../../../../server/utils/apiUtils.js');
var constants = require('../../../../../../server/constants/constants.js');
var cypherConstants = require('../../../../../../server/constants/cypherConstants.js');
var apiConstants = require('../../../../../../server/constants/apiConstants.js');
var artifactConstants = require('../../../../../../server/constants/artifactConstants.js');
var promiseUtils = require('../../../../../../server/utils/promiseUtils.js');
var nodeUtil = require('util');

module.exports = ArchCypherQueryService;

function ArchCypherQueryService() {}



var executeCypherStatement = function(cypher) {
  return new Promise(function(resolve, reject) {
    promiseUtils.getNeo4jQueryPromise(cypher, {}, {}).then(function(neo4jResults){
      resolve(neo4jResults);
    }).catch(function(err){
      logger.error("Error Happens while execute cypher query statement : " + err);
      reject(err);
    });
  });
}

ArchCypherQueryService.prototype.searchAllElementsInArchitecture = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_SEARCH_ALL_ARCHITECTURE_ELEMENTS,
    params: {
      archId: archId
    }
  };
  return executeCypherStatement(cypher);
}


/**
 * Search all the elements which reference to the target architecture
 * @param {string} archId
 * @return {array}
 */
ArchCypherQueryService.prototype.searchElementsRefArchitecture = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_SEARCH_ELEMENTS_REF_ARCHITECTURE,
    params: {
      archId: archId
    }
  };
  return executeCypherStatement(cypher);
}


ArchCypherQueryService.prototype.getArchInfo = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_ARCHITECTURE_GET_INFO,
    params: {
      archId: archId
    }
  };
  return executeCypherStatement(cypher);
}


ArchCypherQueryService.prototype.checkElementExistedAndRetry = function(elementType, elementId) {

  var existed = false;
  return new Promise(function(resolve, reject) {
    retry(function() {
      var cypher = {
        query: nodeUtil.format(cypherConstants.CYPHER_CHECK_EXISTED, elementType),
        params: {
          _id: elementId
        }
      };
      return executeCypherStatement(cypher).then(function(neo4jResults) {
        if (neo4jResults && neo4jResults[0]) {
          existed = true;
        } else {
          throw apiUtils.build500Error(apiConstants.ERROR_MESSAGE_DATA_NOT_SYNC);
        }
      });
    }, {
      max_tries: constants.DATA_CHECK_MAX_TRIES,
      interval: constants.DATA_CHECK_INTERVAL
    }).then(function(result) {
      resolve(existed);
    }).catch(function(err) {
      reject(err);
    });
  });
}


ArchCypherQueryService.prototype.QueryArchitectureOwner = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_ARCHITECTURE_OWNER,
    params: {
      archId: archId
    }
  };
  return executeCypherStatement(cypher);
}


ArchCypherQueryService.prototype.checkIfArchitectureHasArtifactType = function(archId, artifactType) {
  var cypher = {
    query: cypherConstants.CYPHER_CHECK_ARCHITECTURE_ARTIFACTTYPE,
    params: {
      archId: archId,
      artifactType: artifactType
    }
  };
  return new Promise(function(resolve, reject) {
    promiseUtils.getNeo4jQueryPromise(cypher, {}, {}).then(function(neo4jResults){
      var existed = neo4jResults&&neo4jResults[0] ? true : false;
      resolve(existed);
    }).catch(function(err){
      reject(err);
    });
  });
}


ArchCypherQueryService.prototype.getArtifactsByArchId = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_GET_ARTIFACT_LIST,
    params: {
      id: archId
    }
  };
  return promiseUtils.getNeo4jQueryPromise(cypher, {}, {});
};



ArchCypherQueryService.prototype.searchElementsInArchitectureByMultipleModelType = function(archId, modelTypes) {
    var cypherStatement = cypherConstants.CYPHER_SEARCH_ARCHITECTURE_MULTIPLE_TYPE_ELEMENT;
    var cypher = {
        query: cypherStatement,
        params: {
            archId: archId,
            modelTypes: modelTypes
        }
    };
    return executeCypherStatement(cypher);
}


/**
 * Search Elements inside an Architecture through Neo4j Cypher
 * @param {archId}
 * @param {modelType} modelType can be "Actor", "LogicalComponent", etc..
 * @return {callback}
 */
ArchCypherQueryService.prototype.searchElementsInArchitectureByModelType = function(archId, modelType) {
  var cypherStatement;
  switch (modelType) {
    case "Actor":
    case "TargetSystem":
    case "LogicalComponent":
    case "PhysicalComponent":
    case "SubSystem"  :
    case "LogicalNode":
    case "ArchitecturalDecision":
    case "UseCase":
    case "LDU":
      cypherStatement = nodeUtil.format(cypherConstants.CYPHER_SEARCH_ARCHITECTURE_ELEMENT, modelType);
      break;
    default: throw apiUtils.build400Error("Model Type is not supported");
  }
  var cypher = {
    query: cypherStatement,
    params: {
      archId: archId
    }
  };

  return executeCypherStatement(cypher);

}


ArchCypherQueryService.prototype.queryArchAODs = function(archId) {
  var cypher = {
    query: cypherConstants.CYPHER_QUERY_ARCHITECTURE_AODS,
    params: {
      archId: archId
    }
  };
  return executeCypherStatement(cypher);
}


ArchCypherQueryService.prototype.checkIfArchNameOwnedByOthers = function(userId, archName) {
  var cypher = {
    query: cypherConstants.CYPHER_USER_CHECK_ARCHITECTURE_OWNED_BY_OTHERS,
    params: {
      userId: userId,
      archName: archName
    }
  };
  return executeCypherStatement(cypher);
}

ArchCypherQueryService.prototype.getArchitectureStatusByName = function(archName) {
  var cypher = {
    query: cypherConstants.CYPHER_GET_ARCHITECTURE_STATUS_BY_NAME,
    params: {
      archName: archName
    }
  };
  return executeCypherStatement(cypher);
}

ArchCypherQueryService.prototype.checkIfArchNameOwnedByMyself = function(userId, archName) {
  var cypher = {
    query: cypherConstants.CYPHER_USER_CHECK_ARCHITECTURE_OWNED_BY_MYSELF,
    params: {
      userId: userId,
      archName: archName
    }
  };
  return executeCypherStatement(cypher);
}

ArchCypherQueryService.prototype.queryLatestAssetData = function(userId, archName) {
  var cypher = {
      query: cypherConstants.CYPHER_HISTORY_ASSET_DATA_QUERY
  };
  return executeCypherStatement(cypher);
}

/**
 * check the uniqueness of an element's name in an Architecture's scope
 * @param {string} archId the `_id` of the given Architecture
 * @param {string} model the model name
 * @param {string} _id the `_id` of the given element [optional]
 * @param {string} id the `id` of the given element [optional]
 * @param {string} name the `name` of the given element [optional]
 * @return {object} {idExisted: {boolean}, nameExisted: {boolean}}
 */
ArchCypherQueryService.prototype.checkElementUniqueness = function(archId, model, _id, id, name) {
  var cypher = {
    query: nodeUtil.format(cypherConstants.CYPHER_CHECK_ARCH_ELEMENT_ID_NAME_UNIQUENESS, model),
    params: {
      'archId': archId,
      '_id': _id ? _id : '',
      'id': id ? id : '',
      'name': name ? name :''
    }
  };

  return new Promise(function(resolve, reject) {
    promiseUtils.getNeo4jQueryPromise(cypher, {}, {}).then(function(neo4jResults){
      var existed = {
        model: model,
        idExisted: false,
        nameExisted: false
      };
      if (neo4jResults && neo4jResults[0]) {
        existed.idExisted = neo4jResults[0].idExisted;
        existed.id = id;
        existed.nameExisted = neo4jResults[0].nameExisted;
        existed.name = name;
      }
      resolve(existed);
    }).catch(function(err){
      reject(err);
    });
  });
}
