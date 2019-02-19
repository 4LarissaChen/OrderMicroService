'use strict';
var DataSource = require('loopback-datasource-juggler').DataSource;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var app = require('../server.js');

/**
 * @param {string} env prod, staging, test, development, local
 * @param {string} type mongo, neo4j, email
 * @return {DataSource}
 */
exports.loadDatasource = function(env, type) {
  var dsConfigFile = 'server/datasources.' + env + '.json';
  var dsConfigRaw = fs.readFileSync(global.appRoot + dsConfigFile);
  var dsConfigJson = JSON.parse(dsConfigRaw);
  if (dsConfigJson[type])
    return new DataSource(dsConfigJson[type]);
  else
    return null;
};

exports.switchDatasource = function(oldDs, newDs) {
  var allModels = Object.keys(oldDs.models);
  allModels.forEach(function(modelName) {
    if (oldDs.models[modelName].attachTo)
      oldDs.models[modelName].attachTo(newDs);
  });
};

exports.switchEnv = function(newEnv) {
  var newMongoDs = this.loadDatasource(newEnv, 'mongo');
  var newNeo4jDs = this.loadDatasource(newEnv, 'neo4j');
  var allModels = Object.keys(app.models);
  allModels.forEach(function(modelName) {
    var model = app.models[modelName];
    if (model.dataSource.settings.name == 'mongo') {
      model.attachTo(newMongoDs);
    } else if (model.dataSource.settings.name == 'neo4j') {
      model.attachTo(newNeo4jDs);
    }
  });
};
