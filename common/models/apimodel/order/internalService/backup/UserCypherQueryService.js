// 'use strict';
// var Promise = require('bluebird');
// var loopback = require('loopback');
// var logger = require('winston');
// var apiUtils = require('../../../../../../server/utils/apiUtils.js');
// var constants = require('../../../../../../server/constants/constants.js');
// var cypherConstants = require('../../../../../../server/constants/cypherConstants.js');
// var apiConstants = require('../../../../../../server/constants/apiConstants.js');
// var artifactConstants = require('../../../../../../server/constants/artifactConstants.js');
// var promiseUtils = require('../../../../../../server/utils/promiseUtils.js');
// var nodeUtil = require('util');
// var retry = require('bluebird-retry');
//
// module.exports = UserCypherQueryService;
//
// function UserCypherQueryService() {}
//
//
//
// var executeCypherStatement = function(cypher) {
//   return new Promise(function(resolve, reject) {
//     promiseUtils.getNeo4jQueryPromise(cypher, {}, {}).then(function(neo4jResults){
//       resolve(neo4jResults);
//     }).catch(function(err){
//       logger.error("Error Happens while execute cypher query statement : " + err);
//       reject(err);
//     });
//   });
// }
//
// UserCypherQueryService.prototype.queryMyArchitectures = function(userId, status) {
//   var cypher = {
//     query: cypherConstants.CYPHER_USER_QUERY_OWN_ARCHITECTURE,
//     params: {
//       id: userId,
//       status: status
//     }
//   };
//   return executeCypherStatement(cypher);
// }
//
//
// UserCypherQueryService.prototype.querySharedArchitectures = function(teamMemberId, status) {
//   var cypher = {
//     query: cypherConstants.CYPHER_USER_QUERY_SHARED_ARCHITECTURE,
//     params: {
//       id: teamMemberId,
//       status: status
//     }
//   };
//   return executeCypherStatement(cypher);
// }
//
//
// /**
//  * Get Tags which belong to a specific user
//  * @param {string} userId
//  * @return {array}
//  */
// UserCypherQueryService.prototype.getUserOwnedTags = function(userId) {
//   var cypher = {
//     query: cypherConstants.CYPHER_GET_USER_OWNED_TAGS,
//     params: {
//       userId: userId
//     }
//   };
//   return executeCypherStatement(cypher);
// }
//
// /**
//  * Get Labels which belong to a specific user
//  * @param {string} userId
//  * @return {array}
//  */
// UserCypherQueryService.prototype.getUserOwnedLabels = function(userId) {
//   var cypher = {
//     query: cypherConstants.CYPHER_GET_USER_OWNED_LABELS,
//     params: {
//       userId: userId
//     }
//   };
//   return executeCypherStatement(cypher);
// }
//
//
//
//
// UserCypherQueryService.prototype.queryBookmarkedArchitectures = function(userId) {
//   var cypher = {
//     query: cypherConstants.CYPHER_USER_QUERY_BOOKMARK_ARCHITECTURE,
//     params: {
//       id: userId
//     }
//   };
//
//   return executeCypherStatement(cypher);
// }
//
//
// UserCypherQueryService.prototype.queryLatestUserData = function(userId) {
//     var cypher = {
//         query: cypherConstants.CYPHER_HISTORY_USER_DATA_QUERY
//     };
//     return executeCypherStatement(cypher);
// }
//
// UserCypherQueryService.prototype.checkUserOwnedLabelNameExisted = function(userId, labelName) {
//   var cypher = {
//     query: cypherConstants.CYPHER_CHECK_USER_OWNED_LABEL_NAME_EXISTED,
//     params: {
//       'userId': userId,
//       'labelName': labelName
//     }
//   };
//   return executeCypherStatement(cypher);
// }
//
// UserCypherQueryService.prototype.getLabelRelatedNotes = function(labelId) {
//   var cypher = {
//     query: cypherConstants.CYPHER_QUERY_LABEL_RELATED_NOTES,
//     params: {
//       'labelId': labelId
//     }
//   };
//   return executeCypherStatement(cypher);
//
// }
//
// UserCypherQueryService.prototype.queryBookmarkedArchUserIds = function(archId) {
//   var cypher = {
//       query: cypherConstants.CYPHER_BOOKMARKED_ARCHITECTURE_USER,
//       params: {
//         'archId': archId
//       }
//   };
//   return executeCypherStatement(cypher);
// };