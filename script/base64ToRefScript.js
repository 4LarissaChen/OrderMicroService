'use strict';
var apiUtils = require('../server/utils/apiUtils.js');
var neo4jUtils = require('../server/utils/neo4jUtils.js');
var fs = require('fs');

var fileRoot = "/opt/cafiles/";
var filePath = "/api/FileManagerAPIs/containers/cafiles/files/";

var executeCypherStatement = function (cypher) {
    
    var session = neo4jUtils.getSession();

    return session.readTransaction(transaction => {
        return transaction.run(cypher)
    }).then(neo4jResult => {
        if (neo4jResult.records == null) return null;
        var result = {};
        neo4jResult.records.forEach(record => {
            result[record.get(0)] = record.get(1);
        });
        session.close();
        return result;
    }).catch(err => {
        session.close();
        throw err;
    });
}

var executeWriteCypherStatement = function (cypher) {
    
    var session = neo4jUtils.getSession();

    return session.writeTransaction(transaction => {
        return transaction.run(cypher)
    }).then(neo4jResult => {
        if (neo4jResult.records == null) return null;
        var result = [];
        neo4jResult.records.forEach(record => {
            result.push(record.get(0));
        });
        session.close();
        return result;
    }).catch(err => {
        session.close();
        throw err;
    });;
}

console.time('total-process');

var step = 0;
// 1. process ui
console.time('ui-process');

var cypher = {};

// 1.1 find ui idList which style has base64 codes
cypher = "MATCH (ui:UI) WHERE ui.style CONTAINS \"data:image/\" RETURN ui._id, ui.style";
// cypher = "MATCH (arch:Architecture{_id:\"arch_SyNj7SG17\"}) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) -[*]-> (ui:UI) WHERE ui.style CONTAINS \"data:image/\" RETURN ui._id, ui.style";

var uiNodes = null;
executeCypherStatement(cypher).then(result=>{

    if (result == null || JSON.stringify(result) == "{}") {
        printLog(0, "ui");
        return;
    }
    
    uiNodes = result;
    var counter = 0;
    var written = 0;
    var keyMap = {};
    var fileNameMap = {};
    // 1.2 transform base64 codes to localfile
    for (var i in uiNodes) {
        var fileParams = generateFile(uiNodes[i]);
        if (fileParams == null) {
            continue;
        }
        keyMap[counter] = i;
        fileNameMap[counter] = fileParams.fileName;
        counter++;
        var dataBuffer = fileParams.dataBuffer;
        var fileName = fileParams.fileName;
        fs.writeFile(fileRoot + fileName, dataBuffer, function(err) {
            if(err){
                console.log(err);
                process.exit(1);
            }else{
                // replace style
                var index = uiNodes[keyMap[written]].indexOf("data:image/");
                uiNodes[keyMap[written]] = uiNodes[keyMap[written]].substring(0, index) + filePath + 
                    fileNameMap[written] + uiNodes[keyMap[written]].substring(uiNodes[keyMap[written]].indexOf(";", index));
                written++;
                if (written == counter) {
                    writeUIToNeo4j(uiNodes, 0, keyMap);
                    // tryTerminate();
                }
            }
        });
    }
    console.log("Find base64 ui nodes count: " + counter);
}).catch(err => {
    console.log(err);
    process.exit(1);
});

// 1.3 update style in neo4j
var writeUIToNeo4j = function(uiMap, i, keyMap) {
    if (keyMap[i] != null) {
        var cypher = "MATCH (ui:UI) WHERE ui._id=\"" + keyMap[i] + "\" SET ui.style=\""+ uiMap[keyMap[i]] + "\" RETURN ui._id ";

        executeWriteCypherStatement(cypher).then(result => {
            writeUIToNeo4j(uiMap, i+1, keyMap);
        }).catch(err => {
            console.log(err);
            process.exit(1);
        });
    } else {
        printLog(i, "ui");
    }
}

// 2 process annotation
console.time('annotation-process');

