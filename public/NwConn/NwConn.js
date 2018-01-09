
/// <reference path="../lib/socket.io-1.0.6.js" />
/// <reference path="../Lib/step/step.js" />

/// <reference path="../NwLib/NwLib.js" />
/// <reference path="../NwUtil/NwDataMsgObj.js" />

/// <reference path="NwWsServer/NwWsServer.js" />
/// <reference path="NwWsClient/NwWsClient.js" />
/// <reference path="NwSocket.js" />


(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {

        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;
        Nw = NwLib.Nw;

        NwDataMsgObj = require('../NwUtil/NwDataMsgObj.js');

        NwWsClient = require('./NwWsClient/NwWsClient.js');
        NwWsServer = require('./NwWsServer/NwWsServer.js');

        NwSocket = require('./NwSocket.js');
    } else {

    }

    //#endregion
    var NwConn = Class(function () {

        return {
            //$singleton: true,
            wsServerList: new Nw.HashTable(),
            wsClientList: new Nw.HashTable(),

            constructor: function (passkey) {
                //var self = this;               
            },

            activeConn: function (wsServerUrl, firstConnect) {
                var self = this;

                var wsClient = new NwWsClient(wsServerUrl);

                wsClient.setOnConnectEventListener(function (socket) {

                    var id = wsClient.getId();
                    self.wsClientList.addItem(id, wsClient);

                    if (self._onConnectEventListener) {
                        self._onConnectEventListener(new NwSocket(socket, 'active'));
                    }

                    if (firstConnect) {
                        firstConnect();
                        firstConnect = null
                    }
                });

                wsClient.setOnDisconnectEventListener(function (socket) {

                    //exeption for socket.io client can not get id direct form disconnected socket
                    var disconnectId = wsClient.getId();

                    //console.log('disconnect ' + disconnectId);


                    self.wsClientList.removeItem(disconnectId);

                    if (self._onDisconnectEventListener) {
                        self._onDisconnectEventListener(new NwSocket(socket, 'active', disconnectId));
                    }
                });

                wsClient.setOnMessageEventListener(function (socket, msgObj, fn) {

                    if (self._onMessageEventListener) {   
                        try {
                            self._onMessageEventListener(new NwSocket(socket, 'active'), msgObj, fn);

                        } catch (e) {
                            //throw e;
                            console.log('err setOnMessageEventListener :' + e.message);
                        }
                    }
                });
            },
            passiveConn: function (appServer, port, ip) {
                var self = this;

                var wsServer = new NwWsServer(appServer);

                var key;
                if (port) {
                    if (!ip) {
                        ip = '0.0.0.0'
                    }

                    key = ip + ':' + port;

                } else {
                    key = Nw.getGUID();
                }

                this.wsServerList.addItem(key, wsServer);

                wsServer.setOnConnectEventListener(function (socket) {

                    if (self._onConnectEventListener) {
                        self._onConnectEventListener(new NwSocket(socket, 'passive'));
                    }
                });

                wsServer.setOnDisconnectEventListener(function (socket) {
                    //var disconnectId = socket.id;
                    //console.log('disconnect ' + socket.id);

                    //self.wsClientList.removeItem(disconnectId);

                    if (self._onDisconnectEventListener) {
                        self._onDisconnectEventListener(new NwSocket(socket, 'passive'));
                    }
                });

                wsServer.setOnMessageEventListener(function (socket, msgObj, fn) {
                    if (self._onMessageEventListener) {
                        try {
                            self._onMessageEventListener(new NwSocket(socket, 'passive'), msgObj, fn);
                        } catch (e) {
                            //throw e;
                            console.log('err WsServer :' + e);
                        }
                    }
                });
            },

            getIds: function () {
                var ids = [];

                if (this.wsServerList.getLength()) {

                    this.wsServerList.each(function (key, wsServer) {
                        ids.push.apply(ids, wsServer.getIds());
                    });

                }

                if (this.wsClientList.getLength()) {
                    ids.push.apply(ids, this.wsClientList.keys());
                }

                return ids;
            },
            getIps: function () {
                var ips = [];

                if (this.wsServerList.getLength()) {

                    this.wsServerList.each(function (key, wsServer) {
                        ips.push.apply(ips, wsServer.getIps());
                    });
                }

                if (this.wsClientList.getLength()) {
                    this.wsClientList.each(function (id, wsClient) {
                        ips.push(wsClient.getIp());
                    });
                }

                return ips;
            },

            getSockets: function () {
                var sockets = [];

                if (this.wsServerList.getLength()) {

                    this.wsServerList.each(function (key, wsServer) {
                        var connectedSockets = wsServer.getSockets();

                        for (var i in connectedSockets) {
                            var socket = connectedSockets[i];

                            sockets.push(new NwSocket(socket, 'passive'));
                        }
                    });
                }

                if (this.wsClientList.getLength()) {
                    this.wsClientList.each(function (key, vsClient) {
                        sockets.push(new NwSocket(vsClient.socket, 'active'));
                    });
                }

                return sockets;
            },

            getSocketDiscriptions: function () {
                var sockets = this.getSockets();

                var discriptions = [];

                for (var i in sockets) {
                    var socket = sockets[i];

                    var discription = {
                        ip: socket.getIp(),
                        sid: socket.getId()
                    };
                    discriptions.push(discription);
                }
                return discriptions;
            },

            getPassiveSocket: function () {
                if (this.wsServerList.getLength()) {

                    this.wsServerList.each(function (key, wsServer) {
                        ids.push.apply(ids, wsServer.getIds());
                    });
                }
            },
            getActiveSocket: function () {
                if (this.wsClientList.getLength()) {
                    ids.push.apply(ids, this.wsClientList.keys());
                }
                else {
                    return null;
                }
            },

            callService: function (msg, data, cb, socketId) {

                if (socketId) {
                    var wsClient = this.wsClientList.getItem(socketId);
                    wsClient.callService(msg, data, cb);
                }
                else {
                    this.wsClientList.each(function (id, wsClient) {
                        wsClient.callService(msg, data, cb);
                    });
                }

                this.wsServerList.each(function (id, wsServer) {
                    wsServer.callService(msg, data, cb, socketId);
                });
            },

            regEvent: function (eventName, cb, socketId) { //registerEvent

                if (socketId) {

                    if (this.wsClientList.hasKey(socketId)) {
                        this.wsClientList.getItem(socketId).regEvent(eventName, cb);
                    }
                    if (this.wsServerList.hasKey(socketId)) {
                        this.wsServerList.getItem(socketId).regEvent(eventName, cb);
                    }
                }
                else {
                    this.wsClientList.each(function (id, wsClient) {
                        //console.log('regEvent ' + eventName);
                        wsClient.regEvent(eventName, cb);
                    });

                    this.wsServerList.each(function (id, wsServer) {
                        //console.log('regEvent ' + eventName);
                        wsServer.regEvent(eventName, cb);
                    });
                }
            },

            emitEvent: function (eventName, resultObj, cb) {
             
                this.wsClientList.each(function (id, wsClient) {
                    //console.log('emitEvent ' + eventName);
                    wsClient.emitEvent(eventName, resultObj, cb);
                });

                this.wsServerList.each(function (id, wsServer) {
                    //console.log('emitEvent ' + eventName);
                    wsServer.emitEvent(eventName, resultObj, cb);
                });
            },


            //#region eventListener
            _onConnectEventListener: null,
            setOnConnectEventListener: function (eventListener) {
                this._onConnectEventListener = eventListener;
            },

            _onDisconnectEventListener: null,
            setOnDisconnectEventListener: function (eventListener) {
                this._onDisconnectEventListener = eventListener;
            },
            _onMessageEventListener: null,
            setOnMessageEventListener: function (eventListener) {
                this._onMessageEventListener = eventListener;
            }
            //#endregion
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwConn;
    } else {

        context.NwConn = NwConn;
    }

})(this);
