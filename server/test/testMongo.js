if (typeof module !== "undefined") {
    NwLib = require('../../lib/NwLib.js');
    _ = require('underscore');
    Class = NwLib.Nwjsface.Class;

    async = require("async");

    MongoClient = require('mongodb').MongoClient;

} else {

}

var dbPath = 'mongodb://192.168.1.200:27017/hotspot';
var tableName = 'NetworOn';
var now = new Date();

MongoClient.connect(dbPath, function (err, dbConn) {
    if (err) console.log(err);
    var db = dbConn.collection(tableName);
    var userCollection = dbConn.collection('userCollection');

    function getAllUser(cb) {
        var NetworkUsers = dbConn.collection('NetworkUsers');
        NetworkUsers.mapReduce(
            function () {
                emit(this.mac, 1);
            },
            function (k, v) {

                return Array.sum(v);
            },
            {
                out: { inline: 1 },
                //query: { mac: '2C:0E:3D:CF:57:A7' }
                //limit: 1000
            },
            function (err, result) {
                // assert.equal(null, err);

                // if (result) {
                //     _.each(result, function (item) {
                //         console.log(item);
                //     })
                //     //console.log('result', new Date() - now, JSON.stringify(result[0]));
                // }
                cb(result)
            }
        );
    }

    function getMinMac(mac, cb) {

        db.mapReduce(
            function () {
                var obj = {};
                obj.min = this.on;
                obj.max = this.on;
                obj.num = 1;
                emit(this.mac, obj);
            },
            function (k, v) {
                //var result = { min: v[0], max: v[v.length - 1], length: v.length };
                //result.ons = v;
                // result.max = v[v.length - 1]//Array.max(result.ons);
                // result.min = v[0]// Array.min(result.ons);
                //result.address = v;
                var result = v[0];
                for (var index = 1; index < v.length; index++) {
                    var element = v[index];
                    if (result.min > element.min) {
                        result.min = element.min;
                    }
                    if (result.max < element.min) {
                        result.max = element.min;
                    }
                    // if (result < element) {
                    //     result = element;
                    // }
                    //result += element;
                    result.num += element.num
                }

                // result.length = v.length
                //return Array.sum(v)//{ v: Array.sum(v), length: v.length };// Array.sum(v);
                return result;
            },
            {
                out: { inline: 1 },
                query: { mac: mac }
                //limit: 1000
            },
            function (err, result) {
                // assert.equal(null, err);

                // if (result) {
                //     _.each(result, function (item) {
                //         console.log(item);
                //     })
                //     //console.log('result', new Date() - now, JSON.stringify(result[0]));
                // }
                cb(result[0])
            }
        );
    }

    function insertData(result, cb) {

        userCollection.insert(result, function (err, params) {
            //         //console.log('insert', new Date() - now, params);
            cb(params);
        });
    }


    db.count({}, function (err, count) {
        console.log('count', new Date() - now, count);
        getAllUser(function (userArray) {
            // _.each(userArray, function (item) {
            //     console.log(item);
            // })
            userCollection.remove({}, { multi: true }, function (err, numRemoved) {
                async.eachSeries(userArray, function (item, callback) {
                    var _id = item._id;
                    //console.log(item);
                    getMinMac(_id, function (result) {

                        insertData(result, function (params) {
                            console.log(result);
                            callback();
                        })

                    });
                }, function (params) {
                    dbConn.close();
                })
            });
        })

    })

    // db.mapReduce(
    //     function () { emit(key, value); },  //map function
    //     function (key, values) { return reduceFunction }, {   //reduce function
    //         out: collection,
    //         query: document,
    //         sort: document,
    //         limit: number
    //     }
    // )
});

