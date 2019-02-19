// 'use strict';
// var Promise = require('bluebird');
// var loopback = require('loopback');
// var logger = require('winston');
// var apiUtils = require('../../../../../../server/utils/apiUtils.js');
// var arrayUtils = require('../../../../../../server/utils/arrayUtils.js');
// var constants = require('../../../../../../server/constants/constants.js');
// var cypherConstants = require('../../../../../../server/constants/cypherConstants.js');
// var apiConstants = require('../../../../../../server/constants/apiConstants.js');
// var artifactConstants = require('../../../../../../server/constants/artifactConstants.js');
// var promiseUtils = require('../../../../../../server/utils/promiseUtils.js');
// var nodeUtil = require('util');
// var retry = require('bluebird-retry');
//
// var UserCypherQueryService = require('./UserCypherQueryService');
//
// module.exports = LabelService;
//
// function LabelService() {}
//
// LabelService.prototype.validateInputData = function(userId, data) {
//   //validate API request input data
//   var Label = loopback.findModel('Label');
//   if ((data instanceof Label) == false) {
//     data = new Label(data);
//   }
//   if (data.isValid() == false) {
//     logger.error('invalid input parameters. ' + JSON.stringify(data.errors));
//     throw apiUtils.build400Error(apiUtils.retrieveErrorMessage(data.errors), JSON.stringify(data.errors));
//   }
//   return this.checkLabelNameExisted(userId, data);
// }
//
// LabelService.prototype.checkLabelNameExisted = function(userId, data) {
//   var userCypherQueryService = new UserCypherQueryService();
//   return new Promise(function(resolve, reject) {
//     userCypherQueryService.checkUserOwnedLabelNameExisted(userId, data.__data.name).then(function(result) {
//       if (result.length > 0 && result[0].isExisted) {
//         throw apiUtils.build400Error(nodeUtil.format(apiConstants.ERROR_MESSAGE_NAME_UNIQUE, "Label", data.__data.name))
//       }
//       resolve(data.__data);
//     }).catch(function(err) {
//       reject(err);
//     });
//   });
// }
//
// LabelService.prototype.addUserOwnedLabel = function(userId, label) {
//   var Label = loopback.findModel("Label");
//   var CAUser = loopback.findModel("CAUser");
//
//   return new Promise(function(resolve, reject) {
//     if (!label._id) {
//       label._id = apiUtils.generateShortId('Label');
//     }
//     Label.findOrCreate(label).then(function(result) {
//       return CAUser.findById(userId);
//     }).then(function(targetUser) {
//       var userLabelIds = targetUser.INCLUDELABEL_Label_id;
//       userLabelIds.push(label._id);
//       return targetUser.updateAttributes({'INCLUDELABEL_Label_id': userLabelIds});
//     }).then(function(updatedUser) {
//       resolve(label);
//     }).catch(function(err) {
//       reject(err);
//     });
//   });
//
// };
//
// LabelService.prototype.deleteUserOwnedLabel = function(userId, labelId) {
//   var Label = loopback.findModel("Label");
//   var CAUser = loopback.findModel("CAUser");
//   var Notes = loopback.findModel("Notes");
//
//   var userCypherQueryService = new UserCypherQueryService();
//
//   return new Promise(function(resolve, reject) {
//     CAUser.findById(userId).then(function(targetUser) {
//       var userLabelIds = targetUser.INCLUDELABEL_Label_id;
//       var index = userLabelIds.indexOf(labelId);
//       userLabelIds.splice(index, 1);
//       return targetUser.updateAttributes({'INCLUDELABEL_Label_id': userLabelIds });
//     }).then(function(updatedUser) {
//       return userCypherQueryService.getLabelRelatedNotes(labelId);
//     }).then(function(notesIds) {
//       var notesPromiseArray = [];
//       if (notesIds.length > 0) {
//         notesIds.forEach(function(item) {
//           notesPromiseArray.push(Notes.findById(item.id));
//         });
//       }
//       return Promise.all(notesPromiseArray);
//     }).then(function(notes) {
//       var notesPromiseArray = [];
//       if (notes.length > 0) {
//         notes.forEach(function(item) {
//           var notesLabelIds = item.REFLABEL_Label_id;
//           var index = notesLabelIds.indexOf(labelId);
//           notesLabelIds.splice(index, 1);
//           notesPromiseArray.push(item.updateAttributes({'REFLABEL_Label_id': notesLabelIds}));
//         });
//       }
//       return Promise.all(notesPromiseArray);
//     }).then(function() {
//       return Label.findById(labelId)
//     }).then(function(targetLabel) {
//       return targetLabel.destroy()
//     }).then(function() {
//       resolve(true);
//     }).catch(function(err) {
//       reject(err);
//     });
//   });
// }
//
//
// LabelService.prototype.renameUserOwnedLabel = function(userId, labelId, data) {
//   var Label = loopback.findModel("Label");
//   return new Promise(function(resolve, reject) {
//     Label.findById(labelId).then(function(targetLabel) {
//       return targetLabel.updateAttribute('name', data.name);
//     }).then(function(label) {
//       resolve(label);
//     }).catch(function(err) {
//       reject(err);
//     });
//   });
// }
