'use strict';
var nodeUtil = require('util');
var apiConstants = require('../../server/constants/apiConstants.js');

function checkIfNonBlank(value) {
  return value && (value instanceof Array ? (value.length > 0) : true);
};

module.exports = function(Model, options) {
  if (!options) {
    return;
  }
  var pairs;
  if (options.pairs instanceof Array) {
    pairs = options.pairs;
  } else if (options.reference instanceof Object) {
    pairs = [options.pairs];
  } else {
    return;
  }

  if (!pairs[0].from || !pairs[0].to) {
    return;
  }
  // all from/to properties can't be blank and only one pair is set
  // set `pairs[0].from` as the propertyName
  Model.validate(pairs[0].from, function(err) {
    Object.defineProperty(this, 'errors', {
      writable: true,
    });
    var blankPairsCount = 0;
    var nonblankPairsCount = 0;
    for (var idx in pairs) {
      var from = pairs[idx].from;
      var to = pairs[idx].to;
      var isFromNonBlank = checkIfNonBlank(this[from]);
      var isToNonBlank = checkIfNonBlank(this[to]);

      if (isFromNonBlank && isToNonBlank) {  // both non-blank
        nonblankPairsCount++;
      } else if (!isFromNonBlank && !isToNonBlank) { // both blank
        blankPairsCount++;
      } else if (!isToNonBlank) { // from/to properties must be in pairs: the `to` is blank
        var errMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_IN_PAIRS, Model.modelName, to, from
        );
        this.errors.add(from, errMsg);
        return err();
      } else { // from/to properties must be in pairs: the `from` is blank
        var errorMsg = nodeUtil.format(
          apiConstants.ERROR_STACK_CONN_FROM_TO_IN_PAIRS, Model.modelName, from, to
        );
        this.errors.add(to, errorMsg);
        return err();
      }
    }
    if (blankPairsCount == pairs.length) {
      this.errors.add(
        '<from-to-properties>',
        nodeUtil.format(apiConstants.ERROR_STACK_CONN_FROM_TO_NOT_FOUND, Model.modelName)
      );
      return err();
    }

    if (nonblankPairsCount > 1) {
      this.errors.add(
        '<from-to-properties>',
        nodeUtil.format(apiConstants.ERROR_STACK_CONN_FROM_TO_ONLY_ONE, Model.modelName)
      );
      return err();
    }
  }); 
};
