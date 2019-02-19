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

OrderService.prototype.createOrderWithProducts = function (order, productList) {
	return this.createOrder(order).then(() => {
		let createOrderAssetCypher = "CREATE (n:OrderAsset{_id: $_id}) WITH n MATCH (o:Order{_id: $orderId}) MATCH(p:Product{_id: $product}) " +
			"MERGE (o)-[:INCLUDEORDERASSET]->(n)-[:INCLUDEPRODUCT]->(p)"
		return Promise.map(productList, product => {
			return this.transaction.cun(createOrderAssetCypher, { _id: apiUtils.generateShortId('orderasset'), orderId: order._id, product: product });
		})
	})
};

OrderService.prototype.createOrder = function (order) {
	let cypher = "CREATE (n:Order{_id: $_id}) SET n = $props";
	return this.transaction.run(cypher, { _id: order._id, props: order });
};

OrderService.prototype.findOrderById = function (orderId) {
	let cypher = "MATCH (n:Order{_id: $id})-->(m:OrderAsset)-->(p:Product) WITH n, COLLECT(DISTINCT p) AS productList " +
		"MATCH (n)-->(l:Logistics) RETURN n AS order, l AS logistics, productList";
	return this.transaction(cypher, { id: orderId }).then(neo4jResults => {
		return {
			order: neo4jResults.records[0].get("order"),
			logistics: neo4jResults.records[0].get("logistics"),
			productList: neo4jResults.records[0].get("productList")
		}
	})
}

OrderService.prototype.attachLogistics = function (orderId, logistics) {
	let cypher = "MATCH (n:Order{_id: $orderId}) CREATE (m:Logistics{_id: $id}) SET m = $props WITH * MERGE (n)-[:INCLUDELOGISTICS]->(m) ";
}

OrderService.prototype.checkOrderExists = function (orderId) {
	let cypher = "MATCH  (n:Order{_id: $orderId}) RETURN n";
	return this.transaction.run(cypher, { orderId: order }).then(neo4jResults => {
		return neo4jResults.records;
	})
}