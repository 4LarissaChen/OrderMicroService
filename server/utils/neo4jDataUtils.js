'use strict';
var fs = require('fs');
var neo4jRelationshipConfig = JSON.parse(fs.readFileSync(global.appRoot + '/common/models/datamodel/relationship/Relationship.json'));

// find the first node with the specific label 
exports.findNodeByLabel = function(nodes, label) {
  return nodes.find(node => {
    return node.labels && node.labels.length && node.labels[0] === label;
  });
};

exports.findNodeById = function(nodes, id) {
  return nodes.find(node => {
    return node.properties && node.properties._id && node.properties._id === id;
  });
};

exports.findAllNodesByLabel = function(nodes, label) {
  return nodes.filter(node => {
    return node.labels && node.labels.length && node.labels[0] === label;
  });
}

exports.getRemovedNodes = function(oldNodes, newNodes) {
  return oldNodes.filter(oldNode => {
    var sameOnes = newNodes.find(newNode => newNode.properties._id === oldNode.properties._id);
    return sameOnes == undefined;
  });
};

exports.getRemovedRels = function(oldRels, newRels) {
  return oldRels.filter(oldRel => {
    var sameOnes = newRels.find(newRel => 
      newRel.start === oldRel.start &&
      newRel.end === oldRel.end &&
      newRel.type === oldRel.type
    );
    return sameOnes == undefined;
  });
};

exports.getRelType = function(fromLabel, toLabel) {
  var target = neo4jRelationshipConfig.filter(rel => {
    return rel.fromLabel === fromLabel && 
      rel.toLabel === toLabel
  });
  return target.length ? target : undefined;
}