'use strict';
var apiUtils = require('../../../../server/utils/apiUtils.js');
var app = require('../../../../server/server.js');
var logger = require('winston');
var nodeUtil = require('util');
var loopback = require('loopback');
var Promise = require('bluebird')
var apiConstants = require('../../../../server/constants/apiConstants.js');
var neo4jUtils = require('../../../../server/utils/neo4jUtils.js');
var FloristService = require('./internalService/FloristService.js');
var moment = require('moment');
var neo4j = require('neo4j-driver').v1;
var fs = require('fs');

module.exports = function (FloristAPI) {
	FloristAPI.remoteMethod('createFlorist', {
		description: "Create florist by tel.",
		accepts: { arg: 'tel', type: 'string', required: true, description: "User Id.", http: { source: 'path' } },
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/florist/tel/:tel/createFlorist', verb: 'put', status: 200, errorStatus: [500] }
	});
	FloristAPI.createFlorist = function (tel) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let floristService = new FloristService(transaction);
		let florist = {
			_id: tel,
			level: '0',
			createDate: moment().utc().format()
		};
		return floristService.createFlorist(florist).then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('getFlorist', {
		description: "Get florist.",
		accepts: [{ arg: 'floristId', type: 'string', required: true, description: "Florist Id.", http: { source: 'query' } },
		{ arg: 'storeId', type: 'string', required: true, description: "Store Id.", http: { source: 'query' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/florist/getFlorist', verb: 'get', status: 200, errorStatus: [500] }
	});
	FloristAPI.getFlorist = function (floristId, storeId) {
		let session = neo4j.getSession();
		return session.readTransaction(transaction => {
			let floristService = new FloristService(transaction);
			return floristService.getFlorist(floristId, storeId);
		}).catch(err => {
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('startJob', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'orderId', type: 'string', required: true, description: "Order Id.", http: { source: 'path' } },
		{ arg: 'productId', type: 'string', required: true, description: "Product Id.", http: { source: 'path' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/florist/order/:orderId/product/:productId/startJob', verb: 'put', status: 200, errorStatus: [500] }
	});
	FloristAPI.startJob = function (orderId, productId) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let floristService = new FloristService(transaction);
		return floristService.changeJobStatus(orderId, productId, 'Start').then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('completeJob', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'orderId', type: 'string', required: true, description: "Order Id.", http: { source: 'path' } },
		{ arg: 'productId', type: 'string', required: true, description: "Product Id.", http: { source: 'path' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/florist/order/:orderId/product/:productId/completeJob', verb: 'put', status: 200, errorStatus: [500] }
	});
	FloristAPI.completeJob = function (orderId, productId) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let floristService = new FloristService(transaction);
		return floristService.changeJobStatus(orderId, productId, 'Complete').then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('assignJobToFlroist', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'orderId', type: 'string', required: true, description: "Order Id.", http: { source: 'path' } },
		{ arg: 'floristId', type: 'string', required: true, description: "Florist Id.", http: { source: 'path' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/order/:orderId/florist/:floristId/assignJobToFlroist', verb: 'post', status: 200, errorStatus: [500] }
	});
	FloristAPI.assignJobToFlroist = function (orderId, floristId) {
		let session = neo4jUtils.getSession();
		let transaction = session.beginTransaction();
		let floristService = new FloristService(transaction);
		return floristService.assignFlorist(orderId, floristId).then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('bindFloristsToStore', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'storeId', type: 'string', required: true, description: "Order Id.", http: { source: 'path' } },
		{ arg: 'floristList', type: ['string'], required: true, description: "Florist Ids.", http: { source: 'body' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/store/:storeId/bindFloristsToStore', verb: 'post', status: 200, errorStatus: [500] }
	});
	FloristAPI.bindFloristsToStore = function (storeId, floristList) {
		var session = neo4jUtils.getSession();
		var transaction = session.beginTransaction();
		var floristService = new FloristService(transaction);
		return floristService.bindToStore(storeId, floristList).then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('unbindFlorist', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'storeId', type: 'string', required: true, description: "Order Id.", http: { source: 'path' } },
		{ arg: 'floristList', type: ['string'], required: true, description: "Florist Ids.", http: { source: 'body' } }],
		returns: { arg: 'resp', type: 'IsSuccessResponse', description: '', root: true },
		http: { path: '/store/:storeId/unbindFlorist', verb: 'post', status: 200, errorStatus: [500] }
	});
	FloristAPI.unbindFlorist = function (storeId, floristList) {
		var session = neo4jUtils.getSession();
		var transaction = session.beginTransaction();
		var floristService = new FloristService(transaction);
		return floristService.unbindFlorist(storeId, floristList).then(() => transaction.commit()).then(() => {
			return { isSuccess: true };
		}).catch(err => {
			transaction.rollback();
			throw err;
		}).finally(() => session.close());
	}

	FloristAPI.remoteMethod('getOrderSummaryList', {
		description: "Create florist by userId.",
		accepts: [{ arg: 'floristId', type: 'string', required: true, description: "FloristId Id.", http: { source: 'path' } }],
		returns: { arg: 'resp', type: 'GetOrderSummaryListResponse', description: '', root: true },
		http: { path: '/florist/:floristId/getOrderSummaryList', verb: 'get', status: 200, errorStatus: [500] }
	});
	FloristAPI.getOrderSummaryList = function (floristId) {
		var session = neo4jUtils.getSession();
		let resp = {
			"assigned": [],
			"start": []
		};
		return session.readTransaction(transaction => {
			var floristService = new FloristService(transaction);
			return floristService.getOrderSummaryList(floristId);
		}).then(result => {
			result.forEach(element => {
				let obj = {};
				obj = element.order;
				element.product.status = element.orderAsset.status;
				obj.products = [element.product];
				let index = null;
				if (obj.product.status === 'Assigned') {
					for (let i = 0; i < resp.assigned.length; i++)
						if (resp.assigned[i]._id === obj._id)
							index = i;
					if (index)
						resp.assigned[index].products.push(obj.products);
					else
						resp.assigned.push(obj);
				} else {
					for (let i = 0; i < resp.start.length; i++)
						if (resp.start[i]._id === obj._id)
							index = i;
					if (index)
						resp.start[index].products.push(obj.products);
					else
						resp.start.push(obj);
				}
			});
			return Promise.resolve(resp);
		}).catch(err => {
			throw err;
		}).finally(() => session.close());
	}
}