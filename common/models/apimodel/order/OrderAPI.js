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
		http: { path: '/orders/findOrderById/:orderId', verb: 'get', status: 200, errorStatus: [500] }
	});
	OrderAPI.findOrderById = function (orderId) {
		let session = neo4jUtils.getSession();
		return session.readTransaction(transaction => {
			let orderService = new OrderService(transaction);
			return orderService.findOrderById(orderId);
		}).finally(() => session.close());
	}

	OrderAPI.remoteMethod('createOrder', {
		description: "Find Order by order id",
		accepts: { arg: 'createOrderData', type: 'CreateOrderRequest', required: true, description: "product list", http: { source: 'body' } },
		returns: { arg: 'resp', type: 'CreateOrderResponse', description: 'Order itself information', root: true },
		http: { path: '/orders/createOrder', verb: 'put', status: 200, errorStatus: [500] }
	});
	OrderAPI.createOrder = function (createOrderData) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let orderService = new OrderService(transaction);
		let order = {
			_id: apiUtils.generateShortId("order"),
			customerId: createOrderData.customerId,
			createDate: moment().utc().format()
		};
		return orderService.createOrderWithProductsAndLogistics(order, createOrderData.productList, createOrderData.freight).then(() => { 
			return orderService.attachOrderToStore(order._id, createOrderData.storeId);	
		}).then(() => {
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
		http: { path: '/orders/loadStaticData/:modelName', verb: 'get', status: 200, errorStatus: [500] }
	});

	OrderAPI.loadStaticData = function (modelName) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let dataSet = JSON.parse(fs.readFileSync(global.appRoot + 'common/models/datamodel/staticdata/' + modelName + '.json'));
		let orderService = new OrderService(transaction);
		return Promise.map(dataSet, data => {
			data._id = data._id ? data._id : apiUtils.generateShortId(modelName);
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
		accepts: { arg: 'logistics', type: 'AttachLogisticsRequest', required: true, description: "logistics", http: { source: 'body' } },
		returns: { arg: 'isSuccess', type: 'IsSuccessResponse', description: 'is success or not', root: true },
		http: { path: '/orders/attachLogistics', verb: 'put', status: 200, errorStatus: [500] }
	});

	OrderAPI.attachLogistics = function (logistics) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let orderService = new OrderService(transaction);
		return orderService.checkLogisticsExists(logistics.logisticsId).then(result => {
			if (result.length == 0) throw apiUtils.build404Error(apiConstants.ERROR_MESSAGE_NO_MODEL_FOUND, "Logistics");
			return orderService.attachLogistics(logistics);
		}).then(() => {
			return transaction.commit();
		}).then(() => { return { isSuccess: true } }).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => {
			session.close();
		})
	}

	OrderAPI.remoteMethod('getProductSeries', {
		description: "Get product series.",
		returns: { arg: 'resp', type: ['ProductSeries'], description: 'Product series.', root: true },
		http: { path: '/orders/getProductSeries', verb: 'get', status: 200, errorStatus: [500] }
	});
	OrderAPI.getProductSeries = function () {
		let session = neo4jUtils.getSession();
		return session.readTransaction(transaction => {
			let orderService = new OrderService(transaction);
			return orderService.getProductSeries();
		}).finally(() => session.close());
	}

	OrderAPI.remoteMethod('getProductsBySeries', {
		description: "Get products by product series Id.",
		accepts: { arg: 'seriesId', type: 'string', required: true, description: "product series id", http: { source: 'path' } },
		returns: { arg: 'resp', type: ['Product'], description: 'is success or not', root: true },
		http: { path: '/orders/seriesId/:seriesId/getProductsBySeries', verb: 'get', status: 200, errorStatus: [500] }
	});
	OrderAPI.getProductsBySeries = function (seriesId) {
		let session = neo4jUtils.getSession();
		return session.readTransaction(transaction => {
			let orderService = new OrderService(transaction);
			return orderService.getProductsBySeries(seriesId);
		}).finally(() => session.close());
	}
}

