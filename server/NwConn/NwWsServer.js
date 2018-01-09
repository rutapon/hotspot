/// <reference path="../../lib/step/step.js" />
/// <reference path="../../lib/NwLib.js" />

/// <reference path="../NwDataMsgObj.js" />

//#region requre
if (typeof module !== "undefined") {

    Step = require('../../lib/step/step.js');
    NwLib = require('../../lib/NwLib.js');
    Class = NwLib.Nwjsface.Class;
    NwDataMsgObj = require('../NwDataMsgObj.js');

    //http = require('http');
    sio = require('socket.io');
    //NwSocket = require('../NwSocket.js');
}
//#endregion

var NwWsServer = Class(function () {

    return {
        //$singleton: true,
        io: {},
        //soket: {},
        connectCounter:0,

        constructor: function (appServer) {

            this.io = sio.listen(appServer);

            this.io.set('origins', '*:*');

            this._initConnectionListen();
        },

        _initConnectionListen: function () {
            var self = this;
            self.io.on('connection', function (socket) {
                //console.log('a user connected');

                self.connectCounter++;

                if (self._onConnectEventListener) {
                    self._onConnectEventListener(socket);
                }

                socket.on('cmd', function (msgObj, fn) {

                    if (self._onMessageEventListener) {
                        try {
                            self._onMessageEventListener(socket, msgObj, fn);
                        } catch (e) {
                            throw e;
                            console.log('err WsServer :' + e);
                        }
                    }
                });

                socket.on('disconnect', function () {
                    //io.sockets.emit('user disconnected');
                    self.connectCounter--;

                    if (self._onDisconnectEventListener) {
                        self._onDisconnectEventListener(this);
                    }

                    //console.log('user disconnected '+this.id);
                });
            });
        },

        getIds: function () {
            var socketIds = [];
            for (var socketId in this.io.sockets.connected) {
                socketIds.push(socketId);
            }

            return socketIds;
            //for (var socket in wsServer.getIds()) {
            //    console.log(socket);
            //    //console.log(wsServer.io.sockets.connected[socket].handshake.address);

            //    //console.log(wsServer.io.sockets.connected[socket].handshake.address);
            //}
        },

        getIps: function () {
            var socketIps = [];
            for (var socketId in this.io.sockets.connected) {
                socketIps.push(this.io.sockets.connected[socketId].handshake.address);
            }
            return socketIps;
        },
        getSockets:function () {
            var sockets = [];

            for (var socketId in this.io.sockets.connected) {
                sockets.push(this.io.sockets.connected[socketId]);
            }

            return sockets;
        },

        disconnect: function (socketId) {
            this.io.sockets.connected[socketId].disconnect();
        },

        callService: function (msg, data, cb, socketId) {
            var msgObj = new NwDataMsgObj();

            msgObj.msg = msg;
            msgObj.cat = 'callService';

            msgObj.data = data;
            msgObj.type = data ? typeof data : null;

            this.sendMsgObj(msgObj, function (msgObj) {
                if (cb) cb(msgObj.data, msgObj.type);
            }, socketId);
        },

        sendMsgObj: function (msgObj, cb, socketId) {

            if (socketId) {
                var socket = this.io.sockets.connected[socketId];

                if (socket) {
                    socket.emit('cmd', msgObj, cb); //cb <- (msgObj)
                }

            } else {

                if (cb) {

                    for (var socketId in this.io.sockets.connected) {
                        this.sendMsgObj(msgObj, cb, socketId)
                    }
                } else {
                    this.sendMsgObjToAll(msgObj);
                }
                //this.io.emit('cmd', msgObj); //cb <- (msgObj)
            }

        },

        sendMsgObjToAll: function (msgObj) {
            this.io.emit('cmd', msgObj); //cb <- (msgObj)
        },

        regEvent: function (eventName, cb, socketId) { //registerEvent

            var self = this;
            if (socketId) {
                var socket = this.io.sockets.connected[socketId];

                socket.on(eventName, function (msgObj) {
                    cb(msgObj.data, msgObj.type);
                });
            } else {

                this.io.on(eventName, function (msgObj) {
                    cb(msgObj.data, msgObj.type);
                });
            }
        },

        emitEvent: function (eventName, resultObj, cb, socketId) {
            var msgObj = new NwDataMsgObj();
            msgObj.msg = eventName;
            msgObj.cat = 'event';
            msgObj.data = resultObj;
            msgObj.type = typeof resultObj;

            if (socketId) {
                var socket = this.io.sockets.connected[socketId];
                socket.emit(eventName, msgObj.getObj(), cb);
            } else {
                this.io.emit(eventName, msgObj.getObj(), cb);
            }
        },

        processService: function (socket, msgObj, fn) {
            //console.log('message: ' + JSON.stringify(msgObj));
            var self = this;
            var resultMsgObj;// = new NwDataMsgObj();
            var id = socket.id;

            Step(function process() {

                var next = this;

                if (msgObj.cat == 'callService') {

                    if (msgObj.msg == 'chat') {

                        msgObj.data.sendDate = new Date();
                        msgObj.data.id = id;

                        msgObj.type = typeof msgObj.data;
                        self.io.emit('chatEv', msgObj);

                        resultMsgObj = msgObj;


                        resultMsgObj.data = true;
                        return resultMsgObj
                    }
                    else {
                        NwProcessSwitching.switchMethod(msgObj, function (resultObj) {
                            next(null, resultObj);
                        });
                    }
                }
                else if (msgObj.cat == 'singUpEvent') {

                    //var room = msgObj.msg;
                    //socket.join(room);       
                    resultMsgObj = msgObj;
                    resultMsgObj.data = true;

                    return resultMsgObj;
                }

            }, function returnResult(err, resultMsgObj) {
                //console.log(msgObj.cat);
                resultMsgObj.type = typeof resultMsgObj.data;
                fn(resultMsgObj);
            });

            //socket.to(id).emit 
            //socket.to('some room').emit //emit to specific room

            //socket.broadcast.emit -> for send message to everyone else except for the socket that starts it.
            //socket.broadcast.to(id)

            //io.emit //send msg to everyone in namespace 'test dic' include this socket
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
    }
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = NwWsServer;
} else {
    context.NwWsServer = NwWsServer;
}
