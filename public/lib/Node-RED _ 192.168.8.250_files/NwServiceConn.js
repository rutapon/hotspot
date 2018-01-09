/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />
/// <reference path="../lib/async/async.js" />
/// <reference path="../../NwLib/NwLib.js" />


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
    var NwServiceConn = Class(function () {

        return {
            //$singleton: true,
            wsClient: {},

            constructor: function (wsClient) {
                this.wsClient = wsClient;
            },

            getServerTime: function (cb) {
                this.wsClient.callService('getServerTime', {}, cb);
            },
            getAllEsp: function (cb) {
                this.wsClient.callService('getAllEsp', {}, cb);
            },
            getEspState: function (id, cb) {
                this.wsClient.callService('getEspState', { id: id }, cb);
            },
            setEspPin: function (id, pin, state, cb) {
                this.wsClient.callService('setEspPin', { id: id, pin: pin, state: state }, cb);
            },
            rescanEsp: function (cb) {
                this.wsClient.callService('rescanEsp', {}, cb);
            },
            setEspPWM: function (id, num, pulse, cb) {

                this.wsClient.callService('setEspPWM', { id: id, num: num, pulse: pulse }, cb);
            },
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwServiceConn;
    } else {

        context.NwServiceConn = NwServiceConn;
    }

})(this);
