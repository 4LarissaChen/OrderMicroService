'use strict';
var apiUtils = require('../../../../server/utils/apiUtils.js');
var app = require('../../../../server/server.js');
var logger = require('winston');
var nodeUtil = require('util');
var loopback = require('loopback');
var Promise = require('bluebird')
var apiConstants = require('../../../../server/constants/apiConstants.js');
var neo4jUtils = require('../../../../server/utils/neo4jUtils.js');
var StoreService = require('./internalService/StoreService.js');
var moment = require('moment');
var neo4j = require('neo4j-driver').v1;
var fs = require('fs');

module.exports = function (StoreAPI) {
  StoreAPI.remoteMethod('getStoreList', {
    description: "Get store list.",
    returns: { arg: 'resp', type: ['Store'], description: 'Store list.', root: true },
    http: { path: '/store/getStoreList', verb: 'get', status: 200, errorStatus: [500] }
  });
  StoreAPI.getStoreList = function () {
    var session = neo4jUtils.getSession();
    return session.readTransaction(transaction => {
      var storeService = new StoreService(transaction);
      return storeService.getStoreList();
    })
  }

  StoreAPI.remoteMethod('addStore', {
    description: "Get store list.",
    accepts: { arg: 'data', type: 'Store', required: true, description: "Information of the new store.", http: { source: 'body' } },
    returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
    http: { path: '/store/addStore', verb: 'post', status: 200, errorStatus: [500] }
  });
  StoreAPI.addStore = function (data) {
    var session = neo4jUtils.getSession();
    var transaction = session.beginTransaction();
    var storeService = new StoreService(transaction);
    data._id = apiUtils.generateShortId('Store');
    return storeService.addStore(data).then(() => transaction.commit()).then(() => {
      return { isSuccess: true };
    }).catch(err => {
      transaction.rollback();
      throw err;
    }).finally(() => session.close());
  }
}