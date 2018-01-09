'use strict';
var NwLib = require('../../lib/NwLib.js');
var _ = require('underscore');
var Class = NwLib.Nwjsface.Class;

//sqlite3 = require('sqlite3').verbose();
var NwDbConnection = require('../NwConn/NwDbMgConnection.js');
var NwServiceProcess = require('../NwServiceProcess.js');
var NwMikronode = require('../../NwMikronode.js');
//#endregion
//var NwStockServiceMethod = Class(function () {
//    var stock1 = new NwDbConnection('../Database/stock1.s3db');
//    return {
//        $singleton: true,
//        constructor: function (dbPath) {
//            this.dbPath = dbPath;
//        },

//        getAllProducts: function (stockName) {

//        }

//    };
//});

//var mongoDbServerUrl = "192.168.1.200";
var mongoDbServerUrl = "192.168.1.199";
//var mongoDbServerUrl = "andamania.duckdns.org";
//var mongoDbServerUrl = "127.0.0.1";
//var mongoDbServerUrl = "localhost";

console.log('mongoDbServerUrl', mongoDbServerUrl);
var objArrCompress = function (objArr) {
    var fields = [];
    var data = [];

    _.each(objArr, function (obj) {
        var dataArray = [];

        _.each(obj, function (value, key) {
            var idf = fields.indexOf(key);
            if (idf == -1) {
                idf = fields.length;
                fields.push(key);
            }
            dataArray[idf] = value;
        });

        data.push(dataArray);
    });

    var resultData = { fds: fields, dt: data };

    return resultData;
};

var objArrDecompress = function (resultData) {
    var objArr = [];
    var fields = resultData.fds;

    _.each(resultData.dt, function (dataArray) {

        var obj = {};

        _.each(dataArray, function (value, id) {
            if (!_.isUndefined(value)) {
                var key = fields[id];
                obj[key] = value
            }
        });

        objArr.push(obj);
    });

    return objArr;
};

var getObjId = function (id) {
    return new require('mongodb').ObjectID(id);
};

var usersTableName = 'users';
var networkClientTableName = 'network_clients';

var usersDataField = ['name', 'password', 'remark', 'startDate', 'endDate'];
var hotsportStateDataField =
    ['name', 'password', 'remark', 'startDate', 'endDate',
        'isActive', 'address', 'mac-address', 'uptime', 'bytes-in', 'bytes-out'];

var networkClientDataField = ['host-name', 'mac', 'address', 'connDateAray'];

var stocks = {};

//var stocksName = ['Store-Main', 'Store-Engineer', 'Store-HK', 'Store-Test'];
var stockDataObj = {
    'hotspot': '',
    'hotspot_data': ''
}
//var dbPath = __dirname + '/../../Database/linvodb/';

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}

//_.each(socksName, function (sn) {

//});

//var globalDB = new NwDbConnection(dbPath + 'globalDB');

//async.eachSeries(stocksName, function (sn, callback) {

//    console.log('create', sn);
//    stocks[sn] = new NwDbConnection(dbPath + sn);
//    stocks[sn].initDB(function () {
//        callback();
//    });
//});

async.eachSeries(_.keys(stockDataObj), function (dpm, callback0) {
    var eachStockList = stockDataObj[dpm];

    var dbPath = "mongodb://" + mongoDbServerUrl + ":27017/" + dpm;
    //var dbPath = "mongodb://127.0.0.1:27017/" + dpm;

    stocks[dpm] = new NwDbConnection(dbPath);
    stocks[dpm].initDB(function () {
        console.log('init', dpm);

        callback0();
    });

}, function () {


});

//stocks['Store-ช่าง'] = new NwDbConnection(__dirname + '/../Database/stock/stock2');getStock(stockName, data.dpm, true);
//stocks['Store-ทดสอบ'] = new NwDbConnection(__dirname + '/../Database/stock/stock3');

//stocks['ทดสอบ stock 123'] = new NwDbConnection(__dirname + '/../Database/stock/ทดสอบ stock 123.s3db');

var getDatabase = function (dqm) {

    // if (isForceUseNonSupportDb && stockName.indexOf('--by--') > -1) {
    //     stockName = stockName.split('--by--')[0];
    // }

    if (dqm) {
        return stocks[dqm];
    } else {
        return stocks['hotspot'];
    }

}


var getLimit = function (skip, limit, callback) {
    var db = getDatabase()._getDB(networkClientTableName);
    var query = {}
    db.find(query).skip(skip).limit(limit).toArray(function (err, docs) {
        if (callback) callback(docs);
    });

}

var insetNetworkUsers = function (insertObj, callback) {
    var db = getDatabase()._getDB('NetworkUsers');
    db.insert(insertObj, function (err, newDoc) {
        //console.log(newDoc._id);
        if (callback) callback(newDoc);
    });
}


var insetNetworOn = function (coll, insertObj, callback) {
    var db = getDatabase()._getDB(coll);
    db.insert(insertObj, function (err, newDoc) {
        //console.log(newDoc._id);
        if (err) {
            console.log(err);
        }
        if (callback) callback(newDoc);
    });
}

var current = 0;
var lastMac = null
var getLimitRecur = function (params) {

    getLimit(current++, 1, function (docs) {

        if (docs && docs.length > 0) {
            var mac = docs[0].mac;
            console.log(current, mac);
            if (mac == lastMac) {
                console.log('remac');
                return
            }
            var mac = lastMac = docs[0].mac;
            var doc = docs[0]
            //delete doc["on-array"];

            var onArray = doc["on-array"];

            var onArrayObj = _.map(onArray, function (item) {
                return { 'mac': mac, 'on': item };
            })

            console.log(onArrayObj.length);
            // var countInsert = 0;
            // async.eachSeries(onArrayObj, function (item, callback) {
            //     var postPix = item.on.slice(0, 10)
            //     insetNetworOn('NetworkOn_' + postPix, item, function (params) {
            //         //console.log(++countInsert);
            //         callback();
            //     })
            //     // setTimeout(function () {

            //     // }, 1000)

            // }, function (params) {
            //     getLimitRecur();
            // })

            insetNetworOn('NetworOn', onArrayObj, function (params) {
                //console.log(++countInsert);
                //setTimeout(() => {
                getLimitRecur();
                // }, 100);

            })

            // insetNetworkUsers(doc, function (params) {
            //     getLimitRecur();
            // })

        } else {
            console.log('no doc');
            //getDatabase()._getDB('NetworOn').createIndex({ mac: 1 })
            getLimitRecur();


        }
    })
}


setTimeout(() => {

    console.log('start');
    // var db = getDatabase()._getDB(networkClientTableName);
    //  var query = {}
    //  var num = 0;

    // var myCursor = db.find(query)

    // while (myCursor.hasNext()) {

    //     var myDoc = myCursor.next();
    //     console.log(num++, myDoc);
    // }
    // var myCursor = db.find(query).forEach(function (myDoc) {
    //     if(myDoc){
    //         console.log(num++, myDoc.mac);
    //     }else{
    //         console.log('no doc');
    //     }

    // });
    //var myDocument = myCursor.hasNext() ? myCursor.next() : null;

    // db.find(query).skip(100).limit(10).toArray(function (err, docs) {
    //     console.log(docs);
    // });
    getDatabase()._getDB('NetworOn').createIndex({ mac: 1, on: 1 })
    //getDatabase()._getDB('NetworOn').createIndex({})

    getLimitRecur();


}, 2000);
