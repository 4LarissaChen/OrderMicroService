'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');
var arrayUtils = require('../../../server/utils/arrayUtils.js');


module.exports = function(Model, options) {

  if (options.members) {
    Model.validate("members", function(err) {
      if (this.members && this.members.length == 0) {
        this.errors.add("teamMembers", apiConstants.ERROR_MESSAGE_TEAM_MEMBER_EMPTY);
        return err();
      }
      if (arrayUtils.checkIfHasRepeatValue(this.members)) {
        var duplicateValue = arrayUtils.getDuplicateValue(this.members);
        this.errors.add("teamMembers", nodeUtil.format(apiConstants.ERROR_MESSAGE_TEAM_MEMBER_DUPLICATE, duplicateValue));
        return err();
      }
      return;
    });
  }


  if (options.permission) {
    Model.validatesInclusionOf("permission", {
      in: artifactConstants.TEAMMEMBER_PERMISSION_TYPES,
      message: nodeUtil.format(
        apiConstants.ERROR_STACK_MUST_IN,
        'Team member permission',
        artifactConstants.ARCHITECTURE_SUPPORTED_TYPES
      )
    });
  }

}
