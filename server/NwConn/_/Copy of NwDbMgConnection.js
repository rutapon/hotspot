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
                var self = this;
                if (!_.has(this.allTable, tableName)) {
                    self.allTable[tableName] = self.dbConn.collection(tableName);
                }
                return this.allTable[tableName];
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

                db.find({}, function (err, docs) {
                    if (callback) callback(docs);
                });
            },
            find: function (tableName, findObj, callback) {
                var db = this._getDB(tableName);

                //console.log(findObj);
                db.find(findObj, function (err, docs) {
                    if (callback) callback(docs);
                });

            },
            findOne: function (tableName, findObj, callback) {

                var db = this._getDB(tableName);
                //console.log(findObj);
                db.findOne(findObj, function (err, docs) {
                    if (callback) callback(docs);
                });

            },
            findLimit: function (tableName, findObj, limit, callback) {
                var db = this._getDB(tableName);

                db.find(findObj).limit(limit).toArray(function (err, docs) {
                    cb(docs);
                });

            },

            findStartWith: function (tableName, findObj, limit, callback) {

                var db = this._getDB(tableName);

                var query = { $or: [] };

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

            findInPeriod: function (tableName, findObj, timeField, timeStart, timeEnd, callback) {

                var db = this._getDB(tableName);

                findObj[timeField] = { $gte: timeStart, $lte: timeEnd };

                db.find(findObj)
                    //.limit(limit)
                    .toArray(function (err, docs) {
                        callback(docs);
                    });

            },

            insert: function (tableName, insertObj, callback) {
                var db = this._getDB(tableName);

                db.insert(insertObj, function (err, newDoc) {
                    //console.log(newDoc._id);
                    if (callback) callback(newDoc._id, newDoc);
                });
            },
            update: function (tableName, findObj, updateObj, callback) {
                var db = this._getDB(tableName);

                db.update(findObj, { $set: updateObj }, { upsert: true }, function (err, numReplaced, upsert) {

                    if (callback) callback(numReplaced);
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

                db.remove(findObj, { multi: true }, function (err, numRemoved) {
                    if (callback) callback(numRemoved);
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