'use strict';
var regexConstants = require('../../../server/constants/regexConstants.js');
var artifactConstants = require('../../../server/constants/artifactConstants.js');
var nodeUtil = require('util');
var arrayUtils = require('../../../server/utils/arrayUtils');
var loopback = require("loopback");
var apiConstants = require('../../../server/constants/apiConstants.js');

module.exports = function(Model, options) {

  if (options._id) {
    Model.validatesLengthOf("_id", {max: 128, message: {
      max: nodeUtil.format(apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH, "id", 128)
    }});
  }

  if (options.copiedArchId) {
    Model.validatesLengthOf("copiedArchId", {max: 128, message: {
      max: nodeUtil.format(apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH, "copiedArchId", 128)
    }});
  }

  if (options.name) {
    Model.validatesLengthOf("name", {max: 128, message: {
      max: nodeUtil.format(apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH, "name", 128)
    }});
  }

  if (options.type) {
    Model.validatesInclusionOf("type", {
      in: artifactConstants.ARCHITECTURE_SUPPORTED_TYPES,
      message: nodeUtil.format(
        apiConstants.ERROR_STACK_MUST_IN,
        'Architecture type',
        artifactConstants.ARCHITECTURE_SUPPORTED_TYPES
      )
    });
  }

  if (options.status) {
    Model.validatesInclusionOf("status", {
      in: artifactConstants.ARCHITECTURE_STATUS_SUPPORTED_TYPES,
      message: nodeUtil.format(
        apiConstants.ERROR_STACK_MUST_IN,
        'Architecture status type',
        artifactConstants.ARCHITECTURE_STATUS_SUPPORTED_TYPES
      )
    });
  }

  if (options.clientName) {
    Model.validate("clientName", function(err) {
      if (this.clientName && this.clientName.length > 128) {
        return err();
      }
    }, {
      message: nodeUtil.format(
        apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH,
        options.clientName, 128
      )
    });
  }


  if (options.salesConnectNum) {
    Model.validate("salesConnectNum", function(err) {
        if (this.salesConnectNum && this.salesConnectNum.length > 20) {
            return err();
        }
    }, {
        message: nodeUtil.format(
            apiConstants.ERROR_STACK_EXCEED_MAX_LENGTH,
            options.salesConnectNum, 20
        )
    });
  }

  if (options.tags) {
    var TagAPI = loopback.findModel("TagAPI");
    TagAPI.getSupportedTags().then(function(supportedTags){
        Model.validate("tags", function(err) {
          if (!this.tags) return;
          if (!arrayUtils.isContained(supportedTags, this.tags)) return err();
          return;
        },
        {message: nodeUtil.format(
            apiConstants.ERROR_STACK_MUST_IN,
            'Tag',
            supportedTags
        )});
    })


  }


  if (options.industries) {
    var IndustryAPI = loopback.findModel("IndustryAPI");
    IndustryAPI.getSupportedIndustries().then(function(supportedIndustries){
        Model.validate("industries", function(err) {
            if (!this.industries) return;
            if (!arrayUtils.isContained(supportedIndustries, this.industries)) return err();
            return;
        },
        {message: nodeUtil.format(
            apiConstants.ERROR_STACK_MUST_IN,
            'Industry',
            supportedIndustries
        )});
    })
  }


  if (options.technologies) {
    var TechnologyAPI = loopback.findModel("TechnologyAPI");

    TechnologyAPI.getSupportedTechnologies().then(function(supportedTechnologies){
      Model.validate("technologies", function(err) {
            if (!this.technologies) return;
            if (!arrayUtils.isContained(supportedTechnologies, this.technologies)) return err();
            return;
        },

        {message: nodeUtil.format(
            apiConstants.ERROR_STACK_MUST_IN,
            'Technology',
            supportedTechnologies
        )});
    })
  }

  if (options.businessCapabilities) {
    var BusinessCapabilityAPI = loopback.findModel("BusinessCapabilityAPI");

    BusinessCapabilityAPI.getSupportedBusinessCapabilities().then(function(supportedBusinessCapabilities) {
        Model.validate("businessCapabilities", function (err) {
                if (!this.businessCapabilities) return;
                if (!arrayUtils.isContained(supportedBusinessCapabilities, this.businessCapabilities)) return err();
                return;
            },

            {
                message: nodeUtil.format(
                    apiConstants.ERROR_STACK_MUST_IN,
                    'BusinessCapability',
                    supportedBusinessCapabilities
                )
            });
    });
  }


  if (options.technicalCapabilities) {
    var TechnicalCapabilityAPI = loopback.findModel("TechnicalCapabilityAPI");
    TechnicalCapabilityAPI.getSupportedTechnicalCapabilities().then(function(supportedTechnicalCapabilities) {
        Model.validate("technicalCapabilities", function (err) {
                if (!this.technicalCapabilities) return;
                if (!arrayUtils.isContained(supportedTechnicalCapabilities, this.technicalCapabilities)) return err();
                return;
            },

            {
                message: nodeUtil.format(
                    apiConstants.ERROR_STACK_MUST_IN,
                    'TechnicalCapability',
                    supportedTechnicalCapabilities
                )});

    });
  }

}
