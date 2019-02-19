'use strict';
var regexConstants = require('../../../server/constants/regexConstants.js');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var apiConstants = require('../../../server/constants/apiConstants.js');

function checkIfNonBlank(value) {
  return value && (value instanceof Array ? (value.length > 0) : true);
};

module.exports = function(Model, options) {
  var exclusionProps = [
    'REFAODSERVICES_AODServices_id',
    'REFAODITSYSTEM_AODITSystem_id',
    'REFAODENTERPRISE_AODEnterprise_id'
  ];
  // only one of `exclusionProps` can be non-blank
  for (var idx = 0; idx < exclusionProps.length; idx++) {
    const curProp = exclusionProps[idx];
    const next1Prop = exclusionProps[(idx + 1) % 3];
    const next2Prop = exclusionProps[(idx + 2) % 3];
    
    Model.validate(curProp, function(err) {
      Object.defineProperty(this, 'errors', {
        writable: true,
      });
      var curPropNonBlank = checkIfNonBlank(this[curProp]);
      var next1PropNonBlank = checkIfNonBlank(this[next1Prop]);
      var next2PropNonBlank = checkIfNonBlank(this[next2Prop]);
      var errorMsg;
      if (curPropNonBlank) {
        if (this[curProp] && this[curProp].length > 1) {
          errorMsg = nodeUtil.format(
            apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH,
            curProp, 1
          );
          this.errors.add(curProp, errorMsg);
          return err();
        }
        if (next1PropNonBlank || next2PropNonBlank) {
          errorMsg = apiConstants.ERROR_MESSAGE_AODUS_REFERENCE_ONLY_ONE;
          this.errors.add(curProp, errorMsg);
          return err();
        }
      } else {
        if (!next1PropNonBlank && !next2PropNonBlank) {
          errorMsg = apiConstants.ERROR_MESSAGE_AODUS_REFERENCE_REQUIRED;
          this.errors.add(curProp, errorMsg);
          return err();
        }
      }
    });
  }
};
