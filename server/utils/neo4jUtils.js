'use strict';
var Promise = require('bluebird');
var neo4j = require('neo4j-driver').v1;
var driver;

exports.getSession = function () {
	if (!driver) {
		try {
			var url = global.settings.neo4j.url;
			var username = global.settings.neo4j.username;
			var password = global.settings.neo4j.password;
			driver = neo4j.driver(url,
				neo4j.auth.basic(username, password),
				{ maxTransactionRetryTime: 30000 });
		} catch (err) {
			console.error(err);
		};
	}
	return driver.session();
};

exports.getTransaction = function () {
	let session = this.getSession();
	return session.beginTransaction();
}