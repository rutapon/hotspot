/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />
/// <reference path="../lib/async/async.js" />
/// <reference path="../../NwLib/NwLib.js" />
/// <reference path="../lib/underscore/underscore.js" />


/// <reference path="../NwConn/NwConn.js" />



(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {

        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;

        //NwDataMsgObj = require('../NwUtil/NwDataMsgObj.js');

        ////http = require('http');

        //NwConn = require('../NwConn/NwConn.js');

        //_ = require('../Lib/underscore/underscore.js');

    } else {

    }

    //#endregion

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
    }

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
    }

    var NwServiceConn = Class(function () {

        return {
            //$singleton: true,
            wsClient: {},

            constructor: function (wsClient) {
                this.wsClient = wsClient;
            },
            regEvent: function (eventName, cb) {
                this.wsClient.regEvent(eventName, cb);
            },

            call: function (serviceName, dataObj, cb) {
                dataObj.sid = this.getSocketId();
                this.wsClient.callService(serviceName, dataObj, cb);
            },
            getSocketId: function () {
                return this.wsClient.getId();
            },

            login: function (dataObj, cb) {
                this.wsClient.callService('login', dataObj, cb);
            },

            getUser: function (dataObj, cb) {
                dataObj.sid = this.getSocketId();
                this.wsClient.callService('getUser', dataObj, cb);
            },
            insertUser: function (dataObj, cb) {
                dataObj.sid = this.getSocketId();
                this.wsClient.callService('insertUser', dataObj, cb);
            },
            updateUser: function (dataObj, cb) {
                dataObj.sid = this.getSocketId();
                this.wsClient.callService('updateUser', dataObj, cb);
            },
            deleteUser: function (dataObj, cb) {
                dataObj.sid = this.getSocketId();
                this.wsClient.callService('deleteUser', dataObj, cb);
            },

            //#endregion
            getServerDateTime: function (dataObj, cb) {
                this.wsClient.callService('getServerDateTime', dataObj, cb);
            },
            setServerDateTime: function (dataObj, cb) {
                this.wsClient.callService('setServerDateTime', dataObj, cb);
            },
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwServiceConn;
    } else {

        context.NwServiceConn = NwServiceConn;
    }

})(this);
