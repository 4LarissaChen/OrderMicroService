'use strict';
var loopback = require('loopback');
var app = require('../../server/server.js');

exports.getModelRelationList = function(model) {
  var relations = model.settings.relations;
  var relationNames = Object.keys(relations);
  var result = [];
  relationNames.forEach(function(relName) {
    var relation = Object.assign({}, relations[relName]);
    relation.name = relName;
    result.push(relation);
  });
  return result;
}


exports.getArtifactTypeByModelName = function(modelName) {
    var model = loopback.findModel(modelName);
    var artifactType = model.settings.belongToArtifactType;
    return artifactType;
}

exports.findModelByArtifactType = function(artifactType) {
    var models = app.models();
    var findedModel;
    for (var i=0; i<models.length; i++) {
        var model = models[i];
        if (model.definition.settings.belongToArtifactType &&
            model.definition.settings.belongToArtifactType == artifactType) {
            findedModel = model;
            break;
        }
    }
    return findedModel;
}

exports.getDerivedByInstance = function(model) {
    var derivedByInstance = model.settings.derivedByInstance;
    return derivedByInstance ? derivedByInstance : [];
}


exports.getDependentInstances = function(model) {
    var dependentInstances = model.settings.dependentInstances;
    return dependentInstances ? dependentInstances : [];
}



