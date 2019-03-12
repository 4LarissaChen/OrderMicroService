'use strict';
var Promise = require('bluebird');
var loopback = require('loopback');
var logger = require('winston');
var apiUtils = require('../../../../../server/utils/apiUtils.js');
var constants = require('../../../../../server/constants/constants.js');
var apiConstants = require('../../../../../server/constants/apiConstants.js');
var promiseUtils = require('../../../../../server/utils/promiseUtils.js');
var nodeUtil = require('util');
var neo4jDataUtils = require('../../../../../server/utils/neo4jDataUtils');
var dateUtils = require('../../../../../server/utils/dateUtils.js');
var arrayUtils = require('../../../../../server/utils/arrayUtils.js');
var moment = require('moment');

module.exports = StoreService;

function StoreService(transaction) {
  this.transaction = transaction;
};

StoreService.prototype.getStoreList = function () {
  let cypher = "MATCH (n:Store) RETURN n AS store";
  return this.transaction.run(cypher, {}).then(neo4jResult => {
    return neo4jResult.records.map(r => r.get('store').properties);
  })
}

StoreService.prototype.addStore = function (data) {
  let cypher = "CREATE (n:Store{_id: $_id}) SET n = $props";
  return this.transaction.run(cypher, { _id: data._id, props: data });
}