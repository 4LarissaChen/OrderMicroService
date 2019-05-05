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

module.exports = OrderService;

function OrderService(transaction) {
	this.transaction = transaction;
};

OrderService.prototype.createStaticData = function (modelNmae, data) {
	let cypher = "CREATE (n:%s{_id: $_id}) SET n = $props";
	cypher = nodeUtil.format(cypher, modelNmae);
	return this.transaction.run(cypher, { _id: data._id, props: data });
};

OrderService.prototype.createStaticRels = function (labels, element) {
	let cypher = "MATCH (from:%s{name: $from}) MATCH (to:%s{name: $to}) MERGE (from)-[:%s]->(to)";
	cypher = nodeUtil.format(cypher, labels[0], labels[1], element.type);
	return this.transaction.run(cypher, { from: element.from, to: element.to });
};

OrderService.prototype.createOrderWithProductsAndLogistics = function (order, productList, freight) {
	return this.createOrder(order).then(() => {
		return this.createLogistics(order._id, freight);
	}).then(() => {
		let createOrderAssetCypher = "CREATE (n:OrderAsset{_id: $_id}) WITH n MATCH (o:Order{_id: $orderId}) MATCH(p:Product{_id: $product}) " +
			"MERGE (o)-[:INCLUDEORDERASSET]->(n)-[:INCLUDEPRODUCT]->(p)"
		return Promise.map(productList, product => {
			return this.transaction.run(createOrderAssetCypher, { _id: apiUtils.generateShortId('orderasset'), orderId: order._id, product: product });
		})
	})
};

OrderService.prototype.attachOrderToStore = function (orderId, storeId) {
	let cypher = "MATCH (n:Order{_id: $orderId}) MATCH (m:Store{_id: $storeId}) MERGE (n)<-[:INCLUDEORDER]-(m)";
	return this.transaction.run(cypher, { orderId: orderId, storeId: storeId });
}

OrderService.prototype.attachOrderToStoreThroughFlorist = function (orderId, floristId) {
	let cypher = "MATCH (n:Order{_id: $orderId})-->(oa:OrderAsset) MATCH (f:Florist{_id: $floristId})<--(s:Store) WITH n, f, s, COLLECT(DISTINCT oa) AS oas Merge (n)<-[:INCLUDEORDER]-(s) " +
		"WITH * FOREACH(oa IN oas | MERGE (oa)-[:PRODUCTBY]->(f))";
	return this.transaction.run(cypher, { orderId: orderId, floristId: floristId });
}

OrderService.prototype.createLogistics = function (orderId, freight) {
	let _id = apiUtils.generateShortId("Logistics");
	let cypher = "MATCH (n:Order{_id: $orderId}) CREATE (m:Logistics{_id: $_id}) SET m.freight = $freight MERGE (n)-[:INCLUDELOGISTICS]->(m)";
	return this.transaction.run(cypher, { orderId: orderId, _id: _id, freight: freight });
}

OrderService.prototype.createOrder = function (order) {
	let cypher = "CREATE (n:Order{_id: $_id}) SET n = $props";
	return this.transaction.run(cypher, { _id: order._id, props: order });
};

OrderService.prototype.findOrderById = function (orderId) {
	let cypher = "MATCH (n:Order{_id: $id})-->(m:OrderAsset)-->(p:Product) WITH n, COLLECT(DISTINCT p) AS productList " +
		"MATCH (n)-->(l:Logistics) RETURN n AS order, l AS logistics, productList";
	return this.transaction.run(cypher, { id: orderId }).then(neo4jResults => {
		let resp = {
			order: neo4jResults.records[0].get("order").properties,
			logistics: neo4jResults.records[0].get("logistics").properties,
			productList: neo4jResults.records[0].get("productList").map(r => r.properties)
		}
		return resp;
	})
}

OrderService.prototype.attachLogistics = function (logistics) {
	let cypher = "MATCH (n:Logistics{_id: $logisticsId}) SET n.trackingId = $trackingId SET n.logisticsCompany = $logisticsCompany";
	return this.transaction.run(cypher, {
		logisticsId: logistics.logisticsId,
		trackingId: logistics.trackingId,
		logisticsCompany: logistics.logisticsCompany
	});
}

OrderService.prototype.checkOrderExists = function (orderId) {
	let cypher = "MATCH (n:Order{_id: $orderId}) RETURN n";
	return this.transaction.run(cypher, { orderId: order }).then(neo4jResults => {
		return neo4jResults.records;
	})
}

OrderService.prototype.checkLogisticsExists = function (logisticsId) {
	let cypher = "MATCH (n:Logistics{_id: $logisticsId}) RETURN n";
	return this.transaction.run(cypher, { logisticsId: logisticsId }).then(neo4jResults => {
		return neo4jResults.records;
	})
}

OrderService.prototype.getProductSeries = function (logisticsId) {
	let cypher = "MATCH (n:ProductSeries) RETURN n AS series";
	return this.transaction.run(cypher, {}).then(neo4jResults => {
		return neo4jResults.records.map(r => r.get('series').properties);
	})
}

OrderService.prototype.getProductsBySeries = function (seriesId) {
	let cypher = "MATCH (n:ProductSeries{_id: $_id})-[:INCLUDEPRODUCT]->(m:Product) RETURN m AS product";
	return this.transaction.run(cypher, { _id: seriesId }).then(neo4jResults => {
		return neo4jResults.records.map(r => r.get('product').properties);
	})
}

OrderService.prototype.getProductsById = function (productId) {
	let cypher = "MATCH (n:Product{_id: $_id}) RETURN n AS product";
	return this.transaction.run(cypher, { _id: productId }).then(neo4jResults => {
		return neo4jResults.records[0].get('product').properties;
	})
}