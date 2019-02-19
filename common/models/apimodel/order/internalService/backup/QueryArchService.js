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
// var UserCypherQueryService = require('../../../user/internalService/UserCypherQueryService.js');
// var app = require('../../../../../../server/server.js');
// var teamAPIHelper = require('../teamAPIHelper.js');
//
// module.exports = function QueryArchService() {
//   this.queryArchesTemplate = function (userId, queryCachePromiseGenerator, queryDBPromiseGenerator, 
//     addCachePromiseGenerator, cb) {
//     var CAUser = app.models.CAUser;
//     var userCypherQueryService = new UserCypherQueryService();
//     var self = this;
//     queryCachePromiseGenerator().catch(function(err){
//       logger.error(err.status === 404 ? err.statusText : err);
//  
//       return CAUser.exists(userId).then(function(isExisted) {
//         if (!isExisted) throw apiUtils.build404Error(nodeUtil.format(apiConstants.ERROR_MESSAGE_NO_MODEL_FOUND, "User"));
//       }).then(() => queryDBPromiseGenerator())
//         .then(neo4jArches => self.populateNeo4jArchesWithMongoArches(neo4jArches))
//         .then(arches => addCachePromiseGenerator(arches));
//     }).then(arches => cb(null, arches)).catch(function(err){
//       logger.error(err);
//       cb(err, null);
//     });
//   };
//
//   this.populateNeo4jArchesWithMongoArches = function (neo4jArches) {
//     var Architecture = app.models.Architecture;
//     var archIdArray = [];
//    
//     neo4jArches.forEach(function(item) {
//       Object.assign(item, item['arch']);
//       delete item['arch'];
//       archIdArray.push(item._id);
//       var summaryText = "";
//       if(item['executiveSummary'] && item['executiveSummary'].length > 0) {
//         summaryText = item['executiveSummary'][0]['summaryText'];
//       }
//       item['executiveSummary'] = summaryText;
//       // sort by TOC order
//       if (item.includedArtifacts.length)
//         item.includedArtifacts.sort(apiUtils.sortArtifactByTocOrder);
//       if (item.tag.length)
//         item.tag.sort(apiUtils.sortByName);
//     });
//     var filter = {
//       where: {"_id": {"inq": archIdArray}}
//     };
//     return Architecture.find(filter).then(function(mongoArches){
//       neo4jArches.forEach(function(neo4jItem) {
//         var mongoItem = mongoArches.find(function(item) {
//           return item._id === neo4jItem._id;
//         });
//         neo4jItem["rankValue"] = mongoItem["rankValue"];
//         neo4jItem["numOfCopied"] = mongoItem["numOfCopied"];
//         neo4jItem["lastModified"] = mongoItem["lastModified"];
//       });
//       return neo4jArches;
//     });
//   };
//
//   this.updateAllUserhCacheForArch = function(archId) {
//     var userCypherQueryService = new UserCypherQueryService();
//     var self = this;
//     return Promise.all([teamAPIHelper.getArchOwnerId(archId).catch(() => {return {}}),
//       teamAPIHelper.getArchTeamMembers(archId).catch(() => {return {}}),
//       userCypherQueryService.queryBookmarkedArchUserIds(archId).catch(() => []),
//     ]).then(function(res) {
//       var promArr = [];
//       if(res[0].ownerId) promArr.push(self.releaseOwnedArchesFromCache(res[0].ownerId));
//       if(res[1].teamMembersId) res[1].teamMembersId.forEach(id => promArr.push(self.releaseSharedArchesFromCache(id)));
//       if(res[2]) res[2].forEach(id => promArr.push(self.releaseBookmarkedArchesFromCache(id)));
//       return Promise.all(promArr);
//     }).catch(err => logger.error(err.status === 404 ? err.statusText : err));
//   };
//
//   this.releaseOwnedArchesFromCache = function(userId, status) {
//     return status ? this.releaseCache('OwnedArches', userId + ':' + status) : 
//       this.releaseAllStatusArchesFromCache('OwnedArches', userId);
//   };
//
//   this.releaseSharedArchesFromCache = function(userId, status) {
//     return status ? this.releaseCache('SharedArches', userId + ':' + status) : 
//       this.releaseAllStatusArchesFromCache('SharedArches', userId);
//   };
//
//   this.releaseAllStatusArchesFromCache = function(model, userId) {
//     var self = this;
//     var promiseArr = artifactConstants.ARCHITECTURE_STATUS_SUPPORTED_TYPES.map(
//       status => self.releaseCache(model, userId + ':' + status));
//     return Promise.all(promiseArr);
//   };
//
//   this.releaseBookmarkedArchesFromCache = function(userId) {
//     return this.releaseCache('BookmarkedArches', userId);
//   };
//
//   this.getOwnedArchesFromCache = function(userId, status) {
//     return this.getArchesFromCache('OwnedArches', userId + ':' + status);
//   };
//
//   this.getSharedArchesFromCache = function(userId, status) {
//     return this.getArchesFromCache('SharedArches', userId + ':' + status);
//   };
//
//   this.getBookmarkedArchesFromCache = function(userId) {
//     return this.getArchesFromCache('BookmarkedArches', userId);
//   };
//
//   this.cacheOwnedArches = function(userId, status, arches) {
//       return this.cacheArches('OwnedArches', userId + ':' + status, arches);
//   };
//
//   this.cacheSharedArches = function(userId, status, arches) {
//       return this.cacheArches('SharedArches', userId + ':' + status, arches);
//   };
//
//   this.cacheBookmarkedArches = function(userId, arches) {
//     return this.cacheArches('BookmarkedArches', userId, arches);
//   };
//
//   this.getArchesFromCache = function (model, key) {
//     var cache = loopback.findModel("CacheMicroService");
//     return cache[model + '_get']({key : key}).then(res => res.obj);
//   };
//
//   this.cacheArches = function (model, key, arches) {
//     var cache = loopback.findModel("CacheMicroService");
//     return cache[model + '_set']({key : key, value: arches}).catch(err => logger.error(err.status === 404 ? err.statusText : err))
//       .then(() => arches);
//   };
//
//   this.releaseCache = function(model, key) {
//     var cache = loopback.findModel("CacheMicroService");
//     return cache[model + '_expire']({key: key, ttl: 1}).catch(err => logger.error(err.status === 404 ? err.statusText : err));
//   };
//
// };
//
//
//
