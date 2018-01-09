/// <reference path="../lib/NwLib.js" />
/// <reference path="../lib/underscore/underscore.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        NwLib = require('../lib/NwLib.js');
        _ = require('../lib/underscore/underscore.js');
        async = require("async");

        Class = NwLib.Nwjsface.Class;

    } else {

    }

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
    function runLoopRecur(loopInterval, func, falseDelay) {
        var self = this;
        //var loopInterval = 10 * 60000;
        falseDelay = falseDelay ? falseDelay : 1000;
        var funcRecur = function () {
            var now = new Date();
            var isfalse = func(function () {
                var processTime = (new Date - now);
                var userInterval = loopInterval - processTime;
                if (userInterval < 0) {
                    userInterval = 0;
                }
                //console.log('processTime', processTime);
                setTimeout(function () {
                    funcRecur();
                }, userInterval);
            });

            if (isfalse) {
                setTimeout(function (params) {
                    funcRecur();
                }, falseDelay);
            }
        };
        funcRecur();
    }

    //#endregion
    var NwServiceProcess = Class(function () {

        return {
            $singleton: true,
            state: '',

            //constructor: function () {
            //    console.log('NwServiceProcess constructor');
            //    NwServiceProcess.state = 'constructor';
            //},
            init: function () {
                NwServiceProcess.state = 'init';

                // setTimeout(() => {
                //     this.checkServerState();
                // }, 5000);

                // setTimeout(() => {
                //     this.checkServerStateAndConn();
                // }, 30000);

                //this.checkHosportState();
            },
            checkServerState: function () {
                var self = this;
                setInterval(function () {

                    if (self._serviceMethodObj) {
                        console.log('checkServerState', new Date());
                        self._serviceMethodObj.updateServerInfo({}, function (macArray) {
                            console.log('updateServerInfo', macArray.length);
                            self._serviceMethodObj.getServerInfoByMacArray({ macArray: macArray }, function (serverInfoArray) {
                                delete serverInfoArray['on-array'];
                                self._serviceMethodObj.updateServerState(serverInfoArray);
                                //callback();
                            });
                        })
                    }
                    // else {
                    //     callback();
                    //     return true;
                    // }
                }, 30000)
            },
            checkServerStateAndConn: function () {
                var self = this;
                runLoopRecur(10 * 60000, function (callback) {
                    if (self._serviceMethodObj) {
                        self._serviceMethodObj.showServerInfoAndConn({}, function (result) {
                            //console.log(result);
                            self._serviceMethodObj.updateServerState(result);
                            callback();
                        })
                    } else {
                        return true;
                    }
                })
            },
            checkServerState0: function () {
                var self = this;
                var checkServerInterval = 10 * 60000;
                var checkServerRecur = function () {
                    var now = new Date();
                    if (self._serviceMethodObj) {
                        self._serviceMethodObj.showServerInfo({}, function (result) {
                            console.log(result);

                            self._serviceMethodObj.updateServerState(result);
                            var processTime = (new Date - now);
                            var userInterval = checkServerInterval - processTime;
                            if (userInterval < 0) {
                                userInterval = 0;
                            }
                            console.log('processTime', processTime);
                            setTimeout(function () {
                                checkServerRecur();
                            }, userInterval);
                        })
                    } else {
                        setTimeout(function (params) {
                            checkServerRecur();
                        }, 1000);
                    }
                };
                checkServerRecur();
            },
            checkHosportState: function () {
                var self = this;
                var lastHosportStateStr = null;

                var checkForChangeField = ['name', 'password', 'remark', 'startDate', 'endDate', 'isActive', 'address', 'mac-address'];
                var loopInterval = 10000;

                var checkOutTime = '12:12:00';

                async.forever(function (callback) {
                    setTimeout(function () {

                        if (self._serviceMethodObj) {
                            self._serviceMethodObj.getHosportState({}, function (resultState) {
                                var nowTime = app.time.removeTimezoneOffset(new Date()).toISOString().slice(0, 19);

                                async.filterSeries(resultState, function (item, filterCallback) {
                                    var endTime = item.endDate + 'T' + checkOutTime;
                                    //console.log('check timeOut', item.name, 'nowTime:', nowTime, 'endTime:', endTime);

                                    if (nowTime > endTime) {
                                        console.log('timeOut', item.name, nowTime, endTime);

                                        self._serviceMethodObj.deleteUser({ name: item.name }, function () {
                                            filterCallback(null, false)
                                        })

                                    } else {
                                        filterCallback(null, true)
                                    }
                                }, function (err, result) {
                                    console.log('check for change state result', result.length);
                                    var resultStr = JSON.stringify(_.map(result, function (item) {
                                        return _.pick(item, checkForChangeField);
                                    }));

                                    //console.log('lastHosportStateStr vs resultStr', lastHosportStateStr == resultStr);
                                    if (!lastHosportStateStr || lastHosportStateStr != resultStr) {
                                        //if (lastHosportStateStr) {
                                        lastHosportStateStr = resultStr;
                                        self._serviceMethodObj.updateHosportState({ 'ev': 'state-change' });
                                        //}
                                    }
                                    callback();
                                });

                            })
                        } else {
                            callback();
                        }

                    }, loopInterval);
                })

            },
            cammandProcess: function (msgObj, cb) {
                var cmd = msgObj.msg;
                var data = msgObj.data;

                //console.log('cammandProcess : ' + JSON.stringify(msgObj));

                if (this.cmdMethod.hasOwnProperty(cmd)) {

                    this.cmdMethod[cmd](data, function (resultObj) {
                        msgObj.data = resultObj;
                        if (cb) { cb(msgObj) }
                    });

                } else {
                    console.log('invalid cmd ' + cmd);

                    msgObj.data = 'invalid cmd ' + cmd;
                    if (cb) { cb(msgObj) }
                }
            },

            addServiceMethod: function (serviceMethodObj) {
                this._serviceMethodObj = serviceMethodObj;
                for (var attrname in serviceMethodObj) { this.cmdMethod[attrname] = serviceMethodObj[attrname]; }

            },
            cmdMethod: {}
        };
    });


    NwServiceProcess.init();

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwServiceProcess;
    } else {

        context.NwServiceProcess = NwServiceProcess;
    }

})(this);