'use strict';
var app = require('../../server/server.js');

/**
 * execute mongodb command actions given a DataSource
 * @param {datasource} datasource
 * @param {object} model
 * @param {string} command
 * @param {string} filter
 * @return {Promise}
 */
exports.executeCommandWithDs = function(datasource, model, command, filter) {
    return new Promise(function(resolve, reject) {
        datasource.connect(function(err) {
            if(err) {
                reject(err);
            } else {
                datasource.connector.execute(
                    model, command, filter,
                    function(err, info) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(info);
                        }
                    }
                );
            }//else
        }); //connect
    }); //Promise
}

/**
 * execute mongodb command actions
 * @param {object} model
 * @param {string} command
 * @param {string} filter
 * @return {Promise}
 */
exports.executeCommand = function(model, command, filter) {
    var datasource = app.dataSources.mongo;
    return this.executeCommandWithDs(datasource, model, command, filter);
};
