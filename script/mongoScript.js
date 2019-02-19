/* NOTE: the way to run this script:
  mongo < mongoScript.js
*/

// Relations
// RENAME

// "1 geography -> geographies (foreignKey: LOCATEDIN_Geography_id -> geographyList)
// 2 businessUnit -> businessUnits (foreignKey: PARTOF_BusinessUnit_id -> businessUnitList)
// 3 userPreference -> preference (foreignKey: INCLUDEPREF_UserPreference_id -> userPreference, type: referencesMany -> embedsOne)"


// "5 owner (foreignKey: INCLUDEOWNER_CAUser_id -> teamOwner, type: referencesMany -> belongsTo)
// 6 viewMembers (foreignKey: VIEWMEMBERS_CAUser_id -> viewMemberList)
// 7 editMembers (foreignKey: EDITMEMBERS_CAUser_id -> editMemberList)"


// 1. copy user related to ca-db-user
// 2. execute following scripts in ca-db-user


//Migratre-1.2
// use ca-db;
//
// db.getSiblingDB('ca-db-user').BusinessUnit.insertMany(db.BusinessUnit.find().toArray() )
// db.getSiblingDB('ca-db-user').CAUser.insertMany(db.CAUser.find().toArray() )
// db.getSiblingDB('ca-db-user').Geography.insertMany(db.Geography.find().toArray() )
// db.getSiblingDB('ca-db-user').Team.insertMany(db.Team.find().toArray() )
// db.getSiblingDB('ca-db-user').UserPreference.insertMany(db.UserPreference.find().toArray() )
// db.getSiblingDB('ca-db-user').Role.insertMany(db.Role.find().toArray() )
// db.getSiblingDB('ca-db-user').RoleMapping.insertMany(db.RoleMapping.find().toArray() )
//
//
// use ca-db-user;
// db.CAUser.update({}, {$rename: {'LOCATEDIN_Geography_id': 'geographyList'}},{multi:true})
// db.CAUser.update({}, {$rename: {'PARTOF_BusinessUnit_id': 'businessUnitList'}},{multi:true})
//
// db.CAUser.find({ INCLUDEPREF_UserPreference_id: {$exists: true, $not:{$size:0}}}).forEach( function(item){
//    db.CAUser.update({_id:item._id},{$set:{'userPreference':item.INCLUDEPREF_UserPreference_id[0]}},{})
// })
// db.CAUser.update({}, {$unset: {'INCLUDEPREF_UserPreference_id': ''} }, { multi: true} )
//
// db.CAUser.update({}, {$rename: {'BOOKMARK_Architecture_id': 'bookmarkedArchList'}},{multi:true})
// db.CAUser.update({ bookmarkedArchList: {$exists: true, $size:0}}, {$unset: {'bookmarkedArchList': ''} }, { multi: true} )
//
// db.Team.find({ INCLUDEOWNER_CAUser_id: {$exists: true, $not:{$size:0}}}).forEach( function(item){
//    db.Team.update({_id:item._id},{$set:{'teamOwner':item.INCLUDEOWNER_CAUser_id[0]}},{})
// })
// db.Team.update({}, {$unset: {'INCLUDEOWNER_CAUser_id': ''} }, { multi: true} )
//
// db.Team.update({}, {$rename: {'VIEWMEMBERS_CAUser_id': 'viewMemberList'}},{multi:true})
// db.Team.update({}, {$rename: {'EDITMEMBERS_CAUser_id': 'editMemberList'}},{multi:true})
//
// db.Team.find({ INCLUDEARCH_Architecture_id: {$exists: true, $not:{$size:0}}}).forEach( function(item){
//    db.Team.update({_id:item._id},{$set:{'teamArch':item.INCLUDEARCH_Architecture_id[0]}},{})
// })
// db.Team.update({}, {$unset: {'INCLUDEARCH_Architecture_id': ''} }, { multi: true} )
//
// //if these scripts executed in ca-db, then should stop neo4j doc manager first
// db.CAUser.update({}, {$unset: {INCLUDELABEL_Label_id: ''}}, {multi:true})
// //some neo4j operations to add userId to Label


//Migrate-1.3
use ca-db-user;

db.Team.find({ teamOwner: {$exists: true}}).forEach( function(item){
    db.Team.update({_id:item._id},{$set: {teamPenInfo: {refreshDate: ISODate("2016-01-01"), teamPenHolder: item.teamOwner}}}, { multi: true})
})

db.Team.update({}, {$rename: {'pendingMemberList': 'pendingViewMemberList'}},{multi:true})

//Initiate ACL in Mongodb  -- Depricated
// db.ACL.insert({
//     "_id" : ObjectId("5b25055145a61734ce038641"),
//     "model" : "AccessToken",
//     "property" : "findById",
//     "accessType" : "READ",
//     "permission" : "ALLOW",
//     "principalType" : "ROLE",
//     "principalId" : "$owner"
// })