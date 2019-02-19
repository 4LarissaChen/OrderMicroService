'use strict';

//CAUser Constant
exports.CAUSER_ROLE_APPOWNER = "AppOwner";
exports.CAUSER_ROLE_SPONSOR = "Sponsor";
exports.CAUSER_ROLE_ARCHITECT = "Architect";
exports.CAUSER_ROLE_ASSETOWNER = "AssetOwner";
exports.CAUSER_ROLE_ARCHOWNER = "ArchOwner";
exports.CAUSER_ROLE_TEAMMEMBER = "TeamMember";

//Asset Artifact Type
exports.ASSETARTIFACT_EXECUTIVE_SUMMARY = "1";
exports.ASSETARTIFACT_BUSINESS_CHALLENGE = "2";
exports.ASSETARTIFACT_SYSTEM_CONTEXT = "3";
exports.ASSETARTIFACT_USE_CASE = "4";
exports.ASSETARTIFACT_FUNCTIONAL_REQUIREMENT = "5";
exports.ASSETARTIFACT_NON_FUNCTIONAL_REQUIREMENT = "6";
exports.ASSETARTIFACT_AODSERVICES = "7";
exports.ASSETARTIFACT_AODENTERPRISE = "8";
exports.ASSETARTIFACT_AODITSYSTEM = "9";
exports.ASSETARTIFACT_AODUSAGESCENARIO = "10";
exports.ASSETARTIFACT_ARCHITECTURAL_DESCISION = "11";
exports.ASSETARTIFACT_CM_STATIC_VIEW = "12";
exports.ASSETARTIFACT_CM_DYNAMIC_VIEW = "14";
exports.ASSETARTIFACT_LOM_VIEW = "15";
exports.ASSETARTIFACT_NOTES = "17";

exports.ASSETARTIFACT_EXECUTIVE_SUMMARY_TYPE = "assetartifact_executivesummary";
exports.ASSETARTIFACT_BUSINESS_CHALLENGE_TYPE = "assetartifact_businesschallenge";
exports.ASSETARTIFACT_SYSTEM_CONTEXT_TYPE = "assetartifact_systemcontext";
exports.ASSETARTIFACT_USE_CASE_TYPE = "assetartifact_usecase";
exports.ASSETARTIFACT_FUNCTIONAL_REQUIREMENT_TYPE = "assetartifact_functionalrequirement";
exports.ASSETARTIFACT_NON_FUNCTIONAL_REQUIREMENT_TYPE = "assetartifact_nonfunctionalrequirement";
exports.ASSETARTIFACT_AODSERVICES_TYPE = "assetartifact_architectureoverview_aodservice";
exports.ASSETARTIFACT_AODENTERPRISE_TYPE = "assetartifact_architectureoverview_enterprise";
exports.ASSETARTIFACT_AODITSYSTEM_TYPE = "assetartifact_architectureoverview_itsystem";
exports.ASSETARTIFACT_AODUSAGESCENARIO_TYPE = "assetartifact_architectureoverview_usagescenario";
exports.ASSETARTIFACT_ARCHITECTURAL_DESCISION_TYPE = "assetartifact_architecturedecision";
exports.ASSETARTIFACT_CM_STATIC_VIEW_TYPE = "assetartifact_componentmodel_staticview";
exports.ASSETARTIFACT_CM_DYNAMIC_VIEW_TYPE = "assetartifact_componentmodel_dynamicview";
exports.ASSETARTIFACT_ARCHITECTURE_PRINCIPLE_TYPE = "assetartifact_architecture_principles";
exports.ASSETARTIFACT_RAID_RISK_TYPE = "assetartifact_risk";
exports.ASSETARTIFACT_RAID_ISSUE_TYPE = "assetartifact_issue";
exports.ASSETARTIFACT_RAID_DEPENDENCY_TYPE = "assetartifact_dependency";
exports.ASSETARTIFACT_RAID_ASSUMPTION_TYPE = "assetartifact_assumption";
exports.ASSETARTIFACT_LOM_VIEW_TYPE = "assetartifact_operationalmodel_logicaloperational"
exports.ASSETARTIFACT_NOTES_TYPE = "assetartifact_notes";

//Use Case Association Type
exports.ASSOCIATIONTYPE_INITIATEDBY = "initiated by";
exports.ASSOCIATIONTYPE_SUPPORTEDBY = "supported by";

/**** Arch Property Values***/
exports.ARCHITECTURE_STATUS_SUPPORTED_TYPES = ["Pending", "Submitted", "Published"];
exports.ARCHITECTURE_STATUS_PENDING = "Pending";
exports.ARCHITECTURE_STATUS_SUBMITTED = "Submitted";
exports.ARCHITECTURE_STATUS_PUBLISHED = "Published";

