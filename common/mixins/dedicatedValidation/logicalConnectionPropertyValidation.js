'use strict';
var nodeUtil = require('util');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {
  Model.validate('CONNECTFROMSS_SubSystem_id', function(err) {
    // both blank
    if (!this.CONNECTFROMSS_SubSystem_id.length && !this.CONNECTFROMLN_LogicalNode_id.length) {
      this.errors.add('CONNECTFROMSS_SubSystem_id', nodeUtil.format(
        apiConstants.ERROR_STACK_CONN_FROM_TO_NOT_FOUND, Model.modelName
      ));
    }
    // both non-blank
    if (this.CONNECTFROMLN_LogicalNode_id.length && this.CONNECTFROMLN_LogicalNode_id.length) {
      this.errors.add('CONNECTFROMSS_SubSystem_id', nodeUtil.format(
        apiConstants.ERROR_STACK_CONN_FROM_TO_ONLY_ONE, Model.modelName
      ));
    }
  });

  Model.validate('CONNECTTOSS_SubSystem_id', function(err) {
    // both blank
    if (!this.CONNECTTOSS_SubSystem_id.length && !this.CONNECTTOLN_LogicalNode_id.length) {
      this.errors.add('CONNECTTOSS_SubSystem_id', nodeUtil.format(
        apiConstants.ERROR_STACK_CONN_FROM_TO_NOT_FOUND, Model.modelName
      ));
    }
    // both non-blank
    if (this.CONNECTTOSS_SubSystem_id.length && this.CONNECTTOLN_LogicalNode_id.length) {
      this.errors.add('CONNECTTOSS_SubSystem_id', nodeUtil.format(
        apiConstants.ERROR_STACK_CONN_FROM_TO_ONLY_ONE, Model.modelName
      ));
    }
  });

  Model.validatesInclusionOf('flowType', {
    in: artifactConstants.LOGICAL_CONNECTION_FLOWTYPE_TYPES,
    message: nodeUtil.format(
      apiConstants.ERROR_STACK_MUST_IN,
      'LogicalConnection\'s flowType',
      artifactConstants.LOGICAL_CONNECTION_FLOWTYPE_TYPES
    )
  });
}
