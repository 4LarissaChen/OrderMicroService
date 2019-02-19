'use strict';
var nodeUtil = require('util');
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {
  var subsetProps = [
    'INCLUDECHANNEL_LogicalComponent_id',
    'INCLUDEAPPSERVICES_LogicalComponent_id',
    'INCLUDERESOURCE_LogicalComponent_id'
  ];
  var unionsetProps = 'INCLUDELC_LogicalComponent_id';
  // the reference id in the subsetProps must be incldued in unionsetProps
  for (var idx = 0; idx < subsetProps.length; idx++) {
    const curProp = subsetProps[idx];
    Model.validate(curProp, function(err) {
      Object.defineProperty(this, 'errors', {
        writable: true,
      });
      if (!this[curProp] || !this[curProp].length)
        return;
      for (var index = 0; index < this[curProp].length; index++) {
        var refId = this[curProp][index];
        var found = this[unionsetProps].toJSON().indexOf(refId);
        if (found == -1) {
          var errMsg = nodeUtil.format(
            apiConstants.ERROR_MESSAGE_AODENT_LC_REFERENCE_NOT_FOUND,
            refId, unionsetProps
          );
          this.errors.add(curProp, errMsg);
          return err();
        }
      }
    });
  }
  // the reference id in the unionsetProps must be incldued in unionsetProps
  Model.validate(unionsetProps, function(err) {
    Object.defineProperty(this, 'errors', {
      writable: true,
    });
    if (!this[unionsetProps] || !this[unionsetProps].length)
      return;
    for (var index = 0; index < this[unionsetProps].length; index++) {
      var refId = this[unionsetProps][index];
      var found = false;
      for (var idx in subsetProps) {
        var subset = subsetProps[idx];
        if (this[subset].toJSON().indexOf(refId) > -1) {
          found = true;
          break;
        }
      }
      if (!found) {
        var errMsg = nodeUtil.format(
          apiConstants.ERROR_MESSAGE_AODENT_LC_REFERENCE_NOT_USED,
          refId
        );
        this.errors.add(unionsetProps, errMsg);
        return err();
      }
    }
  });
};
