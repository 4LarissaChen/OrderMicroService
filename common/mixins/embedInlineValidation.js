'use strict';

module.exports = function(Model, options) {
  if (!options) {
    return;
  }
  // inline embedsOne
  if (options.inlineOne) {
    var propertyKeys;
    if (options.inlineOne instanceof Array) {
      propertyKeys = options.inlineOne;
    } else if (typeof options.inlineOne == 'string') {
      propertyKeys = [options.inlineOne];
    } else {
      return;
    }
    for (var propIdx in propertyKeys) {
      const propertyKey = propertyKeys[propIdx];
      Model.validate(propertyKey, function(err) {
        if (!this[propertyKey]) {
          return;
        }
        var propertyRefObj = this[propertyKey];
        if (propertyRefObj.isValid() == false) {
          Object.defineProperty(this, 'errors', {
            writable: true,
          });
          var errorKeys = Object.keys(propertyRefObj.errors);
          for (var errIdx in errorKeys) {
            var errorKey = errorKeys[errIdx];
            var errorMsgs = propertyRefObj.errors[errorKey];
            var fullErrorKey =  propertyKey + '.' + errorKey;
            for (var msgIdx in errorMsgs) {
              this.errors.add(fullErrorKey, errorMsgs[msgIdx]);
            }
          }
          err();
        }
      });
    }
  } // if
  // inline embedsMany
  var inlineManyPropertyKeys = [];
  if (options.inlineMany) {
    if (options.inlineMany instanceof Array) {
      inlineManyPropertyKeys = options.inlineMany;
    } else if (typeof options.inlineMany == 'string') {
      inlineManyPropertyKeys = [options.inlineMany];
    } else {
      return;
    }
    for (var propIndex in inlineManyPropertyKeys) {
      const inlineManyPropertyKey = inlineManyPropertyKeys[propIndex];
      Model.validate(inlineManyPropertyKey, function(err) {
        if (!this[inlineManyPropertyKey]) {
          return;
        }
        for (var inlineIdx = 0; inlineIdx < this[inlineManyPropertyKey].length; inlineIdx++) {
          var inlineInstance = this[inlineManyPropertyKey][inlineIdx];
          if (inlineInstance.isValid() == false) {
            Object.defineProperty(this, 'errors', {
              writable: true,
            });
            var errKeys = Object.keys(inlineInstance.errors);
            for (var errIdx in errKeys) {
              var errKey = errKeys[errIdx];
              var errMsgs = inlineInstance.errors[errKey];
              var fullErrKey = inlineManyPropertyKey + '[' + inlineIdx + '].' + errKey;
              for (var errMsgIdx in errMsgs) {
                this.errors.add(fullErrKey, errMsgs[errMsgIdx]);
              }
            }
            err();
            break;
          }
        }
      });
    }
  }// if
};

