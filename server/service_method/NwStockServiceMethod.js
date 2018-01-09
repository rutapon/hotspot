/// <reference path="../../lib/NwLib.js" />
/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../NwConn/NwDbConnection.js" />
/// <reference path="../NwServiceProcess.js" />

var app = app || { models: {}, collections: {}, views: {} };
app.time = {
    addHours: function (date, hours) {
        var result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    },
    addDays: function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    addMonths: function (date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    },
    addYears: function (date, years) {
        var result = new Date(date);
        result.setFullYear(result.getFullYear() + years);
        return result;
    },
    removeTimezoneOffset: function (now) {
        return this.addHours(now, -now.getTimezoneOffset() / 60);
    },
    addTimezoneOffset: function (now) {
        return this.addHours(now, now.getTimezoneOffset() / 60);
    }
};

(function (context, undefined) {
    //#region requre
    'use strict';
    var NwLib = require('../../lib/NwLib.js');
    var _ = require('../../lib/underscore/underscore.js');
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
    var networkClientTableName = 'NetworkUsers';

    var usersDataField = ['name', 'password', 'remark', 'startDate', 'endDate'];
    var hotsportStateDataField =
        ['name', 'password', 'remark', 'startDate', 'endDate',
            'isActive', 'address', 'mac-address', 'uptime', 'bytes-in', 'bytes-out'];

    var networkClientDataField = ['host-name', 'mac', 'address', 'connDateAray'];

    var stocks = {};

    //var stocksName = ['Store-Main', 'Store-Engineer', 'Store-HK', 'Store-Test'];
    var stockDataObj = {
        'hotspot': ''
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

    var getDatabase = function (dqm, isForceUseNonSupportDb) {

        // if (isForceUseNonSupportDb && stockName.indexOf('--by--') > -1) {
        //     stockName = stockName.split('--by--')[0];
        // }

        return stocks['hotspot'];
    }

    var NwStockServiceMethod = {

        login: function (data, cb) {
            //console.log(data);
            var user = data.user;
            var pass = data.pass;
            var dpm = data.dpm;

            this.findUser({ attributes: { user: data.user, pass: data.pass }, dpm: data.dpm }, function (userDataObj) {
                if (userDataObj) {
                    console.log('login', userDataObj);
                    if (cb) { cb(userDataObj) };
                } else {
                    console.log('longin false ' + JSON.stringify(data));
                    if (cb) { cb(false) };
                }
            });

            //if (_.has(userData, user)) {
            //    var userDataObj = userData[user];

            //    if (userDataObj.pass == pass) {
            //        if (userDataObj.type == 'admin' || _.has(userDataObj.storeAccess, dpm) || userDataObj.storeAccess == "all") {
            //            data = _.extend(data, userDataObj);
            //            if (cb) { cb(data) };
            //            return;
            //        }
            //    }

            //}

            //if (cb) {
            //    console.log('longin false ' + JSON.stringify(userData));
            //    cb(false)
            //};
        },

        getHosportState: function (data, cb) {
            var db = getDatabase();
            //stockName = stockName.split('-')[1];

            db.getAll(usersTableName, function (result) {
                NwMikronode.showActive(function (activeResult) {

                    var activeResultObj = _.indexBy(activeResult, 'user');
                    var resultObj = _.indexBy(result, 'name');

                    result = _.map(resultObj, function (item, key) {
                        if (_.has(activeResultObj, key)) {
                            item = _.extend(item, activeResultObj[key]);
                            item.isActive = true;
                        }
                        return item;
                    })
                    //console.log(result);
                    if (cb) { cb(result) }
                })

            });
        },
        updateHosportState: function (data, cb) {
            console.log('updateHosportState');
            if (this._wsServer) {
                this._wsServer.emitEvent('updateHosportState', data);
            }
        },
        getUser: function (data, cb) {

            var db = getDatabase();
            var findObj = _.pick(data, usersDataField);
            //stockName = stockName.split('-')[1];

            db.findOne(usersTableName, findObj, function (result) {
                if (cb) { cb(result) }
            });
        },

        insertUser: function (data, cb) {
            var self = this;
            console.log('insertUser', data);

            var insertObj = _.pick(data, usersDataField);
            var db = getDatabase();

            if (insertObj.name) {
                var self = this;

                if (!insertObj.password) insertObj.password = '';

                db.findOne(usersTableName + '_backup', { name: data.name }, function name(getUserresult) {
                    console.log('self.getUser', getUserresult);
                    if (!getUserresult) {
                        NwMikronode.addUser(insertObj.name, insertObj.password, function (addUserResult) {
                            if (addUserResult) {
                                db.insert(usersTableName + '_backup', insertObj, function (result) {
                                    db.insert(usersTableName, insertObj, function (result) {
                                        self.updateHosportState(data);
                                        if (cb) { cb(result) }
                                    });
                                });
                            } else {
                                if (cb) { cb("Can't add user to server. Server error.") }
                            }
                        });

                    } else {
                        if (cb) { cb('Username already Register.') }
                    }

                });

                // db.update(usersTableName, { name: insertObj.name }, insertObj, function (result) {
                //     NwMikronode.addUser(insertObj.name, insertObj.password);
                //     self.updateHosportState(data);
                //     if (cb) { cb(result) }
                // });
            }

        },

        updateUser: function (data, cb) {
            var self = this;
            console.log('updateUser', data);
            var dataObj = _.pick(data, usersDataField);
            var db = getDatabase();

            db.update(usersTableName, { name: data.name }, dataObj, function (result) {

                var boolResult = result.result['ok'] && result.result['n'] > 0;
                console.log('updateUser result', result.result);

                self.updateHosportState(data);
                if (cb) { cb(boolResult) }
            });
        },
        deleteUser: function (data, cb) {
            var self = this;
            var db = getDatabase();
            if (data.name) {
                NwMikronode.removeUser(data.name, function (err, removeUserResult) {
                    if (removeUserResult && removeUserResult[0]) {
                        db.destroy(usersTableName, { name: data.name }, function (result) {
                            var boolResult = result.result['ok'] && result.result['n'] > 0;
                            console.log('destroy', result.result);
                            self.updateHosportState(data);
                            if (cb) { cb(boolResult) }
                        });
                    } else {
                        if (cb) { cb(false) }
                    }
                });
            }
        },
        kickUser: function (data, cb) {
            var self = this;
            NwMikronode.kickUser(data.name, function () {
                self.updateHosportState(data);
                if (cb) cb();
            });
        },
        getServerDateTime: function (data, cb) {
            if (cb) cb(new Date());
        },
        showServerInfo: function (data, cb) {
            NwMikronode.showServerInfo(cb);
        },
        updateServerInfo: function (data, cb) {
            console.log('updateServerInfo');
            NwMikronode.showServerInfo(function (result) {

                var db = getDatabase();
                var now = new Date();
                var nowStr = app.time.removeTimezoneOffset(now).toISOString().slice(0, 16) + ':00'
                var keys = _.keys(result);
                //console.log(keys);
                async.eachSeries(keys, function (mac, callback) {

                    var item = result[mac];
                    //console.log(mac, item);
                    if (item.address.indexOf('172.16') == 0) {
                        var netWorkOnObj = { mac: mac, on: nowStr };

                        async.series([
                            function (callback1) {
                                db.findOne('NetworOn', netWorkOnObj, function (NetworOnResult) {
                                    if (!NetworOnResult) {
                                        db.insert('NetworOn', netWorkOnObj, function (result) {
                                            callback1();
                                        })
                                    }
                                    else {
                                        callback1();
                                    }
                                });
                            }, function (callback1) {
                                db.findOne(networkClientTableName, { mac: mac }, function (networkClientResult) {
                                    //console.log('networkClientResult', networkClientResult);
                                    var updateObj = { 'mac': mac, 'host-name': item['host-name'], 'address': item['address'], 'last-on': now };
                                    if (!networkClientResult) {
                                        //console.log('!networkClientResult');
                                        updateObj['first-on'] = now;
                                        db.insert(networkClientTableName, updateObj, function (result) {
                                            console.log('updateWithAddToSet');
                                            callback1();
                                        })
                                    } else {
                                        db.update(networkClientTableName, { mac: mac }, updateObj, function (result) {
                                            //console.log('updateWithAddToSet');
                                            callback1();
                                        })
                                    }
                                });
                            }], function (params) {
                                callback();
                            })

                    } else {
                        //console.log("!item.address.indexOf('172.16') == 0");
                        callback();
                    }

                }, function () {
                    console.log('showServerInfo');
                    if (cb) cb(keys)
                });
            });
        },
        getServerInfoByMacArray: function (data, cb) {
            var db = getDatabase();
            var macArray = data.macArray;

            var findObj = { mac: { $in: macArray } }

            db.find(networkClientTableName, findObj, function (result) {

                if (cb) { cb(result) }
            });
        },
        getPotentialLocal: function (data, cb) {
            var db = getDatabase();
            var periodFilter = data.periodFilter;
            function getuserCollection(cb) {
                db.find('userCollection', {}, function (result) {
                    //console.log('userCollection', result.length);
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
                db.find('NetworkUsers', {}, function (result) {

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

            //getuserCollection(function (result) {
            //console.log(result[0]);

            getNetworkUsers(function (result2, result3) {
                //var resultObj = {};
                // _.each(result, function (item) {
                //     if (_.has(resultObj, item.mac)) {
                //         console.log('duplicate', item);
                //     }
                //     resultObj[item.mac] = item;
                // });

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

                var respondResult = _.map(result2Obj, function (item, key) {
                    //if (!_.has(result2Obj, key)) {
                    var obj = {
                        mac: key, name: result3Obj[key]['host-name'],
                       // num: item.value.num / 60,
                         period: item.period
                    }
                    return obj;
                });

                if (cb) cb(respondResult);
            });
            // })
        },
        getOnData: function (data, cb) {
            var db = getDatabase();
            var mac = data.mac;
            db.find('NetworOn', { mac: mac }, function (result) {
                //console.log('userCollection', result.length);
                _.each(result, function (item) {
                    delete item._id;
                })
                cb(result)
                //dbConn.close();
            })
        },
        showServerInfoAndConn: function (data, cb) {
            console.log('showServerInfoAndConn');
            NwMikronode.showServerInfoAndConn(cb);
        },
        updateServerState: function (data, cb) {
            console.log('updateServerState');
            if (this._wsServer) {
                this._wsServer.emitEvent('updateServerState', data);
            }
        },
        addNwWsServer: function (wsServer) {
            this._wsServer = wsServer;
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        // NodeJS/CommonJS
        module.exports = NwStockServiceMethod;
    } else {

        context.NwStockServiceMethod = NwStockServiceMethod;
    }

})(this);