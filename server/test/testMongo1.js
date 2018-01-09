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

    var userCollection = dbConn.collection('userCollection');
    var NetworkUsers = dbConn.collection('NetworkUsers');
    var periodFilter = 20;
    function getuserCollection(cb) {
        userCollection.find({}).toArray(function (err, result) {
            console.log('userCollection', result.length);
            var oldResult = result;
            result = _.map(result, function (item) {
                var period = new Date(item.value.max) - new Date(item.value.min);
                // var period = (item['last-on']) - (item['first-on']);

                period = period / (1000 * 60 * 60 * 24);
                //console.log(period);
                item.period = period;
                item.mac = item._id;
                return item;
            });
            result = _.filter(result, function (item) {
                return item.period > periodFilter;// && item.address.indexOf('172.16') == 0;
            });

            console.log('userCollection', result.length);
            // _.each(result, function (item) {
            //     console.log(item);
            // });

            cb(result, oldResult)
            //dbConn.close();
        })

    }
    function getNetworkUsers(cb) {
        NetworkUsers.find({}).toArray(function (err, result) {
            console.log('NetworkUsers', result.length);
            var oldResult = result;
            result = _.map(result, function (item) {
                //var period = new Date(item.value.max) - new Date(item.value.min);
                var period = (item['last-on']) - (item['first-on']);

                period = period / (1000 * 60 * 60 * 24);
                //console.log(period);
                item.period = period;
                return item;
            });
            result = _.filter(result, function (item) {
                return item.period > periodFilter// && item.address.indexOf('172.16') == 0;
            });
            console.log('NetworkUsers', result.length);
            // _.each(result, function (item) {
            //     console.log(item);
            // });
            cb(result, oldResult);
            //dbConn.close();
        })

    }

    getuserCollection(function (result) {
        //console.log(result[0]);

        getNetworkUsers(function (result2, result3) {
            var resultObj = {};
            _.each(result, function (item) {
                if (_.has(resultObj, item.mac)) {
                    console.log('duplicate', item);
                }
                resultObj[item.mac] = item;
            });

            var result2Obj = {};
            _.each(result2, function (item) {
                if (_.has(result2Obj, item.mac)) {
                    console.log('duplicate', item);
                }
                result2Obj[item.mac] = item;
            });
            var result3Obj = {};
            _.each(result3, function (item) {
                if (_.has(result3Obj, item.mac)) {
                    //console.log('duplicate', item);
                }
                result3Obj[item.mac] = item;
            });

            var count = 0;
            _.map(resultObj, function (item, key) {
                //if (!_.has(result2Obj, key)) {
                var obj = {
                    mac: key, name: result3Obj[key]['host-name'],
                    num: item.value.num / 60, period: item.period
                }
                return obj;
                //console.log(item.value.num / 60, item.period, result3Obj[key]['host-name']);
                //}
            });

            _.each(resultObj, function (item, key) {
                //if (!_.has(result2Obj, key)) {
                console.log(item.value.num / 60, item.period, result3Obj[key]['host-name']);
                //}
            })
            //console.log(result2[0]);
        });
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