// 2.1 find diagram idList which annotation style has base64 codes
cypher = "MATCH (arch:Architecture) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) -[*]-> (instance) WHERE size(FILTER(x IN instance.annotation WHERE x CONTAINS \"data:image/\")) > 0 RETURN instance._id, instance.annotation";
// cypher = "MATCH (arch:Architecture{_id:\"arch_SyNj7SG17\"}) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) -[*]-> (instance) WHERE size(FILTER(x IN instance.annotation WHERE x CONTAINS \"data:image/\")) > 0 RETURN instance._id, instance.annotation";

executeCypherStatement(cypher).then(result=>{
    
    if (result == null || JSON.stringify(result) == "{}") {
        printLog(0, "annotation");
        return;
    }
    var annotationMap = result;
    var counter = 0;
    var written = 0;
    var keyMap = {};
    var fileNameMap = {};
    // 2.2 transform base64 codes to localfile
    for (var i in annotationMap) {
        if (annotationMap[i].length > 1) {
            for (var j = 1; j < annotationMap[i].length; j++) {
                var fileParams = generateFile(annotationMap[i][j]);
                if (fileParams == null) continue;
                keyMap[counter] = {i: i, j: j};
                fileNameMap[counter] = fileParams.fileName;
                counter++;
                var dataBuffer = fileParams.dataBuffer;
                var fileName = fileParams.fileName;
                fs.writeFile(fileRoot + fileName, dataBuffer, function(err) {
                    if(err){
                        console.log(err);
                        process.exit(0);
                    }else{
                        // replace style
                        var index = annotationMap[keyMap[written].i][keyMap[written].j].indexOf("data:image/");
                        annotationMap[keyMap[written].i][keyMap[written].j] = annotationMap[keyMap[written].i][keyMap[written].j].substring(0, index) + filePath + 
                            fileNameMap[written] + annotationMap[keyMap[written].i][keyMap[written].j].substring(annotationMap[keyMap[written].i][keyMap[written].j].indexOf(";", index));
                        written++;
                        if (written == counter) {
                            keyMap = [];
                            for (var i in annotationMap) {
                                keyMap.push(i);
                            }
                            writeAnnotationToNeo4j(annotationMap, 0, keyMap);
                            // tryTerminate();
                        }
                    }
                });
            }
        }
    }
    console.log("Find base64 annotation nodes count: " + counter);
}).catch(err => {
    console.log(err);
    process.exit(1);
});

// 2.3 update annotation in neo4j
var writeAnnotationToNeo4j = function(annotationMap, i, keyMap) {
    if (keyMap[i] != null) {
        var cypher = "MATCH (arch:Architecture) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) -[*]-> (instance) WHERE instance._id=\"" + keyMap[i] + "\" SET instance.annotation=["
        for (var j = 0; j < annotationMap[keyMap[i]].length; j++) {
            cypher += "'" + annotationMap[keyMap[i]][j] + "'";
            if (j < annotationMap[keyMap[i]].length - 1) cypher += ",";
        }
        cypher += "] RETURN instance._id"
        executeWriteCypherStatement(cypher).then(result => {
            writeAnnotationToNeo4j(annotationMap, i+1, keyMap);
        }).catch(err => {
            console.log(err);
            process.exit(1);
        });
    } else {
        printLog(i, "annotation");
    }
}

// utils
var generateFile = function(fileString) {
    var index = fileString.indexOf("data:image/") + 11;
    if (index < 11) return null;
    var format = fileString.substring(index, fileString.indexOf(",", index));
    if (format.indexOf('+') > 0) {
        format = format.substring(0, format.indexOf('+'));
    }
    index = fileString.indexOf(",", index) + 1;
    var base64Code = fileString.substring(index, fileString.indexOf(";", index));
    var dataBuffer = new Buffer(base64Code, 'base64');
    var fileName = apiUtils.generateShortId('file') + '.' + format;
    return {fileName: fileName, dataBuffer: dataBuffer};
}

var tryTerminate = function () {
    if (step == 2) {
        console.timeEnd('total-process');
        process.exit(0);
    }
}

var printLog = function(count, type) {
    step++;
        console.log("update " + type + " length:" + count);
        console.timeEnd(type + '-process');
        tryTerminate();
}