exports.ARCHITECTURE_SUPPORTED_TYPES= ["Reference", "Solution", "Pattern"];
exports.ARCHITECTURE_TYPE_REFERENCE = "Reference";
exports.ARCHITECTURE_TYPE_SOLUTION = "Solution";
exports.ARCHITECTURE_TYPE_PATTERN = "Pattern";

/****NFR Property Values***/
exports.NFR_PRIORITY_SUPPORTED_TYPES = ["Critical", "Desirable", "Optional"];
exports.NFR_PRIORITY_CRITICAL = "Critical";
exports.NFR_PRIORITY_DESIRABLE = "Desirable";
exports.NFR_PRIORITY_OPTIONAL = "Optional";
exports.NFR_THEME_SUPPORTED_TYPES = ["Performance", "Volumetrics", "Scalability", "Security", "Regulatory Compliance", "Usability", "Maintainability", "Availability", "Manageability", "Environmental"];

/****LogicalComponent Property Values***/
exports.LOGICALCOMPONENT_LEVEL_APPLICATION = "Application";
exports.LOGICALCOMPONENT_LEVEL_IT = "IT";

/****Actor  Property Values***/
exports.REUSED_ACTOR_TYPES = ["Human", "IT System"];
exports.REUSED_ACTOR_TYPE_HUMAN = "Human";
exports.REUSED_ACTOR_TYPE_ITSYSTEM = "IT System";

/****Connector Property Values***/
exports.CONNECTOR_TYPE_TYPES = ["function", "connection mechanism", "data interface", "list of use cases"];
exports.CONNECTOR_TYPE_TYPE_FUNCTION = "function";
exports.CONNECTOR_TYPE_TYPE_CONNECTION_MECHANISM = "connection mechanism";
exports.CONNECTOR_TYPE_TYPE_DATA_INTERFACE = "data interface";
exports.CONNECTOR_TYPE_TYPE_LIST_OF_USER_CASES = "list of use cases";

/****AD Property Values***/
exports.AD_STATUS_TYPES = ["proposed","accepted","deprecated","superseded"];
exports.AD_STATUS_TYPE_PROPOSED = "proposed";
exports.AD_STATUS_TYPE_ACCEPTED = "accepted";
exports.AD_STATUS_TYPE_DEPRECATED = "deprecated";
exports.AD_STATUS_TYPE_SUPERSEDED = "superseded";

/****FR Property Values***/
exports.FR_WEIGHTING_TYPES = ["Low", "Medium", "High"];

/****Risk Property Values***/
exports.RISK_IMPACT_TYPES = ["Low", "Medium", "High"];
exports.RISK_PROBABILITY_TYPES = ["Low", "Medium", "High"];

/****ASSUMPTION Property Values***/
exports.ASSUMPTION_IMPACT_TYPES = ["Low", "Medium", "High"];
exports.ASSUMPTION_CONFIDENCELEVEL_TYPES = ["Low", "Medium", "High"];

/****Issue Property Values***/
exports.ISSUE_PRIORITY_TYPES = ["Low", "Medium", "High"];

/**** Comment Rel Values***/
exports.COMMENT_SCOPE_TYPES = ["Private", "Public"];
exports.COMMENT_SCOPE_PRIVATE = "Private";
exports.COMMENT_SCOPE_PUBLIC = "Public";

/**** CM Static View Property Values***/
exports.CM_STATIC_TYPE_TYPES = ["Component Relationship Diagram", "Entity Class Diagram", "Component Specification Diagram"];

/**** CM Dynamic View Property Values***/
exports.CM_DYNAMIC_TYPE_TYPES = ["Component Interaction Diagram"];


/****DU Property Values  -- Not Implemented***/
exports.DU_TYPE_TYPES = ["Executable", "Installation", "Presentation", "Data"];
exports.DU_LEVEL_TYPES = ["Technical", "Application"];

/****LogicalConnection Property Values***/
exports.LOGICAL_CONNECTION_FLOWTYPE_TYPES = ["Pipe","LAN-wired","LAN-wireless","WAN-wired","WAN-wireless","VPN","Not Set"];

/**** PhysicalNode Property Values***/
exports.PYSICALNODE_OFFERING_TYPES = ["N/A", "Managed", "Hosted", "Infrastructure ONLY", "Custom", "On-premis", "Web based"];
exports.PYSICALNODE_PROVISION_TYPES = ["N/A", "Delivered by Analytics", "Delivered by Cloud", "Delivered by Lab Services", "User Managed", "GTS/GBS"]
exports.PYSICALNODE_TYPE_TYPES = ["Physical", "Virtual", "Container"]

/**** PhysicalConnection Property Values***/
exports.PYSICALCONNECTION_TYPE_TYPES = ["Point-point", "Multi-point"];


//AOD Usage Scenario Type
exports.AOD_US_TYPES = ["Node", "Component", "Actor"];
exports.AOD_US_TYPE_NODE = "Node";
exports.AOD_US_TYPE_COMPONENT = "Component";
exports.AOD_US_TYPE_ACTOR = "Actor";

