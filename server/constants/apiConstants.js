'use strict';

/**
 * API Response Error Code
 */
exports.ERROR_CODE_INVALID_INPUT_PARAMETERS = 400;
exports.ERROR_CODE_NOT_AUTHORIZED = 401;
exports.ERROR_CODE_FORBIDDEN = 403;
exports.ERROR_CODE_NO_MODEL_FOUND = 404;
exports.ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

/**
 * API Response Error Name
 */
exports.ERROR_NAME_INVALID_INPUT_PARAMETERS = "Invalid Input Parameters";


/**
 * Transaction Status
 */
exports.TRANS_STATE_INITIAL = 'initial';
exports.TRANS_STATE_PENDING = 'pending';
exports.TRANS_STATE_COMMITED = 'committed';
exports.TRANS_STATE_DONE = 'done';

/**
 * API Response Error Message
 */
// Common Error Message
exports.ERROR_MESSAGE_NO_MODEL_FOUND_WITH_ID = "The target %s %s is not found";
exports.ERROR_MESSAGE_NO_MODEL_FOUND = "The target %s is not found";   // e.g. The Architecture is not found
exports.ERROR_MESSAGE_ONE_OR_MORE_MODEL_FOUND = "One or more %s are not found";   // e.g. One or more team members are not found
exports.ERROR_MESSAGE_ARTIFACT_EXISTED = "The target Architecture already has a/an %s Artifact"; // e.g. Target Architecture already has UseCase Artifact
exports.ERROR_MESSAGE_NAME_UNIQUE = "%s's name must be unqiue. `%s` already exists";    // e.g. Actor's name must be unqiue, `Bank` already exists
exports.ERROR_MESSAGE_DIAGRAM_NAME_UNIQUE = "Diagram's name of %s must be unqiue across the Architecture";    // e.g. Diagram's name of System must be unqiue across the Architecture
exports.ERROR_MESSAGE_ID_UNIQUE = "%s's id must be unqiue, `%s` already exists"; // e.g. UseCase's id must be unqiue, `uc-001` already exists
exports.ERROR_MESSAGE_ARTIFACT_TYPE_NOT_SUPPORTED = "The AssetArtifact's type `%s` is not supported"; // e.g. The AssetArtifact's type `assetartifact_aod` is not supported
exports.ERROR_MESSAGE_INPUT_NOT_FOUND = "Input %s '%s' in not found."  //e.g.Input model 'TeamPI' is not found.
// Data Sync Error Message
exports.ERROR_MESSAGE_UIMODEL_COREMODEL_NOT_SYNC = "In the UI Model, the coreModelType and coreModelId are not valid";
exports.ERROR_MESSAGE_DATA_NOT_SYNC = "Data has not been synchronized yet";

// User Error Message
exports.ERROR_MESSAGE_USER_EMAIL_EXISTED = "The user email already exists";
exports.ERROR_MESSAGE_USER_EMAIL_NOT_EXISTED = "The user email is not found";

// Architecture Error Message
exports.ERROR_MESSAGE_ARCH_NAME_DUPLICATED = "The architecture name already exists";
exports.ERROR_MESSAGE_ARCH_OWNED_BY_OTHERS = "The architecture name already be used by other user";
exports.ERROR_MESSAGE_ARCH_NOT_ONWED = "The architecture is not owned by this user";
exports.ERROR_MESSAGE_ARCH_NOT_SHARED = "The architecture is not shared by this user";
exports.ERROR_MESSAGE_ARCH_HAS_BEEN_BOOKMARKED = "The architecture has been bookmared by this user";
exports.ERROR_MESSAGE_ARCH_HAS_NOT_BEEN_BOOKMARKED = "The architecture has not been bookmared by this user";
exports.ERROR_MESSAGE_ARCH_HAS_PUBLISHED = "The architecture has been published";
exports.ERROR_MESSAGE_ARCH_HAS_REJECTED = "The architecture has been rejected";
exports.ERROR_MESSAGE_ARCH_NOT_READY_PUBLISHED = "Only Submitted Architecture can be published";
exports.ERROR_MESSAGE_ARCH_NOT_READY_REJECTED = "Only Submitted Architecture can be rejected";
exports.ERROR_MESSAGE_STATIC_DATA_FILE_NOT_FOUND = "Some of static files are not found";

// Dashboard Erro Message
exports.ERROR_MESSAGE_DASH_NO_RESULT = 'There is no import found at this time';


