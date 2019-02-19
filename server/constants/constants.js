'use strict';

//Import Folders
exports.PROCESSING_FOLDER_NAME = "processing";
exports.SUCCESS_FOLDER_NAME = "success";
exports.FAIL_FOLDER_NAME = "fail";
exports.CA_IMPORT_SUCCESS_LOG_NAME = "CA_import_success.log";
exports.CA_IMPORT_FAIL_LOG_NAME = "CA_import_fail.log";
exports.CA_IMPORT_FAIL_ERROR_REPORT_FOLDER_NAME = "report";

// Static Asset
// NOTE: must be consistent with the static middleware config in middleware.js
// More Detail: http://loopback.io/doc/en/lb3/Defining-middleware.html#static-middleware
exports.STATIC_ASSET_URL_PREFIX = "/server/assets";
exports.STATIC_ASSET_STORAGE_PATH = process.env.NODE_ENV != 'local' ?
  global.settings.assetStoragePath : (global.appRoot + "server/assets");

//User Avatar
exports.AVATAR_STORAGE_PATH = this.STATIC_ASSET_STORAGE_PATH + "/avatar/";
exports.AVATAR_IMAGE_SIZE = 50;
exports.AVATAR_URL_PREFIX = this.STATIC_ASSET_URL_PREFIX + "/avatar/";

//Retry Data Check
exports.DATA_CHECK_MAX_TRIES = 20;
exports.DATA_CHECK_INTERVAL = 2000;

exports.DATA_CHECK_TRANS_MAX_TRIES = 400;
exports.DATA_CHECK_TRANS_INTERVAL = 100;
