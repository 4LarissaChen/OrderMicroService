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

module.exports = FloristService;

function FloristService(transaction) {
  this.transaction = transaction;
};

FloristService.prototype.createFlorist = function (florist) {
  let cypher = "CREATE (n:Florist{_id: $_id}) SET n = $props";
  return this.transaction.run(cypher, { _id: florist._id, props: florist });
}

FloristService.prototype.getFlorist = function (floristId, storeId) {
  let cypher;
  if (floristId && floristId != "")
    cypher = "MATCH (f:Florist{_id: $floristId}) RETURN f";
  else {
    cypher = nodeUtil.format("MATCH (s:Store%s)-->(f:Florist) RETURN s, COLLECT (DISTINCT f._id) AS f", (storeId && storeId != "" ? "{_id: $storeId}" : ""));
  }
  return this.transaction.run(cypher, { floristId: floristId, storeId: storeId }).then(neo4jResult => {
    if (floristId && floristId != "")
      return neo4jResult.records[0].get("f").properties;
    else {
      let resp = [];
      neo4jResult.records.forEach(r => {
        let store = r.get("s").properties;
        store.includeFlorists = r.get("f");
        resp.push(store);
      });
      return resp;
    }
  })
}

FloristService.prototype.changeJobStatus = function (orderId, productId, operation) {
  let dateParam = operation.toLowerCase() + "Date";
  let date = moment().local().format('YYYY-MM-DD HH:mm:ss');
  let cypher = "MATCH (n:Order{_id: $ordierId})-->(m:OrderAsset)-->(p:Product{_id: $productId}) " +
    "SET m.status = $operation SET m.%s = $date ";
  cypher = nodeUtil.format(cypher, dateParam);
  return this.transaction.run(cypher, { orderId: orderId, productId: productId, operation: operation, date: date });
}

FloristService.prototype.assignFlorist = function (orderId, floristId) {
  let cypher = "MATCH (o:Order{_id: $orderId})-->(n:OrderAsset) MATCH (f:Florist{_id: $floristId}) WITH f, COLLECT(DISTINCT n) AS assets " +
    "FOREACH (asset IN assets | SET asset.status = 'Assigned' SET asset.assignDate = $date MERGE (asset)-[:PRODUCEDBY]->(f) )";
  return this.transaction.run(cypher, {
    orderId: orderId,
    floristId: floristId,
    date: moment().local().format('YYYY-MM-DD HH:mm:ss')
  });
}

FloristService.prototype.bindToStore = function (storeId, florists) {
  let cypher = "UNWIND {florists} AS florist MATCH (n:Store{_id: $storeId}) MATCH (m:Florist{_id: florist}) MERGE (n)-[:INCLUDEFLORIST]->(m) ";
  return this.transaction.run(cypher, { storeId: storeId, florists: florists });
}

FloristService.prototype.unbindFlorist = function (storeId, florists) {
  let cypher = "UNWIND {florists} AS florist MATCH (n:Store{_id: $storeId})-[rel]->(m:Florist{_id: florist}) DELETE rel";
  return this.transaction.run(cypher, { storeId: storeId, florists: florists });
}

FloristService.prototype.getOrderSummaryList = function (floristId) {
  let cypher = "MATCH (f:Florist{_id: $_id})<--(oa:OrderAsset)<--(o:Order) WHERE oa.status IN ['Assigned', 'Start'] " +
    "MATCH (oa)-->(p:Product) RETURN o AS order, oa as orderAsset, p AS product, f AS florist ";
  return this.transaction.run(cypher, { _id: floristId }).then(neo4jResult => {
    return neo4jResult.records.map(r => {
      return {
        order: r.get('order').properties,
        orderAsset: r.get('orderAsset').properties,
        product: r.get('product').properties,
        florist: r.get('florist').properties
      };
    });
  })
}