// AOD Usage Scenario Error Message
exports.ERROR_MESSAGE_AODUS_REFERENCE_REQUIRED = "AODUsageScenario must reference an AODServices, AODITSystem or AODEnterprise";
exports.ERROR_MESSAGE_AODUS_REFERENCE_ONLY_ONE = "AODUsageScenario can only reference one AODServices, AODITSystem or AODEnterprise";

// AOD Enterprise Error Message
exports.ERROR_MESSAGE_AODENT_LC_REFERENCE_NOT_FOUND = "The referenced LogicalComponent `%s` not found. It is not included in `%s`";
exports.ERROR_MESSAGE_AODENT_LC_REFERENCE_NOT_USED = "The referenced LogicalComponent `%s` must be one of `channel, appService, or resource`";

//Team Error Message
exports.ERROR_MESSAGE_TEAM_MEMBER_EXIST = "The team member %s already exists";
exports.ERROR_MESSAGE_TEAM_MEMBER_EMPTY = "The team members can not be empty";
exports.ERROR_MESSAGE_TEAM_MEMBER_DUPLICATE = "The team members name %s are duplicate";
exports.ERROR_MESSAGE_TEAM_MEMBER_CAN_NOT_BE_OWNER = "The team member email %s can not be the same with owner email";
/**
 * API Parameter Validation Error Stack
 */
// Common Error Stack
exports.ERROR_STACK_DUPLICATED_REFERENCE = "Instance duplicated: `%s` contains duplicated reference `%s` ";  // e.g. Instance duplicated: `initiatedByActors` contains duplicated reference `actor01`
exports.ERROR_STACK_REFERENCED_INSTANCE_NOT_USED = "Instance not referenced: request `%s` is not used"; // e.g. Instance not referenced: request `actor02` is not referenced
exports.ERROR_STACK_REFERENCED_INSTANCE_NOT_FOUND = "The referenced %s in %s is not found: The referenced request `%s` may not exist"; // e.g. The referenced Actor in SystemContext is not found: the referenced request `actor03` may not exist
exports.ERROR_STACK_EXCEED_MAX_LENGTH = "%s exceeds the maximun length of %d";  // name exceeds the maximun length of 128
exports.ERROR_STACK_INVALID_NAMING = "%s must start with a letter or number, contain no special characters, " +
  "and require length to be less than 64";  // e.g. The id of UseCase must start with a letter or number, contain no special characters, and require length to be less than 64
exports.ERROR_STACK_MUST_IN = "%s must be in [%s]";  // e.g. AD Status type must be in [proposed,accepted,deprecated,superseded]
exports.ERROR_STACK_ONLY_ONE = "A %s can only have one %s"; // e.g. UseCase can only have one targetSystem
exports.ERROR_STACK_POSITIVE_INTEGER_ONLY = "%s in %s must be a positive integer." // e.g. Priority in ArchitecturePrinciple must be a number.

// Connector Error Stack
exports.ERROR_STACK_CONN_FROM_TO_IN_PAIRS = "A %s's start/end points must be in pairs: `%s` can't be blank if `%s` is set"; // e.g. A Connector's start/end points must be in pairs: `CONNECTFROMACTOR_Actor_id` can't be blank if `CONNECTTOTS_TargetSystem_id` is set
exports.ERROR_STACK_CONN_FROM_TO_NOT_FOUND = "%s must have start and end points"; // e.g. A Connector must have start and end points
exports.ERROR_STACK_CONN_FROM_TO_ONLY_ONE = "A %s can only have one pair of start and end points";  // e.g. A Connector can only have one pair of start and end points
exports.ERROR_STACK_CONN_FROM_TO_RESTRICTION = "A %s can only connect between %s in %s";  // e.g. A LogicalConnector can only connect between subSystems in AODServiceInstance
exports.ERROR_STACK_CONN_FROM_TO_TARGET_NOT_FOUND = "Target request of `%s` can not be found in `%s`";  // e.g. Target request of `subsystem-01` can not be found in `subSystems`


//Transformation Error
exports.ERROR_MESSAGE_TRANSFORMATION_FORMAT_NOT_SUPPORTED = "Transformation format is not support";
exports.ERROR_MESSAGE_TRANSFORMATION_MXGRAPH_DATA_DEFICIENT = "MxGraph data is deficient";
exports.ERROR_MESSAGE_TRANSFORMATION_MXGRAPH_DATA_MISSING = "MxGraph data must have modelType";
exports.ERROR_MESSAGE_TRANSFORMATION_MXGRAPH_DATA_INVALID = "MxGraph data format is invalid";
exports.ERROR_MESSAGE_TRANSFORMATION_NEO4J_DATA_INVALID = "Neo4j data format is invalid";