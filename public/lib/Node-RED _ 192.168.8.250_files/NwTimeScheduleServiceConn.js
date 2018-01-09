/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />
/// <reference path="../lib/async/async.js" />
/// <reference path="../../NwLib/NwLib.js" />


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
    var NwTimeScheduleServiceConn = Class(function () {

        return {
            //$singleton: true,
            wsClient: {},

            constructor: function (wsClient) {
                this.wsClient = wsClient;
            },

            getAllTimeSchedule: function (cb) {
                this.wsClient.callService('getAllTimeSchedule', {}, cb);
            },
     
            getTimeSchedule: function (id, cb) {
                this.wsClient.callService('getTimeSchedule', { id: id }, cb);
            },
            setTimeSchedule: function (id, TimeSchedules, cb) {
                this.wsClient.callService('setTimeSchedule', { id: id, TimeSchedules: TimeSchedules }, cb);
            },
            addTimeSchedule: function (id, TimeSchedule, cb) {

                this.wsClient.callService('addTimeSchedule', { id: id, TimeSchedule: TimeSchedule }, cb);
            },
            setUseTimeSchedule: function (id, isUsing, cb) {
                this.wsClient.callService('setUseTimeSchedule', { id: id, isUsing: isUsing }, cb);
            }
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwTimeScheduleServiceConn;
    } else {

        context.NwTimeScheduleServiceConn = NwTimeScheduleServiceConn;
    }

})(this);
