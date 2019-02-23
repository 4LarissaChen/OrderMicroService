'use strict';
var apiUtils = require('../../../../server/utils/apiUtils.js');
var arrayUtils = require('../../../../server/utils/arrayUtils');
var stringUtils = require('../../../../server/utils/stringUtils.js');
var promiseUtils = require('../../../../server/utils/promiseUtils.js');
var app = require('../../../../server/server.js');
var logger = require('winston');
var nodeUtil = require('util');
var loopback = require('loopback');
var Promise = require('bluebird')
var apiConstants = require('../../../../server/constants/apiConstants.js');
var neo4jUtils = require('../../../../server/utils/neo4jUtils.js');
var modelUtils = require('../../../../server/utils/modelUtils.js');
var dateUtils = require('../../../../server/utils/dateUtils.js');
var localCacheUtils = require('../../../../server/utils/localCacheUtils.js');
var moment = require('moment');
var neo4j = require('neo4j-driver').v1;
var neo4jDataUtils = require('../../../../server/utils/neo4jDataUtils');
var fs = require('fs');
var OrderService = require('./internalService/OrderService.js');

module.exports = function (OrderAPI) {

	OrderAPI.remoteMethod('findOrderById', {
		description: "Find Order by order id",
		accepts: { arg: 'orderId', type: 'string', required: true, description: "order id", http: { source: 'path' } },
		returns: { arg: 'resp', type: 'FindOrderByIdResponse', description: 'Order itself information', root: true },
		http: { path: '/Orders/findOrderById/:orderId', verb: 'get', status: 200, errorStatus: [500] }
	});
	OrderAPI.findOrderById = function (orderId) {
		let session = neo4jUtils.getSession();
		return session.readTransaction(transaction => {
			let orderService = new OrderService(transaction);
			return orderService.findOrderById(orderId);
		}).catch(err => err).finally(() => session.close());
	}

	OrderAPI.remoteMethod('createOrder', {
		description: "Find Order by order id",
		accepts: [{ arg: 'customerId', type: 'string', required: true, description: "customerId id", http: { source: 'path' } },
		{ arg: 'productList', type: ['string'], required: true, description: "product list", http: { source: 'body' } },
		{ arg: 'freight', type: 'string', required: true, description: "freight", http: { source: 'body' } }],
		returns: { arg: 'resp', type: 'CreateOrderResponse', description: 'Order itself information', root: true },
		http: { path: '/Orders/createOrder/:customerId', verb: 'put', status: 200, errorStatus: [500] }
	});
	OrderAPI.createOrder = function (customerId, productList, freight) {
		let transaction = neo4jUtils.getTransaction();
		let orderService = new OrderService(transaction);
		let order = {
			_id: apiUtils.generateShortId("order"),
			customerId: customerId,
			createDate: moment().utc().format()
		};
		return orderService.createOrderWithProductsAndLogistics(order, productList).then(() => {
			return transaction.commit();
		}).then(() => {
			return { orderId: order._id };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => {
			session.close();
		})
	}

	OrderAPI.remoteMethod('loadStaticData', {
		description: "Initialize graph database with static data.",
		accepts: { arg: 'modelName', type: 'string', required: true, description: "model name", http: { source: 'path' } },
		returns: { arg: 'isSuccess', type: 'IsSuccessResponse', description: 'is success or not', root: true },
		http: { path: '/Orders/loadStaticData/:modelName', verb: 'get', status: 200, errorStatus: [500] }
	});

	OrderAPI.loadStaticData = function (modelName) {
		let transaction = neo4jUtils.getTransaction();
		let dataSet = JSON.parse(fs.readFileSync(global.appRoot + 'common/models/datamodel/staticdata/' + modelName + '.json'));
		let orderService = new OrderService(transaction);
		return Promise.map(dataSet, data => {
			data._id = apiUtils.generateShortId(modelName);
			return orderService.createStaticData(modelName, data);
		}).then(() => {
			let promiseArray = [];
			let labels = [];
			let relations = JSON.parse(fs.readFileSync(global.appRoot + "common/models/datamodel/relationship/Relationship.json"));
			for (let key in relations) {
				labels = key.split('2');
				relations[key].forEach(element => {
					promiseArray.push(orderService.createStaticRels(labels, element));
				});
			}
			return Promise.all(promiseArray);
		}).then(() => {
			return transaction.commit();
		}).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => {
			session.close();
		})
	}

	OrderAPI.remoteMethod('attachLogistics', {
		description: "Initialize graph database with static data.",
		accepts: [{ arg: 'logisticsId', type: 'string', required: true, description: "Logistics id", http: { source: 'path' } },
		{ arg: 'logistics', type: 'AttachLogisticsRequest', required: true, description: "logistics", http: { source: 'body' } }],
		returns: { arg: 'isSuccess', type: 'IsSuccessResponse', description: 'is success or not', root: true },
		http: { path: '/Orders/attachLogistics/:logisticsId', verb: 'put', status: 200, errorStatus: [500] }
	});

	OrderAPI.attachLogistics = function (logisticsId, logistics) {
		let transaction = neo4jUtils.getTransaction();
		let orderService = new OrderService();
		return orderService.checkLogisticsExists(logisticsId).then(result => {
			if(result.length == 0) throw apiUtils.build404Error(apiConstants.ERROR_MESSAGE_NO_MODEL_FOUND, "Logistics");
			return orderService.attachLogistics(logisticsId, logistics);
		}).then(() => {
			return transaction.commit();
		}).then(() => { return { isSuccess: true } }).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => {
			session.close();
		})
	}
}