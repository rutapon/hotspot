/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />

/// <reference path="../../NwLib/NwLib.js" />
/// <reference path="../../NwUtil/NwDataMsgObj.js" />

/// <reference path="../NwSocket.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {

        _ = require('underscore');
        Backbone = require('backbone');

        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;

        NwDataMsgObj = require('../NwUtil/NwDataMsgObj.js');

        io = require('socket.io-client');
        //NwSocket = require('../NwSocket.js');
        //http = require('http');
    } else {

    }

    //#endregion
    var NwWsClient = Class(function () {

        return {
            //$singleton: true,
            wsServerUrl: '',
            socket: {},
            _pastId: '',

            constructor: function (wsServerUrl) {

                // var prot = isSSL ? 'wss:' : 'ws';
                var self = this;
                this.wsServerUrl = wsServerUrl;

                this.socket = io(this.wsServerUrl, { 'forceNew': true });//,{'forceNew':true });

                this.event = _.extend({}, Backbone.Events);

                this._initConnectionListen();
            },

            _initConnectionListen: function () {
                var self = this;

                self.socket.on('connect', function () {
                    //console.log('a user connected');

                    self._pastId = self.getId();

                    //if (self._onConnectEventListener) {
                    //    self._onConnectEventListener(self.socket);
                    //}
                    self.event.trigger('_onConnectEventListener', self.socket);

                    self.socket.on('cmd', function (msgObj, fn) {

                        //if (self._onMessageEventListener) {

                        //    self._onMessageEventListener(self.socket, msgObj, fn);

                        //    try {

                        //    } catch (e) {
                        //        //throw e;
                        //        console.log('err NwWsClient :' + e);
                        //    }
                        //}

                        self.event.trigger('_onMessageEventListener', self.socket, msgObj, fn);

                    });

                    self.socket.on('disconnect', function () {
                        //io.sockets.emit('user disconnected');

                        //if (self._onDisconnectEventListener) {
                        //    self._onDisconnectEventListener(self.socket);
                        //}
                        self.event.trigger('_onDisconnectEventListener', self.socket);
                    });

                    //self.socket.on('reconnect_failed', function () {
                    //    alert('reconnect_failed');

                    //});
                    //self.socket.on('connect_timeout', function () {
                    //    alert('connect_timeout');

                    //});
                    //self.socket.on('reconnect_error', function () {
                    //    alert('reconnect_error');

                    //});
                    //self.socket.on('reconnect_error', function () {
                    //    alert('reconnect_error');

                    //});

                    //setInterval(function () {

                    //    if (!self.socket.connected) {
                    //        //alert(self.socket.connected);
                    //        self.socket.connect();
                    //    }

                    //},1000);
                });
            },

            getId: function () {
                var id = this.socket.io.engine.id;
                return id ? id : this._pastId;
            },

            getUri: function () {
                return this.socket.io.uri;
            },

            getIp: function () {

                return this.getUri().split('/')[2].split(':')[0];
            },
            getConnectState: function () {
                return this.socket.connected;
            },
            reconnect: function () {
                this.socket.connect();
            },
            disconnect: function (socketId) {
                this.socket.disconnect();
            },

            callService: function (msg, data, cb) {
                var msgObj = new NwDataMsgObj();

                msgObj.msg = msg;
                msgObj.cat = 'callService';

                msgObj.data = data;
                msgObj.type = data ? typeof data : null;

                this.sendMsgObj(msgObj, function (msgObj) {

                    if (cb) {
                        if (msgObj) {
                            cb(msgObj.data, msgObj.type);
                        } else {
                            cb();
                        }
                    }
                });
            },

            sendMsgObj: function (msgObj, cb) {
                this.socket.emit('cmd', msgObj, cb); //cb <- (msgObj)
            },

            regEvent: function (eventName, cb) { //registerEvent

                var self = this;
                //var msgObj = new NwDataMsgObj();
                //msgObj.msg = eventName;
                //msgObj.cat = 'singUpEvent';

                //this.sendMsgObj(msgObj, function (resultObj) {
                //    self.socket.on(eventName, function (msgObj) {
                //        cb(msgObj.data, msgObj.type);
                //    });
                //});

               self.socket.on(eventName, function (msgObj) {
                    cb(msgObj.data, msgObj.type);
                });

               
            },

            removeEvent: function (eventName) {
                this.socket.removeAllListeners(eventName);
            },
            emitEvent: function (eventName, resultObj, cb) {
                var msgObj = new NwDataMsgObj();
                msgObj.msg = eventName;
                msgObj.cat = 'event';
                msgObj.data = resultObj;
                msgObj.type = typeof resultObj;

                this.socket.emit(eventName, msgObj.getObj(), cb);
            },

            //#region eventListener
            _onConnectEventListener: null,
            setOnConnectEventListener: function (eventListener) {
                //this._onConnectEventListener = eventListener;
                this.event.on('_onConnectEventListener', eventListener);
            },

            _onDisconnectEventListener: null,
            setOnDisconnectEventListener: function (eventListener) {
                //this._onDisconnectEventListener = eventListener;
                this.event.on('_onDisconnectEventListener', eventListener);
            },

            _onMessageEventListener: null,
            setOnMessageEventListener: function (eventListener) {
                //this._onMessageEventListener = eventListener;
                this.event.on('_onMessageEventListener', eventListener);
            }
            //#endregion
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwWsClient;
    } else {

        context.NwWsClient = NwWsClient;
    }

})(this);
