/// <reference path="../../public/NwLib/NwLib.js" />
/// <reference path="../../public/lib/underscore/underscore.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        NwLib = require('../../lib/NwLib.js');
        _ = require('underscore');
        Class = NwLib.Nwjsface.Class;

        async = require("async");

        MongoClient = require('mongodb').MongoClient;

    } else {

    }

    //#endregion

    //// Connection url

    var NwDbMgConnection = Class(function () {
        var schema = {}; // Non-strict always, can be left empty

        return {
            dbPath: '',
            allTable: {},
            //dbConn: {},

            constructor: function (dbPath, cb) {
                //var self = this
                this.dbPath = dbPath;
                if (cb) { this.initDB(cb) }
            },

            initDB: function (cb) {
                var self = this;
                MongoClient.connect(this.dbPath, function (err, dbConn) {
                    if (err) console.log(err);
                    self.dbConn = dbConn;
                    if (cb) cb(self);
                });
            },
            _getDB: function (tableName) {
                //var self = this;
                //if (!_.has(this.allTable, tableName)) {
                //    self.allTable[tableName] = self.dbConn.collection(tableName);
                //}
                //return this.allTable[tableName];

                return this.dbConn.collection(tableName);
            },

            getAllTable: function (cb) {
                cb(_.keys(this.allTable));
            },
            count: function (tableName, findObj, cb) {
                var db = this._getDB(tableName);
                db.count(findObj, function (err, count) {
                    cb(count);
                });
            },

            getAll: function (tableName, callback) {

                var db = this._getDB(tableName);

                db.find().toArray(function (err, docs) {
                    if (callback) callback(docs);
                });
            },
            find: function (tableName, query, callback) {
                var db = this._getDB(tableName);

                //console.log(findObj);
                db.find(query).toArray(function (err, docs) {
                    if (callback) callback(docs);
                });

            },
            findOne: function (tableName, query, callback) {

                var db = this._getDB(tableName);
                //console.log(findObj);
                db.findOne(query, function (err, docs) {
                    if (callback) callback(docs);
                });

            },
            findLimit: function (tableName, query, limit, callback) {
                var db = this._getDB(tableName);

                db.find(query).limit(limit).toArray(function (err, docs) {
                    cb(docs);
                });

            },
            findStartWith: function (tableName, query, findObj, limit, callback) {

                var db = this._getDB(tableName);

                //var query = findObjCond; //{ $or: [] };
                query.$or = [];

                for (var i in findObj) {
                    var reg = new RegExp('^' + findObj[i], 'i');
                    //query[i] = { $regex: reg };
                    var qObj = {};
                    qObj[i] = { $regex: reg };

                    query.$or.push(qObj);
                }

                db.find(query)
                    //.sort({ esearch: 1 })
                    .limit(limit).toArray(function (err, docs) {
                        callback(docs);
                    });

            },
            findInPeriod: function (tableName, query, timeField, timeStart, timeEnd, callback) {

                var db = this._getDB(tableName);

                query[timeField] = { $gte: timeStart, $lte: timeEnd };

                db.find(query)
                    //.limit(limit)
                    .toArray(function (err, docs) {
                        callback(docs);
                    });

            },

            findSortOne: function (tableName, query, sortObj, callback) {

                var db = this._getDB(tableName);

                db.find(query).sort(sortObj).limit(1).toArray(function (err, docs) {
                    callback(docs[0]);
                });
            },
            findLastGroup: function (tableName, query, groupField, sortField, callback) {
                console.log('!!!!!!!!! Not impliment yet !!!!!!!');
            },

            findInPeriodStartWithOr: function (tableName, query, findObj, timeField, timeStart, timeEnd, callback) {

                var db = this._getDB(tableName);

                //var query = { $or: [] };
                query.$or = [];

                for (var i in findObj) {
                    var reg = new RegExp('^' + findObj[i], 'i');
                    //query[i] = { $regex: reg };
                    var qObj = {};
                    qObj[i] = { $regex: reg };

                    query.$or.push(qObj);
                }

                query[timeField] = { $gte: timeStart, $lte: timeEnd };

                db.find(query)
                    //.limit(limit)
                    .toArray(function (err, docs) {
                        callback(docs);
                    });
            },
            findInPeriodStartWith: function (tableName, query, findObj, timeField, timeStart, timeEnd, callback) {
                var db = this._getDB(tableName);

                // var query = {};
                for (var i in findObj) {
                    var reg = new RegExp('^' + findObj[i], 'i');
                    query[i] = { $regex: reg };
                }

                query[timeField] = { $gte: timeStart, $lte: timeEnd };

                db.find(query)
                    //.limit(limit)
                    .toArray(function (err, docs) {
                        callback(docs);
                    });
            },

            sumValue: function (tableName, findObj, sumFields, callback) {
                var db = this._getDB(tableName);

                var groupObj = { _id: null }
                _.forEach(sumFields, function (item, id) {
                    groupObj['total_' + item] = { $sum: '$' + item }
                })
                console.log('groupObj', groupObj);
                db.aggregate([
                    { $match: findObj },
                    {
                        $group: groupObj,
                    },
                ]).toArray(function (err, docs) {
                    callback(docs);
                });
            },

            sumValueBefore: function (tableName, findObj, sumFields, timeField, timeEnd, callback) {
                var db = this._getDB(tableName);


                findObj[timeField] = { $lt: timeEnd };

                var groupObj = { _id: null }
                _.forEach(sumFields, function (item, id) {
                    groupObj['total_' + item] = { $sum: '$' + item }
                })

                console.log('groupObj', groupObj);
                db.aggregate([
                    { $match: findObj },
                    {
                        $group: groupObj,
                    },
                ]).toArray(function (err, docs) {
                    callback(docs);
                });
            },

            searchStartWith: function (tableName, findObj, limit, callback) {

                var db = this._getDB(tableName);

                var query = { $or: [] };

                var selectObj = {};

                for (var i in findObj) {
                    var reg = new RegExp('^' + findObj[i], 'i');
                    //query[i] = { $regex: reg };
                    var qObj = {};
                    qObj[i] = { $regex: reg };

                    query.$or.push(qObj);

                    selectObj[i] = 1;
                }


                db.find(query, selectObj)
                    //.sort({ esearch: 1 })
                    .limit(limit).toArray(function (err, docs) {
                        callback(docs);
                    });

            },

            insert: function (tableName, insertObj, callback) {
                var db = this._getDB(tableName);

                db.insert(insertObj, function (err, newDoc) {
                    //console.log(newDoc._id);
                    if (callback) callback(newDoc);
                });
            },
            update: function (tableName, findObj, updateObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $set: updateObj }, { upsert: true }, function (err, result) {

                    if (callback) callback(result);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });

            },
            updateAll: function (tableName, findObj, updateObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $set: updateObj }, { upsert: true, multi: true }, function (err, numReplaced, upsert) {

                    if (callback) callback(numReplaced);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });
            },
            updateInc: function (tableName, findObj, updateObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $inc: updateObj }, { upsert: true }, function (err, numReplaced, upsert) {

                    if (callback) callback(numReplaced);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });

            },
            updateUnset: function (tableName, findObj, fieldName, callback) {

                var db = this._getDB(tableName);

                var unsetObj = {}; unsetObj[fieldName] = true;

                db.update(findObj, { $unset: unsetObj }, { upsert: true }, function (err, numReplaced, upsert) {

                    if (callback) callback(numReplaced);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });
            },
            updateWithPush: function (tableName, findObj, updateObj, pushObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $set: updateObj, $push: pushObj }, { upsert: true }, function (err, result) {

                    if (callback) callback(result);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });

            },
            updateWithAddToSet: function (tableName, findObj, updateObj, pushObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $set: updateObj, $addToSet: pushObj }, { upsert: true }, function (err, result) {

                    if (callback) callback(result);
                    //console.log(numReplaced, upsert);
                    // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
                    // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
                });

            },
            deleteAll: function (tableName, callback) {

                var db = this._getDB(tableName);

                db.remove({}, { multi: true }, function (err, numRemoved) {
                    if (callback) callback(numRemoved);
                });
            },
            destroy: function (tableName, findObj, callback) {
                var db = this._getDB(tableName);

                db.remove(findObj, { multi: true }, function (err, result) {
                    if (callback) callback(result);
                });

            }

        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwDbMgConnection;
    } else {

        context.NwDbMgConnection = NwDbMgConnection;
    }

})(this);