//Association Type
exports.REUSED_ASSOCIATION_TYPES = ["initiated by", "supported by"];
exports.REUSED_ASSOCIATION_TYPE_INITIATEDBY = "initiated by";
exports.REUSED_ASSOCIATION_TYPE_SUPPORTEDBY = "supported by";

//Arrow Direction / Style
exports.ARROW_DIRECTION_TYPES = ["none", 'to', 'from', 'both'];

// change impact in fr to text and optional
//FR Impact Type
// exports.FR_IMPACT_TYPES = ["Low", "Medium", "High"];



//Team Member Permission Type
exports.TEAMMEMBER_PERMISSION_TYPES = ["ReadOnly", "Edit"];
exports.TEAMMEMBER_PERMISSION_READONLY = "ReadOnly";
exports.TEAMMEMBER_PERMISSION_EDIT = "Edit";


exports.NODE_ENVS = ['prod', 'staging', 'development', 'test'];


exports.ARTIFACT_API_MAPPING = {
  "assetartifact_executivesummary": "ExecutiveSummaryArtifactAPI",
  "assetartifact_businesschallenge": "BusinessChallengeArtifactAPI",
  "assetartifact_systemcontext": "SystemContextArtifactAPI",
  "assetartifact_functionalrequirement": "FunctionalRequirementArtifactAPI",
  "assetartifact_usecase": "UseCaseArtifactAPI",
  "assetartifact_nonfunctionalrequirement": "NonFunctionalRequirementArtifactAPI",
  "assetartifact_architectureoverview_aodservice": "AODServicesArtifactAPI",
  "assetartifact_architectureoverview_enterprise": "AODEnterpriseArtifactAPI",
  "assetartifact_architectureoverview_itsystem": "AODITSystemArtifactAPI",
  "assetartifact_architectureoverview_usagescenario": "AODUsageScenarioArtifactAPI",
  "assetartifact_architecturedecision": "ArchitecturalDecisionArtifactAPI"
}

exports.ARTIFACT_REUSEELEMENTS_MAP = {
  "assetartifact_systemcontext": ['Actor', 'TargetSystem'],
  "assetartifact_functionalrequirement": ['LogicalComponent'],
  "assetartifact_usecase": ['Actor', 'TargetSystem'],
  "assetartifact_architectureoverview_aodservice": ['LogicalComponent', 'PhysicalComponent', 'NonFunctionalRequirement', 'ArchitecturalDecision'],
  "assetartifact_architectureoverview_enterprise": ['LogicalComponent', "Actor", 'PhysicalComponent'],
  "assetartifact_architectureoverview_itsystem": ['LogicalNode', 'DU', 'LogicalComponent', 'PhysicalComponent', 'NonFunctionalRequirement', 'ArchitecturalDecision'],
  "assetartifact_architectureoverview_usagescenario": ['ArchitecturalDecision', 'NonFunctionalRequirement'],
  "assetartifact_componentmodel_staticview": ['Actor', 'LogicalComponent', 'PhysicalComponent', 'NonFunctionalRequirement', 'ArchitecturalDecision'],
  "assetartifact_componentmodel_dynamicview": ['Actor', 'LogicalComponent', 'PhysicalComponent', 'NonFunctionalRequirement', 'ArchitecturalDecision', 'UseCase'],
  "assetartifact_operationalmodel_logicaloperational": ['Actor', 'LogicalNode', 'DU', 'LogicalComponent', 'PhysicalComponent', 'NonFunctionalRequirement', 'ArchitecturalDecision']
}

exports.CAUSER_DEFAULT_PWD = "congnitive_architect";

exports.WEAK_REFERENCE = ["REF", "DISABLED"];
exports.DEPENDENT_REFERENCE_ARTIFACT_ELEMENT = ["UsageStep"];
exports.DEPENDENT_REFERENCE_ARTIFACT_INSTANCE = ["AODUsageScenario"];

// Data of these models will not be copied or deleted in Architecture/Artifact CRUD operations
exports.STATIC_DATA_MODEL = [
  'AssetArtifactType',
  'BusinessCapability',
  'BusinessUnit',
  'Geography',
  'Industry',
  'Tag',
  'TechnicalCapability',
  'Technology'
];
exports.USER_RELATED_DATA_MODEL = [
  'CAUser',
  'Client',
  'Comment',
  'Architecture'
];
exports.REUSED_DATA_MODEL = [
  'LogicalNode',
  'DU',
  'LogicalComponent',
  'PhysicalComponent',
  'Actor',
  'Label',
  'TargetSystem',
  'UseCase'
];
exports.UNIQUE_ACROSS_ARCH_ELEMENT = [
  'Actor', 'LogicalComponent', 'PhysicalComponent', 'DU', 'LogicalNode'
];
exports.UNIQUE_ACROSS_INSTANCE_ELEMENT = [
  'SubSystem'
];