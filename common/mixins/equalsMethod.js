'use strict';

module.exports = function (Model, options) {
  Model.prototype.equals = function (target) {
    if (!target || !(target instanceof Model)) return false;
    if (this === target) return true;

    var propertyNames = Object.keys(Model.definition.properties);
    for (var idx in propertyNames) {
      var propName = propertyNames[idx];
      var propObj = Model.definition.properties[propName];
      if (propObj.type === Array || propObj.type.constructor === Array) {
        if (!this[propName] || !target[propName])
          return false;
        if (this[propName].length != target[propName].length)
          return false;
        for (var arrIdx = 0; arrIdx < this[propName].length; arrIdx++) {
          if (target[propName].indexOf(this[propName][arrIdx]) == -1)
            return false;
        }
      } else {
        if (this[propName] != target[propName]) return false;
      }
    }
    return true;
  };
};
