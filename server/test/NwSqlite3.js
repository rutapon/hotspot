/// <reference path="../../NwLib/NwLib.js" />
/// <reference path="../../lib/step/step.js" />
/// <reference path="../../lib/underscore/underscore.js" />


(function (context, undefined) {
//#region require
if (typeof module !== "undefined") {

    fs = require("fs");
    path = require('path');

    sqlite3 = require('sqlite3').verbose();
    //assert = require('assert');
    _ = require('../../lib/underscore/underscore.js');
    step = require('../../lib/step/step.js');
    NwLib = require('../../NwLib/NwLib.js');

    Nw = NwLib.Nw;
    Class = NwLib.Nwjsface.Class;

} else {

}
//#endregion

var NwSqlite3 = Class({
    //db: null,
    dbFileName: 'test.db',
    tableSqlStr: '',
    constructor: function (dbFileName, cb) {

        if (dbFileName) {
            this.dbFileName = dbFileName;
        }

        //this.initDb();
    },

    initDb: function (cb) {
        var self = this;
        var dbFileName = this.dbFileName;
        var exists = fs.existsSync(dbFileName, cb);

        if (!exists) {

            var dbDirName = path.dirname(dbFileName)

            if (!fs.existsSync(dbDirName)) {
                //mkdirp.sync(dbDirName);
                console.log('create directory ' + dbDirName);
            }

            console.log("Creating DB file.");
            fs.openSync(dbFileName, "w");

            var db = new sqlite3.Database(dbFileName);

            db.serialize(function () {
                //var createTableSqlStr = "CREATE TABLE Stuff (thing TEXT)";

                db.run(self.tableSqlStr, function () {
                    //if (cb) cb();
                });
            });

            db.close();
        }

        if (cb) cb();
    },

    getAllTable: function (cb) {
        var sql = "SELECT name FROM sqlite_master WHERE type='table'";

        var db = new sqlite3.Database(this.dbFileName);
        db.all(sql, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },

    updateBasic: function (collectionName, fieldNameCondition, valueCondition, updateObj, cb) {

        var param = {};
        var setSqlArray = [];

        _.each(updateObj, function (value, key) {
            param['$' + key] = value;
            setSqlArray.push(key + ' = ' + '$' + key);
        });

        var setSql = setSqlArray.join(',');

        var sql = "UPDATE " + collectionName +
                   " SET " + setSql +
                   " WHERE " + fieldNameCondition + " = $" + fieldNameCondition;

        param["$" + fieldName] = valueCondition;

        var db = new sqlite3.Database(this.dbFileName);
        db.run(sql, param, function () {
            db.close();

            if (cb) cb(this.changes);
        });
    },

    insertBasic: function (collectionName, insertObj, cb) {

        var param = {};
        _.each(insertObj, function (value, key) {
            param['$' + key] = value;
        });

        var fieldsSql = _.keys(insertObj).join(',');
        var paramSql = _.keys(param).join(',');

        var sql = "INSERT INTO " + collectionName +
            " (" + fieldsSql + ")  VALUES (" + paramSql + ")";

        var db = new sqlite3.Database(this.dbFileName);
        db.run(sql, param, function () {
            db.close();
            var id = this.lastID;

            if (cb) cb(id, insertObj);
        });
    },
    insertArray: function (collectionName, insertObjArray, cb, finCallback) {
        var db = new sqlite3.Database(this.dbFileName);
        var lastID = null;
        var num = 0;
        var length = insertObjArray.length;
        db.serialize(function () {

            for (var i in insertObjArray) {
                var insertObj = insertObjArray[i];
                var param = {};
                _.each(insertObj, function (value, key) {
                    param['$' + key] = value;
                });

                var fieldsSql = _.keys(insertObj).join(',');
                var paramSql = _.keys(param).join(',');

                var sql = "INSERT INTO " + collectionName +
                    " (" + fieldsSql + ")  VALUES (" + paramSql + ")";

                //db.run(sql, param, function () {
                //    lastID = this.lastID;
                //    if (cb) cb(lastID, ++num, length);
                //});

                (function () {
                    var esearch = insertObj;
                    db.run(sql, param, function () {
                        lastID = this.lastID;
                        console.log(JSON.stringify(esearch.esearch));
                        if (cb) cb(lastID, ++num, length);

                    });
                })();
                //break;
            }

        });

        db.close(function () {
            if (finCallback) finCallback(lastID);
        });

    },

    upsert: function (collectionName, fieldNameCondition, valueCondition, upsertObj, cb) {
        var self = this;
        self.updateBasic(collectionName, fieldNameCondition, valueCondition, upsertObj, function (changes) {
            if (changes == 0) {
                self.insertBasic(collectionName, upsertObj, function (index) {
                    if (cb) cb(index, 'insert');
                });
            } else {
                if (cb) cb(changes, 'update');
            }
        });
    },

    groupBy: function (collectionName, groupField, sortField, sortRevert, limit, queryObj, cb) {

        var param = {};
        var whereConditionArray = [];
        _.each(queryObj, function (value, key) {
            param['$' + key] = value;
            whereConditionArray.push(key + '= $' + key);
        });

        var whereConditionStr = whereConditionArray.join(' AND ');

        sortRevert = sortRevert ? 'DESC' : 'ASC';

        var sql = "Select DISTINCT " + groupField + " , count(" + groupField + ") as count " +
                   " From " + collectionName +
                   " WHERE " + whereConditionStr +
                   " group by " + groupField +
                   " order by " + sortField + " " + sortRevert + ", count " + sortRevert +
                   " LIMIT " + limit + ";";

        var db = new sqlite3.Database(this.dbFileName);
        db.all(sql, param, function (err, searchResultObj) {
            db.close();

            if (searchResultObj) {
                cb(searchResultObj);
            }
            else {
                cb([]);
            }
        });
    },

    findField: function (collectionName, fieldName, value, cb) {

        var sql = "Select * From " + collectionName +
            " WHERE " + fieldName + " = $" + fieldName;

        var paraObj = {};
        paraObj['$' + fieldName] = value;

        var db = new sqlite3.Database(this.dbFileName);
        db.all(sql, paraObj, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },

    fildFieldWithValueArray: function (collectionName, fieldName, valueArray, cb) {

        var jointStr = " or " + fieldName + "=";
        var whereStr = fieldName + "=" + valueArray.join(jointStr);

        var sql = 'Select  * From ' + collectionName +
            ' WHERE ' + whereStr;

        var db = new sqlite3.Database(this.dbFileName);
        db.all(sql, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },

    findLimit: function (collectionName, fieldName, value, limit, cb) {

        var sql = 'Select * From ' + collectionName +
        '  WHERE ' + fieldName + ' like $' + fieldName +
        '  LIMIT ' + limit;

        value += '%';

        var paraObj = {};
        paraObj['$' + fieldName] = value;

        var db = new sqlite3.Database(this.dbFileName);

        db.all(sql, paraObj, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },

    findStartWith: function (collectionName, fieldName, value, limit, cb) {

        var sql = 'Select * From ' + collectionName +
        '  WHERE ' + fieldName + ' like $' + fieldName +
        '  order by ' + fieldName +
        '  COLLATE NOCASE ' +
        '  LIMIT ' + limit;

        value += '%';

        var paraObj = {};
        paraObj['$' + fieldName] = value;

        var db = new sqlite3.Database(this.dbFileName);

        db.all(sql, paraObj, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });

    },

    findOne: function (colectionName, fieldName, value, cb) {

        var sql = "Select * From " + colectionName +
            " WHERE " + fieldName + " = $" + fieldName;

        var paraObj = {};
        paraObj['$' + fieldName] = value;

        var db = new sqlite3.Database(this.dbFileName);
        db.get(sql, paraObj, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },
    findLast: function (collectionName, cb) {

        var sql = "SELECT * FROM " + collectionName +
            " ORDER BY id DESC LIMIT 1";

        var db = new sqlite3.Database(this.dbFileName);
        db.get(sql, function (err, resultObj) {
            db.close();
            if (cb) cb(resultObj);
        });
    },

    findByTimePeriod: function (collectionName, timeFieldName, timeStart, timeEnd, cb) {

        var whereCondArray = [];
        var whereCondition = '';

        var paraObj = {};

        if (timeStart) {
            whereCondArray.push(timeFieldName + '> $timeStart');
            paraObj.$timeStart = timeStart.getTime();
        }

        if (timeEnd) {
            whereCondArray.push(timeFieldName + '< $timeEnd');
            paraObj.$timeEnd = timeEnd.getTime();
        }

        if (whereCondArray.length > 0) {
            whereCondition = ' WHERE ' + whereCondArray.join(' AND ');
        }

        var sql = 'Select  * From ' + collectionName +
         whereCondition;


        var db = new sqlite3.Database(this.dbFileName);
        db.all(sql, paraObj, function (err, resultObj) {
            db.close();

            if (cb) cb(resultObj);
        });

        //var query = { time: {} };

        //if (timeStart) {
        //    query.time['$gt'] = timeStart;
        //}

        //if (timeEnd) {

        //    query.time['$lte'] = timeEnd;
        //}

        //var option = {
        //    isRecursive: 1,
        //    query: query
        //};

        //var resultObj = {};

        //this._findOption(collectionName, option, function (item) {

        //    var tm = item.time ? item.time : item._id.getTimestamp();

        //    var keyStr = getTimeKeyString(tm, groupBy);

        //    var value = fieldName ? item[fieldName] : item;

        //    var currentValues = resultObj[keyStr];

        //    if (!currentValues) {
        //        currentValues = [];
        //        resultObj[keyStr] = currentValues;
        //    }

        //    currentValues.push(value);

        //    //nextObject();

        //}, function () {
        //    cb(resultObj);
        //});
    },

    clean: function (collectionName, cb) {
        var sql = "DELETE FROM " + collectionName;

        var db = new sqlite3.Database(this.dbFileName);

        db.run(sql, function () {
            db.close();
            //var id = this.lastID;

            if (cb) cb();
        });
    }


})


if (typeof module !== "undefined" && module.exports) {
    module.exports = NwSqlite3;
}
else {
    context.NwSqlite3 = NwSqlite3;
}

})(this);
////https://www.npmjs.org/package/mkdirp

//function mkdirP(p, opts, f, made) {
//    if (typeof opts === 'function') {
//        f = opts;
//        opts = {};
//    }
//    else if (!opts || typeof opts !== 'object') {
//        opts = { mode: opts };
//    }

//    var mode = opts.mode;
//    var xfs = opts.fs || fs;

//    if (mode === undefined) {
//        mode = 0777 & (~process.umask());
//    }
//    if (!made) made = null;

//    var cb = f || function () { };
//    p = path.resolve(p);

//    xfs.mkdir(p, mode, function (er) {
//        if (!er) {
//            made = made || p;
//            return cb(null, made);
//        }
//        switch (er.code) {
//            case 'ENOENT':
//                mkdirP(path.dirname(p), opts, function (er, made) {
//                    if (er) cb(er, made);
//                    else mkdirP(p, opts, cb, made);
//                });
//                break;

//                // In the case of any other error, just see if there's a dir
//                // there already.  If so, then hooray!  If not, then something
//                // is borked.
//            default:
//                xfs.stat(p, function (er2, stat) {
//                    // if the stat fails, then that's super weird.
//                    // let the original error be the failure reason.
//                    if (er2 || !stat.isDirectory()) cb(er, made)
//                    else cb(null, made);
//                });
//                break;
//        }
//    });
//}

//mkdirP.sync = function sync(p, opts, made) {
//    if (!opts || typeof opts !== 'object') {
//        opts = { mode: opts };
//    }

//    var mode = opts.mode;
//    var xfs = opts.fs || fs;

//    if (mode === undefined) {
//        mode = 0777 & (~process.umask());
//    }
//    if (!made) made = null;

//    p = path.resolve(p);

//    try {
//        xfs.mkdirSync(p, mode);
//        made = made || p;
//    }
//    catch (err0) {
//        switch (err0.code) {
//            case 'ENOENT':
//                made = sync(path.dirname(p), opts, made);
//                sync(p, opts, made);
//                break;

//                // In the case of any other error, just see if there's a dir
//                // there already.  If so, then hooray!  If not, then something
//                // is borked.
//            default:
//                var stat;
//                try {
//                    stat = xfs.statSync(p);
//                }
//                catch (err1) {
//                    throw err0;
//                }
//                if (!stat.isDirectory()) throw err0;
//                break;
//        }
//    }

//    return made;
//};


//createCollection: function (collectionName, indexField, cb) {
//    var self = this;
//    MongoClient.connect(this.mongoUrl, { native_parser: true }, function (err, db) {
//        if (!err) {
//            db.createCollection(collectionName, function (err, collection) {

//                if (!err) {
//                    var indexObj = {};
//                    indexObj[indexField] = 1;

//                    collection.ensureIndex(indexObj, {}, function (err, indexName) {
//                        db.close();
//                        cb(indexName);
//                    });
//                    //if (err) console.log(err);
//                }

//            });
//        } else {
//            console.log(err);
//        }
//    });
//},

//removeCollection: function (collectionName, cb) {
//    var self = this;
//    MongoClient.connect(this.mongoUrl, { native_parser: true }, function (err, db) {
//        if (!err) {

//            db.dropCollection(collectionName, function (err, result) {
//                db.close();

//                if (!err) {
//                    cb(result);
//                }

//            });
//        } else {
//            console.log(err);
//        }
//    });
//},

//getCollectionNames: function (collectionNamePrefix, cb) {
//    var self = this;
//    MongoClient.connect(this.mongoUrl, { native_parser: true }, function (err, db) {
//        if (!err) {
//            db.collectionNames(function (err, items) {
//                db.close();
//                var dbNamePrefix = self.dbName + '.';
//                var prefix = dbNamePrefix + collectionNamePrefix;

//                var result = _.filter(items, function (obj) {
//                    return obj.name.indexOf(prefix) === 0;
//                });

//                _.each(result, function (obj) {
//                    var name = obj.name;
//                    obj.name = name.substr(dbNamePrefix.length, name.length);;
//                });

//                cb(result);
//            });
//        }
//        else {
//            console.log(err);
//        }
//    });
//},
