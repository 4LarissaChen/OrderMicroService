require('events').EventEmitter.prototype._maxListeners = 0;
var loopback = require('loopback');
var app = require('../server');
var expect = require('chai').expect;
var apiUtils = require('../utils/apiUtils');
var migrationUtils = require('../utils/dataMigrationUtils.js');
var neo4jUtils = require('../../server/utils/neo4jUtils.js');
var ArchitectureService = require('../../common/models/apimodel/architecture/internalService/ArchitectureService');
var Promise = require('bluebird');
var moment = require('moment');

describe('Migration 1.3', function (done) {

  //step 0. 处理重名OMLocations
  describe('#handleDuplicateOMLocations()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicateNameOMLocations().then(result => {
        var promiseArray = [];
        result.forEach(r => {
          var indexMap = {};
          r.locs.forEach(loc => {
            if (!indexMap[loc.properties.name]) {
              indexMap[loc.properties.name] = 1;
            } else {
              let name = loc.properties.name + "(" + indexMap[loc.properties.name].toString() + ")";
              indexMap[loc.properties.name] += 1;
              promiseArray.push(architectureService.updateOMLocationName(r.arch.properties._id, loc.properties._id, name));
            }
          })
        })
        return Promise.all(promiseArray);
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })


  //step 1. 处理PN中的LN，保证LN只属于一个PN
  describe('#handleDuplicateLNsByPN()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicateLNsByPN().then(result => {
        var elementArray = [];
        result.forEach(r => {
          if (elementArray.find(element => element.en.properties._id == r.en.properties._id))
            return;
          elementArray.push(r);
        });
        return Promise.map(result, res => {
          if (elementArray.find(element => element.sn.properties._id == res.sn.properties._id && element.en.properties._id == res.en.properties._id))
            return Promise.resolve();
          return architectureService.handleDumplicateRel(res);
        })
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 2. 处理PN中的PN，保证PN只属于一个PN
  describe('#handleDuplicatePNsByPN()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicatePNsByPN().then(result => {
        var elementArray = [];
        result.forEach(r => {
          if (elementArray.find(element => element.en.properties._id == r.en.properties._id))
            return;
          elementArray.push(r);
        });
        return Promise.map(result, res => {
          if (elementArray.find(element => element.sn.properties._id == res.sn.properties._id && element.en.properties._id == res.en.properties._id))
            return Promise.resolve();
          return architectureService.handleDumplicateRel(res);
        })
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 3. 处理OMLocation中的PN，保证PN只属于一个OMLocation
  describe('#handleDuplicatePNsByLoc()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicatePNsByLoc().then(result => {
        var elementArray = [];
        result.forEach(r => {
          if (elementArray.find(element => element.en.properties._id == r.en.properties._id))
            return;
          elementArray.push(r);
        });
        return Promise.map(result, res => {
          if (elementArray.find(element => element.sn.properties._id == res.sn.properties._id && element.en.properties._id == res.en.properties._id))
            return Promise.resolve();
          return architectureService.handleDumplicateRel(res);
        })
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 4. 处理挂在POM下的PN，保证只属于一个POM
  describe('#handleDuplicatePNsByPOM()', function () {
    this.timeout(36000000);
    it.only('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicatePNsByPOM().then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 5. 处理挂在OMLocation下的Actor，保证Actor只属于一个OMLocation
  describe('#handleDuplicateActorsByLoc()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicateActorsByLoc().then(result => {
        var elementArray = [];
        result.forEach(r => {
          if (elementArray.find(element => element.en.properties._id == r.en.properties._id))
            return;
          elementArray.push(r);
        });
        return Promise.map(result, res => {
          if (elementArray.find(element => element.sn.properties._id == res.sn.properties._id && element.en.properties._id == res.en.properties._id))
            return Promise.resolve();
          return architectureService.handleDumplicateRel(res);
        })
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 6. 处理挂在POM/LOM下的Actor，保证只属于一个instance
  describe('#handleDuplicateActorsByIns()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.deleteDuplicateActorsByIns().then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 7. 处理挂在OMLocation下的LN，确保只属于一个OMLocation
  describe('#handleDuplicateLNsByLoc()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicateLNsByLoc().then(result => {
        var elementArray = [];
        result.forEach(r => {
          if (elementArray.find(element => element.en.properties._id == r.en.properties._id))
            return;
          elementArray.push(r);
        });
        return Promise.map(result, res => {
          if (elementArray.find(element => element.sn.properties._id == res.sn.properties._id && element.en.properties._id == res.en.properties._id))
            return Promise.resolve();
          return architectureService.handleDumplicateRel(res);
        })
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 8. 处理直接挂在LOM下的LN，确保只属于一个instance
  describe('#handleDuplicateLNsByIns()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getDuplicateLNsByIns().then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 9. remove UI
  describe('#handUIs()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getUIByLoc().then(results => {
        var promiseArray = [];
        results.forEach(result => {
          result.nodeRel.forEach(rel => {
            if ((rel.properties.instanceId.indexOf("lom") != -1 || rel.properties.instanceId.indexOf("pom") != -1) && !result.locRel.find(r => r.properties.instanceId == rel.properties.instanceId))
              promiseArray.push(architectureService.deleteUI(result.node, rel));
          });
        });
        return Promise.all(promiseArray);
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 10.1 handel connections only have fromNode/toNode
  describe('#handleInvalidConnections()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getInvalidConnections().then(results => {
        return Promise.map(results, result => {
          if (result.nodes.length >= 2)
            return Promise.resolve();
          return architectureService.deleteConnections(result.conn, null);
        });
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 10.2 handle connections
  describe('#handleConnectionUIs()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getConnections().then(results => {
        return Promise.map(results, result => {
          result.connUIIds.forEach(id => {
            if (result.instanceIds.indexOf(id) != -1)
              return Promise.resolve();
            return architectureService.deleteConnections(result.conn, id);
          });
        });
      }).then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })

  //step 10.3 delete connections across graphs
  describe('#deleteConnectionsAcrossGraphs()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.deleteConnectionsAcrossGraphs().then(result => {
        return transaction.commit();
      }).then(result => {
        console.log("-----Process Completed-----")
        expect(result).to != undefined;
        done();
      }).catch(err => {
        transaction.rollback();
        done(err);
      }).finally(() => {
        session.close();
      });
    })
  })



  //step 11. migrate Geo
  describe('#migrationElementGeo()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      architectureService.getAllOMLocation().then(results => {
        return Promise.each(results, elements => {
          if (elements.length == 0) return Promise.resolve();
          elements.forEach(element => {
            if (element.childrenUI.parent == element.parentUI.id) return Promise.resolve(true);
            element.childrenUI.parent = element.parentUI.id;
            if (element.childrenUI.geo && element.parentUI.geo) {
              var cGeo = JSON.parse(element.childrenUI.geo);
              var pGeo = JSON.parse(element.parentUI.geo);
              cGeo.x = cGeo.x - pGeo.x;
              cGeo.y = cGeo.y - pGeo.y;
              element.childrenUI.geo = JSON.stringify(cGeo);
            }
            return architectureService.updateOMLocationUI(element.childrenUI);
          })
        }).then(result => {
          return transaction.commit();
        }).then(result => {
          console.log("-----Element Geo Migration Completed-----")
          expect(result).to != undefined;
          done();
        }).catch(err => {
          transaction.rollback();
          done(err);
        }).finally(() => {
          session.close();
        });
      })
    });
  })

  // step 12 UTC issue
  describe('#migrationLastModifiedToUTC()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getLastModified()
        .then(result => {
          return Promise.map(result, res => {
            res.properties.lastModified = moment(res.properties.lastModified).utc().format();
            return architectureService.updateLastModified(res.properties._id, res.labels[0], res.properties.lastModified);
          })
        }).then(() => {
          return transaction.commit();
        }).then(result => {
          console.log("-----UTC Migration Completed-----")
          expect(result).to != undefined;
          done();
        }).catch(err => {
          transaction.rollback();
          done(err);
        }).finally(() => {
          session.close();
        });
    });
  });

  describe('#migrationCreatedToUTC()', function () {
    this.timeout(36000000);
    it('should return true.', function (done) {
      var session = neo4jUtils.getSession();
      var transaction = session.beginTransaction();
      var architectureService = new ArchitectureService(transaction);
      return architectureService.getCreated()
        .then(result => {
          return Promise.map(result, res => {
            res.properties.created = moment(res.properties.created).utc().format();
            return architectureService.updateCreated(res.properties._id, res.labels[0], res.properties.created);
          })
        }).then(() => {
          return transaction.commit();
        }).then(result => {
          console.log("-----UTC Migration Completed-----")
          expect(result).to != undefined;
          done();
        }).catch(err => {
          return transaction.rollback().then(() => done(err));
        }).finally(() => {
          session.close();
        });
    });
  });
})